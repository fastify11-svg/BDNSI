const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', '12345678');
  await page.screenshot({ path: 'd:\\BDNSI\\scratch\\before_click.png' });
  
  page.on('response', response => {
    if (response.url().includes('login') && response.request().method() === 'POST') {
      console.log('LOGIN RESPONSE STATUS:', response.status());
      response.text().then(text => console.log('LOGIN RESPONSE BODY:', text.substring(0,200))).catch(e => console.log('Could not read body'));
    }
  });

  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'd:\\BDNSI\\scratch\\after_click.png' });
  console.log('Done screenshots. URL:', page.url());
  
  await browser.close();
})();
