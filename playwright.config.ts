import { defineConfig, devices } from "@playwright/test";

/**
 * Optional e2e scaffold (install with: npm i -D @playwright/test && npx playwright install).
 * Smoke against production without local server by default.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.SOUL_E2E_BASE ?? "https://soulplatform.vercel.app",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
