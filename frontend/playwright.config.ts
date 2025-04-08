import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 5000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'make dev-frontend',
    port: 3000,
    cwd: '..',
    reuseExistingServer: true,
  },
});
