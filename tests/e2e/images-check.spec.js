const { test, expect } = require('@playwright/test');



test.describe('Image loading and layout checks on live', () => {

  test('Check homepage images', async ({ page }) => {
    const response = await page.goto('./');
    expect(response.status()).toBe(200);

    // removed networkidle

    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        await expect(async () => {
          const isLoaded = await img.evaluate((node) => node.complete && node.naturalWidth > 0);
          expect(isLoaded, `Image failed to load: ${src}`).toBeTruthy();
        }).toPass({ timeout: 5000 });
      }
    }
  });

  test('Check login page images', async ({ page }) => {
    const response = await page.goto('./admin/login');
    expect(response.status()).toBe(200);

    // removed networkidle

    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        const isLoaded = await img.evaluate((node) => node.complete && node.naturalWidth > 0);
        expect(isLoaded, `Image failed to load on login page: ${src}`).toBeTruthy();
      }
    }
  });

});
