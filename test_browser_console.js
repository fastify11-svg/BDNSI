const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));

  await page.goto('http://127.0.0.1:8000/admin/login');
  await page.fill('input[name="email"]', 'admin_e2e_comm@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/dashboard');

  await page.goto('http://127.0.0.1:8000/admin/commissions');
  await page.waitForLoadState('networkidle');
  
  const content = await page.content();
  console.log("PAGE LOADED. Length:", content.length);
  
  await browser.close();
})();
