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
  await page.type('input[type="email"]', 'admin@gmail.com');
  await page.type('input[type="password"]', '12345678');
  
  console.log('Dispatching submit manually');
  const result = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return 'No form found';
    
    // Check if the form is valid according to HTML5 validation
    const isValid = form.checkValidity();
    if (!isValid) return 'Form is INVALID';
    
    // Call the React submit handler if attached, otherwise just submit
    const event = new Event('submit', { cancelable: true, bubbles: true });
    form.dispatchEvent(event);
    return 'Dispatched';
  });
  console.log('Evaluate result:', result);
  
  await page.waitForTimeout(3000);
  console.log('Done. Current URL:', page.url());
  
  await browser.close();
})();
