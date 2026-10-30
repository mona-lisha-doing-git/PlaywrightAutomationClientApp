// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests',

  // fullyParallel: true,

  // workers: process.env.CI ? 1 : undefined,
  
  reporter: 'html',

  timeout: 30000,

  expect:{
    timeout: 50000,
  },

  use: {
    browserName: 'chromium',
    headless: false,
  },

});

