const { test, expect } = require('@playwright/test');

test('LIVE-008: Test sidebar navigation after session modal', async ({ page }) => {
    // Login
    await page.goto('http://127.0.0.1:8000/login');
    await page.fill('input[type="email"]', 'superadmin@bdnsi.org');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Go to Session page
    await page.waitForURL('**/admin/dashboard');
    await page.goto('http://127.0.0.1:8000/admin/session');
    
    // Open modal
    await page.click('button:has-text("Add New Session")');
    await page.waitForSelector('text="Add New Session"');
    
    // Close modal
    await page.click('button:has-text("Cancel")');
    
    // Click a sidebar link
    await page.click('aside a[href*="admin/center"]');
    
    // Assert navigation happened
    await page.waitForURL('**/admin/center');
    const header = await page.locator('h1, h2, h3').filter({ hasText: 'Centers' }).first();
    await expect(header).toBeVisible();
});
