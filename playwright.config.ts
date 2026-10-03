import { defineConfig, devices } from "@playwright/test";

/* e2e en Chromium, escritorio y móvil (Pixel 5: 393×851, táctil), contra el dev server de
   Vite. Y un proyecto «produccion» contra el build (`vite preview`), con el service worker:
   lo que de verdad se publica (sin conexión, trozos perezosos, índice de búsqueda).
   Playwright arranca los dos servidores. */
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
      testIgnore: [/movil\.spec\.ts/, /produccion\.spec\.ts/],
    },
    {
      name: "movil",
      use: { ...devices["Pixel 5"] },
      testMatch: /movil\.spec\.ts/,
    },
    {
      name: "produccion",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4186",
        serviceWorkers: "allow",
      },
      testMatch: /produccion\.spec\.ts/,
    },
  ],
  webServer: [
    {
      command: "npm run dev -- --port 5180 --strictPort",
      url: "http://localhost:5180",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "npm run build && npx vite preview --port 4186 --strictPort",
      url: "http://localhost:4186",
      reuseExistingServer: !process.env.CI,
      timeout: 240000,
    },
  ],
});
