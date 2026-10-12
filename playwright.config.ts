import { defineConfig } from "@playwright/test";

/*
 * E2E smoke trên production build. Server dev KHÔNG dùng cho test;
 * playwright tự khởi động `next start` sau khi build.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  retries: 0,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:3100",
    locale: "vi-VN",
    timezoneId: "Asia/Ho_Chi_Minh",
  },
  webServer: {
    command: "npx next start -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 720 } } },
  ],
});
