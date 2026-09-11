const { test, expect } = require('@playwright/test');

test.describe('Lane 3 - Leads Instrumentation', () => {
    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('http://127.0.0.1:8000/login');
        await page.fill('input[type="email"]', 'superadmin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin/dashboard');
    });

    test('Observe autocomplete behavior on Phone', async ({ page }) => {
        await page.goto('http://127.0.0.1:8000/admin/leads');

        // Open Modal
        await page.click('button:has-text("Add New Lead")');
        
        // Wait for modal
        await page.waitForSelector('input[name="name"]', { state: 'visible' });

        // Fill Phone
        const testPhone = '01712345678';
        await page.fill('input[name="phone"]', testPhone);

        // Intentionally omit name or other required fields to trigger validation error
        // Actually Name is required, let's leave it blank.
        
        // Click Save
        await page.click('button:has-text("Save Lead")');

        // Wait for validation failure
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Observe DOM value
        const phoneValue = await page.inputValue('input[name="phone"]');

        console.log(`[INSTRUMENTATION] Post-Validation Leads Phone: "${phoneValue}"`);
    });
});
