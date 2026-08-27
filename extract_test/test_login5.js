const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('response', response => {
    if (response.url().includes('login') && response.request().method() === 'POST') {
      console.log('LOGIN RESPONSE STATUS:', response.status());
    }
  });

  await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', '12345678');
  console.log('Pressing Enter');
  await page.press('input[type="password"]', 'Enter');
  
  await page.waitForTimeout(3000);
  console.log('Done');
  
  await browser.close();
})();
