import { defineConfig, devices } from "@playwright/test";

/* e2e en Chromium, escritorio y móvil (Pixel 5: 393×851, táctil). Playwright arranca el
   dev server de Vite por sí mismo. */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:5180",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /movil\.spec\.ts/,
    },
    {
      name: "movil",
      use: { ...devices["Pixel 5"] },
      testMatch: /movil\.spec\.ts/,
    },
  ],
  webServer: {
    command: "npm run dev -- --port 5180 --strictPort",
    url: "http://localhost:5180",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
