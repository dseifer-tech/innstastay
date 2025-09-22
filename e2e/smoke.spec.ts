import { test, expect } from "@playwright/test";

test("home loads", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/InnstaStay/i);
});

test("api health", async ({ request }) => {
  const res = await request.get("/api/health").catch(() => null);
  expect(res?.ok()).toBeTruthy();
});
