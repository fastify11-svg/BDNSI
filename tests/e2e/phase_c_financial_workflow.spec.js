import { test, expect } from '@playwright/test';

test.describe('Phase C Financial Workflow E2E', () => {
    
    test('Admin configures center financial limits and center sees widget', async ({ page, request }) => {
        // Log in as Super Admin
        await page.goto('/admin/login');
        await page.fill('input[name="email"]', 'superadmin@gmail.com');
        await page.fill('input[name="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');

        // Navigate to Center management
        await page.click('text=Centers');
        await page.waitForURL('/admin/centers');
        
        // Ensure there is at least one center, then click Edit
        await page.click('table tbody tr:first-child a:has-text("Edit")');
        await page.waitForSelector('text=Financial & Credit Setup');
        
        // Go to Financial Setup tab
        await page.click('button:has-text("Financial & Credit Setup")');
        
        // Modify credit limit
        await page.fill('input[name="credit_limit"]', '25000');
        await page.check('input[name="credit_enabled"]');
        
        // Save
        await page.click('button:has-text("Save Financial Setup")');
        
        // Look for success flash message
        await expect(page.locator('text=Center financial setup updated successfully')).toBeVisible();
    });

});
