import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
        console.log(`[Console ${msg.type()}]`, msg.text());
    });
    page.on('pageerror', err => {
        errors.push(err.message);
        console.log('[Page Error]', err.message);
    });

    console.log('Navigating to http://127.0.0.1:8000/admin/login');
    const response = await page.goto('http://127.0.0.1:8000/admin/login');
    console.log('Response status:', response.status());

    try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log('Network idle reached.');
    } catch (e) {
        console.log('Timeout waiting for networkidle');
    }

    const html = await page.content();
    fs.writeFileSync('C:/Users/Naeem/.gemini/antigravity-ide/brain/ef0e47b6-62a9-4888-bdac-8d04ca445a79/scratch/rendered_login.html', html);
    console.log('Saved rendered HTML to rendered_login.html');

    if (html.includes('name="email"')) {
        console.log('Input name="email" FOUND in HTML.');
    } else {
        console.log('Input name="email" NOT FOUND in HTML.');
    }

    await browser.close();
})();
