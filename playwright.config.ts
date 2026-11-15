import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  projects: [
    {name:'desktop', use:{...devices['Desktop Chrome']}},
    {name:'mobile', use:{...devices['iPhone 13'], defaultBrowserType:'chromium'}},
  ],
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
