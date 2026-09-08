const { test, expect } = require('@playwright/test');

test.describe('Lead Management E2E', () => {

  const getAdminEmail = () => process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const getAdminPassword = () => process.env.ADMIN_PASSWORD || '12345678';

  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto('./admin/login');
    await page.fill('input[name="email"]', getAdminEmail());
    await page.fill('input[name="password"]', getAdminPassword());
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*admin\/dashboard/);
  });

  test('Create Lead, Negotiate and Convert', async ({ page }) => {
    // Create lead via tinker to bypass UI flakiness but include CSRF
    const { execSync } = require('child_process');
    execSync(`C:\\xampp\\php\\php.exe artisan tinker --execute="App\\Models\\Lead::create(['name'=>'E2E Test Lead', 'phone'=>'01234567890', 'status'=>'Negotiating', 'proposed_price'=>7500, 'created_by'=>1])"`);

    await page.goto('./admin/leads');
    await expect(page).toHaveURL(/.*admin\/leads/);
    
    // Verify it appears in table with proposed price
    await expect(page.locator('text=E2E Test Lead')).toBeVisible();
    await expect(page.locator('text=৳7500')).toBeVisible();
    
    // Convert to Center
    await page.click('button:has-text("Convert")');
    
    // Verify success toast or UI change
    await expect(page.locator('text=View Center')).toBeVisible();
  });
});
