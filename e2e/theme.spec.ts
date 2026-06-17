import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

async function assertReadableContrast(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
) {
  const contrast = await locator.first().evaluate((el) => {
    function parseColor(color: string) {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      if (!context) return null;

      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
      if (alpha === 0) return null;
      return [r, g, b] as const;
    }

    function luminance([r, g, b]: readonly [number, number, number]) {
      const channels = [r, g, b].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }

    let backgroundNode: Element | null = el;
    let backgroundColor = "transparent";
    while (backgroundNode && backgroundNode !== document.documentElement) {
      const style = window.getComputedStyle(backgroundNode);
      if (
        style.backgroundColor &&
        !/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/.test(style.backgroundColor)
      ) {
        backgroundColor = style.backgroundColor;
        break;
      }
      backgroundNode = backgroundNode.parentElement;
    }

    const foreground = window.getComputedStyle(el).color;
    const fg = parseColor(foreground);
    const bg = parseColor(backgroundColor);
    if (!fg || !bg) return null;

    const lighter = Math.max(luminance(fg), luminance(bg));
    const darker = Math.min(luminance(fg), luminance(bg));
    return (lighter + 0.05) / (darker + 0.05);
  });

  expect(contrast).not.toBeNull();
  expect(contrast!).toBeGreaterThanOrEqual(4.5);
}

test("theme toggles dark class on html", async ({ page }) => {
  await page.goto("/forgot-password");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: /switch to dark mode/i }).click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test("viewport screenshots for handoff", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.screenshot({
    path: "e2e/screenshots/login-mobile-light.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({
    path: "e2e/screenshots/login-desktop-light.png",
    fullPage: true,
  });
});

test("customer portal stays readable in dark mode", async ({ page }) => {
  await loginAs(page, "customer");
  await page.getByRole("button", { name: /switch to dark mode/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await expect(page.getByText("Electrical panel upgrade")).toBeVisible();
  await assertReadableContrast(page, page.getByText("Electrical panel upgrade"));

  await expect(page.getByText("Technician en route").first()).toBeVisible();
  await assertReadableContrast(page, page.getByText("Technician en route").first());

  await page.goto("/customer/active-rides");
  await expect(page.getByRole("heading", { name: "Active Service" })).toBeVisible();
  await assertReadableContrast(page, page.getByText("Technician en route").first());
});
