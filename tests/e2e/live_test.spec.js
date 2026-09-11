const { test, expect } = require('@playwright/test');

test.describe('Live Acceptance Verification', () => {
    test.use({ baseURL: 'https://nenobet.live', actionTimeout: 10000 });

    test('Critical Chain and End-to-End', async ({ page }) => {
        console.log('Starting Live Acceptance Verification');
        await page.goto('/admin/login');
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');
        
        await page.screenshot({ path: 'screenshots/1_admin_login.png' });
        console.log('Admin login successful');

        // Create Center B
        console.log('Creating Center B...');
        await page.goto('/admin/center/create');
        await page.fill('input[placeholder="Full Institute Name"]', 'Live Center B');
        await page.fill('input[placeholder="Director or Owner Name"]', 'Director B');
        await page.fill('input[placeholder="01700000000"]', '01711223344');
        await page.fill('input[placeholder="center@gmail.com"]', 'centerb4@bdnsi.com');
        await page.fill('input[placeholder="House, Road, Area, Market/Building Name"]', 'Demo Address 123');
        
        console.log('Filled text inputs...');
        // Select dropdowns
        const divisionSelect = page.locator('select').nth(2);
        await divisionSelect.waitFor({ state: 'attached' });
        // wait for at least 2 options
        await page.waitForFunction(() => document.querySelectorAll('select')[2].options.length > 1);
        await divisionSelect.selectOption({ index: 1 });
        
        console.log('Division selected...');
        const districtSelect = page.locator('select').nth(3);
        await page.waitForFunction(() => document.querySelectorAll('select')[3].options.length > 1);
        await districtSelect.selectOption({ index: 1 });
        
        console.log('District selected...');
        const upazilaSelect = page.locator('select').nth(4);
        await page.waitForFunction(() => document.querySelectorAll('select')[4].options.length > 1);
        await upazilaSelect.selectOption({ index: 1 });
        
        console.log('Upazila selected...');
        // Files
        await page.locator('input[type="file"]').nth(0).setInputFiles('public/blueverify.png');
        await page.locator('input[type="file"]').nth(1).setInputFiles('public/blueverify.png');
        
        console.log('Submitting Center form...');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000); const errors = await page.locator('.text-rose-500').allTextContents(); console.log('Validation Errors:', errors); await page.waitForURL('/admin/center');
        await page.screenshot({ path: 'screenshots/2_center_b_created.png' });
        console.log('Center B created');

        // Check if Center B can login
        console.log('Logging in as Center B...');
        await page.context().clearCookies();
        await page.goto('/login');
        await page.fill('input[name="email"]', 'centerb4@bdnsi.com');
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
        await page.goto('/admin/session/create');
        await page.fill('input[placeholder="E.g. 2024-2025"]', '2026-2027 Live');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/session');
        await page.screenshot({ path: 'screenshots/4_session_created.png' });
        console.log('Session created');
    });
});



