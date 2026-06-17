import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("forgot password has no serious axe violations", async ({ page }) => {
  await page.goto("/forgot-password");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious).toEqual([]);
});

test("login page has no serious axe violations", async ({ page }) => {
  await page.goto("/login");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious).toEqual([]);
});
