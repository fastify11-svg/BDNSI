const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Navigating to Admin Login...');
    await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[type="email"]', 'admin@gmail.com');
    await page.fill('input[type="password"]', '12345678');
    console.log('Clicking submit...');
    await page.click('button[type="submit"]');
    
    // wait for network requests to settle
    await page.waitForTimeout(5000);
    console.log('Current URL after 5 seconds:', page.url());
    const text = await page.textContent('body');
    console.log('Body snippet:', text.substring(0, 200).replace(/\n/g, ' '));
    await page.screenshot({ path: 'scratch_screenshot_latest.png' });
    await browser.close();
})();
