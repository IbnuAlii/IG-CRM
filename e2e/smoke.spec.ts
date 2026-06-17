import { test, expect } from "@playwright/test";
import { clickCustomerNav, clickDriverNav, loginAs } from "./helpers";

test.describe("portal smoke", () => {
  test("customer can reach home and quotes", async ({ page }) => {
    await loginAs(page, "customer");
    await expect(page).toHaveURL(/\/customer\/home/);
    await clickCustomerNav(page, "Quotes");
    await expect(page).toHaveURL(/\/customer\/quotes/, { timeout: 10_000 });
  });

  test("driver can reach dashboard and jobs", async ({ page }) => {
    await loginAs(page, "driver");
    await expect(page).toHaveURL(/\/driver\/dashboard/);
    await clickDriverNav(page, "My Jobs");
    await expect(page).toHaveURL(/\/driver\/jobs/, { timeout: 10_000 });
  });

  test("admin can reach dashboard", async ({ page }) => {
    await loginAs(page, "admin");
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});

test.describe("public pages", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("forgot password has theme toggle", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(
      page.getByRole("button", { name: /switch to dark mode/i }),
    ).toBeVisible();
  });
});
