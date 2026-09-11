const { test, expect } = require('@playwright/test');

test.describe('Lane 1 - Center Regression', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://127.0.0.1:8000/login');
        await page.fill('input[type="email"]', 'superadmin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin/dashboard');
    });

    test('Rapid programmatic multi-field filling survives without clearing', async ({ page }) => {
        await page.goto('http://127.0.0.1:8000/admin/center/create');

        // Rapid filling (similar to autofill)
        await Promise.all([
            page.fill('input[placeholder="Full Institute Name"]', 'Test Center Name'),
            page.fill('input[placeholder="01700000000"]', '01712345678'),
            page.fill('input[placeholder="center@gmail.com"]', 'test@center.com')
        ]);

        // Wait a small amount of time for React to settle
        await page.waitForTimeout(500);

        // Verify none of them cleared
        const nameVal = await page.inputValue('input[placeholder="Full Institute Name"]');
        const mobileVal = await page.inputValue('input[placeholder="01700000000"]');
        const emailVal = await page.inputValue('input[placeholder="center@gmail.com"]');

        expect(nameVal).toBe('Test Center Name');
        expect(mobileVal).toBe('01712345678');
        expect(emailVal).toBe('test@center.com');
    });

    test('Normal sequential typing survives', async ({ page }) => {
        await page.goto('http://127.0.0.1:8000/admin/center/create');

        await page.type('input[placeholder="Full Institute Name"]', 'Sequential Center');
        await page.type('input[placeholder="01700000000"]', '01798765432');
        await page.type('input[placeholder="center@gmail.com"]', 'seq@center.com');

        const nameVal = await page.inputValue('input[placeholder="Full Institute Name"]');
        const mobileVal = await page.inputValue('input[placeholder="01700000000"]');
        const emailVal = await page.inputValue('input[placeholder="center@gmail.com"]');

        expect(nameVal).toBe('Sequential Center');
        expect(mobileVal).toBe('01798765432');
        expect(emailVal).toBe('seq@center.com');
    });
});
