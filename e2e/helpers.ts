import type { Page } from "@playwright/test";

const roleConfig = {
  customer: {
    tab: "Customer",
    submit: "Login as Customer",
    identifierPlaceholder: "Enter phone or email",
    requires2fa: false,
  },
  driver: {
    tab: "driver",
    submit: "Login as Field User",
    identifierPlaceholder: "+1234567890",
    requires2fa: false,
  },
  admin: {
    tab: "Admin",
    submit: "Login as Admin",
    identifierPlaceholder: "admin@example.com",
    requires2fa: true,
  },
} as const;

async function complete2FA(page: Page) {
  await page.waitForURL(/\/two-factor/, { timeout: 10_000 });
  const otpInput = page.locator('input[inputmode="numeric"], input[type="text"]').first();
  await otpInput.click();
  await page.keyboard.type("123456");
  await page.getByRole("button", { name: "Verify and continue" }).click();
}

export async function loginAs(
  page: Page,
  role: keyof typeof roleConfig,
) {
  const config = roleConfig[role];
  await page.goto("/login");
  await page.getByRole("tab", { name: config.tab }).click();
  await page
    .getByPlaceholder(config.identifierPlaceholder)
    .fill("demo@example.com");
  await page.getByPlaceholder("Enter password").fill("password123");
  await page.getByRole("button", { name: config.submit }).click();

  if (config.requires2fa) {
    await complete2FA(page);
  }

  await page.waitForURL((url) => !url.pathname.includes("/login"), {
    timeout: 20_000,
  });
}

export async function clickDriverNav(page: Page, label: string) {
  const desktopLink = page
    .locator("header nav")
    .getByRole("link", { name: label });
  if (await desktopLink.isVisible()) {
    await desktopLink.click();
    return;
  }
  await page
    .getByRole("button", { name: /open technician navigation/i })
    .click();
  await page.getByRole("dialog").getByRole("link", { name: label }).click();
}

export async function clickCustomerNav(page: Page, label: string) {
  const desktopLink = page
    .locator("header nav")
    .getByRole("link", { name: label });
  if (await desktopLink.isVisible()) {
    await desktopLink.click();
    return;
  }
  await page
    .getByRole("button", { name: /open customer navigation/i })
    .click();
  await page.getByRole("dialog").getByRole("link", { name: label }).click();
}
