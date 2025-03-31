import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'make dev-frontend',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    cwd: '..', // <-- важный момент: запускать из корня, где Makefile
  },
});
