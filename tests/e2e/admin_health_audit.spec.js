const { test, expect } = require('@playwright/test');

test.describe('Admin Panel Health Audit', () => {
    test('Crawl all sidebar links and check for errors', async ({ page }) => {
        test.setTimeout(300000); // 5 minutes timeout for the whole test
        const errors = [];
        const consoleErrors = [];
        const brokenLinks = [];

        // Listen for console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push({ url: page.url(), message: msg.text() });
            }
        });

        // Listen for page errors (uncaught exceptions)
        page.on('pageerror', exception => {
            consoleErrors.push({ url: page.url(), message: exception.message });
        });

        // Listen for response errors (4xx, 5xx)
        page.on('response', response => {
            const status = response.status();
            if (status >= 400 && response.request().resourceType() === 'document') {
                errors.push({ url: response.url(), status: status });
            }
        });

        console.log('Navigating to Admin Login...');
        await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'domcontentloaded', timeout: 120000 });
        
        // Wait for domcontentloaded
        await page.waitForLoadState('domcontentloaded');

        // Fill login
        await page.fill('input[type="email"]', 'admin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');

        await page.waitForURL('http://127.0.0.1:8000/admin/dashboard', { waitUntil: 'domcontentloaded', timeout: 15000 });
        console.log('Logged in successfully!');

        // Wait for sidebar to load
        await page.waitForSelector('aside', { timeout: 10000 });

        // Get all links in the sidebar
        const sidebarLinks = await page.$$eval('aside a', links => {
            return links
                .map(a => a.href)
                .filter(href => href.startsWith('http://127.0.0.1:8000/admin') && !href.includes('#'));
        });

        // Remove duplicates
        const uniqueLinks = [...new Set(sidebarLinks)];
        console.log(`Found ${uniqueLinks.length} unique links to check.`);

        // Crawl links
        for (const link of uniqueLinks) {
            console.log(`Checking link: ${link}`);
            try {
                const response = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 10000 });
                if (response && !response.ok()) {
                    brokenLinks.push({ url: link, status: response.status() });
                }
                
                // Extra check for Inertia error modals or Laravel error pages
                const bodyText = await page.textContent('body');
                if (bodyText.includes('TypeError') || bodyText.includes('QueryException') || bodyText.includes('ErrorException')) {
                    brokenLinks.push({ url: link, status: 'PHP/Inertia Exception Rendered on Screen' });
                }

                // Check for 403 / 404 in text
                if (bodyText.includes('403') && bodyText.includes('Forbidden') || bodyText.includes('This action is unauthorized.')) {
                    brokenLinks.push({ url: link, status: 403 });
                }
                if (bodyText.includes('404') && bodyText.includes('Not Found')) {
                    brokenLinks.push({ url: link, status: 404 });
                }
                
                // Go back to dashboard to reset state if needed
                if (link !== 'http://127.0.0.1:8000/admin/dashboard') {
                   await page.goto('http://127.0.0.1:8000/admin/dashboard', { waitUntil: 'domcontentloaded', timeout: 10000 });
                }

            } catch (e) {
                console.error(`Failed to navigate to ${link}: ${e.message}`);
                brokenLinks.push({ url: link, status: 'Navigation Timeout or Failure' });
            }
        }

        // Print Report
        console.log('\n--- HEALTH AUDIT REPORT ---');
        console.log('\n[HTTP Errors / Broken Links]');
        if (brokenLinks.length === 0 && errors.length === 0) {
            console.log('None found. All pages loaded with 200 OK.');
        } else {
            console.log(JSON.stringify([...brokenLinks, ...errors], null, 2));
        }

        console.log('\n[JavaScript Console Errors]');
        if (consoleErrors.length === 0) {
            console.log('None found.');
        } else {
            console.log(JSON.stringify(consoleErrors, null, 2));
        }
    });
});
