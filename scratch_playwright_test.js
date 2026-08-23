const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('response', response => {
    if (response.url().includes('login') && response.request().method() === 'POST') {
      console.log('LOGIN RESPONSE STATUS:', response.status());
      response.text().then(text => console.log('LOGIN RESPONSE BODY:', text.substring(0,200))).catch(e => console.log('Could not read body'));
    }
  });

  await page.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', '12345678');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000);
  console.log('Current URL:', page.url());
  const body = await page.innerHTML('body');
  if (body.includes('These credentials do not match')) {
    console.log('Login failed: Bad credentials');
  } else if (body.includes('CSRF')) {
    console.log('Login failed: CSRF');
  } else {
    console.log('No visible errors on page.');
  }
  
  await browser.close();
})();
