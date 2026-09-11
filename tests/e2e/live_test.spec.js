const { test, expect } = require('@playwright/test');

test.describe('Live Acceptance Verification', () => {
    test.use({ baseURL: 'https://nenobet.live', actionTimeout: 10000 });

    test('Critical Chain and End-to-End', async ({ page }) => {
        console.log('Starting Live Acceptance Verification');
        
        const randomStr = Math.random().toString(36).substring(2, 8);
        const dynamicEmail = `centerb_${randomStr}@bdnsi.com`;

        // 1. Admin logs in
        await page.goto('/admin/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');
        console.log('Admin login successful');

        // 2. Admin creates Center B
        console.log('Creating Center B...');
        await page.goto('/admin/center/create');
        await page.fill('input[placeholder="Full Institute Name"]', 'Live Center B');
        await page.fill('input[placeholder="Director or Owner Name"]', 'Director B');
        await page.fill('input[placeholder="Father\'s name"]', 'Father B');
        await page.fill('input[placeholder="01700000000"]', '01711223344');
        await page.fill('input[placeholder="center@gmail.com"]', dynamicEmail);
        await page.fill('input[placeholder="House, Road, Area, Market/Building Name"]', 'Demo Address 123');
        
        console.log('Filled text inputs...');
        
        // Select dropdowns
        await page.selectOption('select:has-text("Select Division")', { index: 1 });
        await page.waitForTimeout(500);
        console.log('Division selected...');

        await page.selectOption('select:has-text("Select District")', { index: 1 });
        await page.waitForTimeout(500);
        console.log('District selected...');

        await page.selectOption('select:has-text("Select Upazila")', { index: 1 });
        await page.waitForTimeout(500);
        console.log('Upazila selected...');
        
        // Files
        await page.locator('input[type="file"]').nth(0).setInputFiles('public/blueverify.png');
        await page.locator('input[type="file"]').nth(1).setInputFiles('public/blueverify.png');
        
        console.log('Submitting Center form...');
        await page.click('button[type="submit"]');

        try {
            await page.waitForURL('/admin/center', { timeout: 15000 });
            await page.screenshot({ path: 'screenshots/2_center_b_created.png' });
            console.log('Center B created');
        } catch(e) {
            console.log('Failed to create Center B, taking screenshot of validation errors');
            await page.screenshot({ path: 'screenshots/error_center_create.png' });
            const errors = await page.$$eval('.text-red-500, .text-rose-500', els => els.map(el => el.textContent));
            console.log('Validation Errors:', errors);
            throw e;
        }

        // 3. Center B logs in (simulate separate session)
        console.log('Logging in as Center B...');
        await page.context().clearCookies();
        await page.goto('/login');
        await page.fill('input[name="email"]', dynamicEmail);
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        try {
            await page.waitForURL('/dashboard');
            await page.screenshot({ path: 'screenshots/3_center_b_login.png' });
            console.log('Center B login successful');
        } catch(e) {
            console.log('Failed to login Center B, taking error screenshot');
            await page.screenshot({ path: 'screenshots/error_center_login.png' });
            throw e;
        }

        // Proceed to Create Session
        console.log('Logging back as admin to create Session...');
        await page.goto('/admin/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');

        console.log('Creating Session...');
        await page.goto('/admin/session');
        await page.click('button:has-text("Add New Session")');
        await page.fill('input[placeholder="e.g. 2023-2024 or Jan-Jun 2024"]', '2026-2027 Live');
        await page.fill('input[placeholder="e.g. 3 or 6"]', '12');
        await page.click('button:has-text("Save Session")');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'screenshots/4_session_created.png' });
        console.log('Session created');
    });
});



