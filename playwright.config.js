import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    headless:false,
    browserName:'chromium',
    screenshot:'on-first-failure',
    video:'on-first-retry',
    actionTimeout:6000,
    navigationTimeout:3000,
    trace: 'on-first-retry',
    headless:false
  },
});

