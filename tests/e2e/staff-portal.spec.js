const { test, expect } = require('@playwright/test');

test.describe('Staff Portal E2E Tests', () => {

  const getStaffEmail = () => process.env.STAFF_EMAIL || 'staff@gmail.com';
  const getStaffPassword = () => process.env.STAFF_PASSWORD || '12345678';

  test.beforeEach(async ({ page }) => {
    // Login as a Staff user before each test
    await page.goto('./staff/login');
    await page.fill('input[type="text"]', getStaffEmail());
    await page.fill('input[type="password"]', getStaffPassword());
    await page.click('button[type="submit"]');
    
    // Wait for the dashboard to load
    await expect(page).toHaveURL(/.*staff\/dashboard/);
  });

  test('Staff can view Dashboard', async ({ page }) => {
    // Check that the dashboard heading is visible
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('Staff can view assigned centers', async ({ page }) => {
    // Navigate to centers list
    await page.goto('./staff/center');
    await expect(page).toHaveURL(/.*staff\/center/);
    
    // Check that the table or heading is visible
    await expect(page.locator('text=Center').first()).toBeVisible();
  });

});
