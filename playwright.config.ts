import { defineConfig, devices } from '@playwright/test';

/**
 * One end-to-end smoke test (npm run e2e). It builds the app, serves the
 * production build and walks through the main journey on a phone-sized screen.
 * First time on a new computer: npx playwright install chromium
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4174/',
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
    trace: 'off',
    // In some cloud containers the browser lives at a fixed path.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  projects: [
    {
      name: 'phone',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true },
    },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
