const { test, expect } = require('@playwright/test');

test.describe('Center Create Input Persistence', () => {
  const getAdminEmail = () => process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const getAdminPassword = () => process.env.ADMIN_PASSWORD || '12345678';

  test.beforeEach(async ({ page }) => {
    await page.goto('./admin/login');
    await page.fill('input[name="email"]', getAdminEmail());
    await page.fill('input[name="password"]', getAdminPassword());
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*admin\/dashboard/);
  });

  test('LIVE-001: Email and Mobile persistence', async ({ page }) => {
    await page.goto('./admin/center/create');
    await expect(page).toHaveURL(/.*admin\/center\/create/);
    
    // Type email and mobile
    const testEmail = 'persistence_test@gmail.com';
    const testMobile = '01711223344';
    
    // In React, input type="email" with no explicit name uses generic targeting
    await page.fill('input[type="email"][placeholder="center@gmail.com"]', testEmail);
    await page.fill('input[placeholder="01700000000"]', testMobile);
    
    // Blur by clicking something else
    await page.click('input[placeholder="Full Institute Name"]');
    
    // Assert they persist
    await expect(page.locator('input[type="email"][placeholder="center@gmail.com"]')).toHaveValue(testEmail);
    await expect(page.locator('input[placeholder="01700000000"]')).toHaveValue(testMobile);
  });
});
