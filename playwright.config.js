const { defineConfig } = require('@playwright/test');
const recording = process.env.PLAYWRIGHT_RECORD === '1';

module.exports = defineConfig({
  testDir: './tests',
  reporter: recording ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: recording ? 'on' : 'retain-on-failure',
    video: recording ? 'on' : 'off',
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI
  }
});
