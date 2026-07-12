import { test, expect } from "@playwright/test";

/**
 * Production smoke — run after installing Playwright:
 *   npx playwright test
 */
test.describe("SOUL production smoke", () => {
  test("home renders hero story", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/tap|unlock/i);
  });

  test("tap demo reaches ready state", async ({ page }) => {
    await page.goto("/tap/soul_demo_7k3m9q2v");
    await expect(page.locator("body")).toBeVisible();
    await expect(page).not.toHaveURL(/404/);
  });

  test("health JSON is ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body?.data?.status ?? body?.status).toBe("ok");
  });

  test("member wallet loads", async ({ page }) => {
    await page.goto("/member/wallet");
    await expect(page.locator("body")).toBeVisible();
  });
});
