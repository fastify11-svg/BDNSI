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
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', exception => console.log('PAGE ERROR:', exception));
    
    await page.goto('./admin/leads');
    await expect(page).toHaveURL(/.*admin\/leads/);
    
    // Test LIVE-010 Input Persistence
    await page.click('button:has-text("Add New Lead")');
    const leadName = `E2E Test Lead ${Date.now()}`;
    await page.fill('input[name="name"]', leadName);
    
    // Type phone and blur to ensure it persists
    await page.fill('input[name="phone"]', '01711223344');
    await page.click('input[name="proposed_price"]'); // blur
    await expect(page.locator('input[name="phone"]')).toHaveValue('01711223344');
    
    await page.fill('input[name="proposed_price"]', '7500');
    await page.selectOption('select[name="status"]', 'Negotiating');
    await page.click('button:has-text("Save Lead")');

    await page.goto('./admin/leads');
    await expect(page).toHaveURL(/.*admin\/leads/);
    
    // Verify it appears in table with proposed price
    await expect(page.locator("text=" + leadName).first()).toBeVisible();
    await expect(page.locator('text=৳7500').first()).toBeVisible();
    
    // Convert to Center
    await page.click('button:has-text("Convert")');
    
    // Verify success toast or UI change
    await expect(page.locator('text=View Center').first()).toBeVisible();
  });
});
