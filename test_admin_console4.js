const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', async msg => {
      console.log('BROWSER LOG:', msg.type(), msg.text());
      if (msg.type() === 'error') {
          for (const arg of msg.args()) {
              try {
                  const val = await arg.jsonValue();
                  console.log('ARG:', val);
              } catch(e) {
                  const props = await arg.getProperties();
                  console.log('ARG PROPS:');
                  for (const [name, handle] of props) {
                      const pv = await handle.jsonValue().catch(()=>'');
                      console.log(`  ${name}: ${pv}`);
                  }
              }
          }
      }
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err));

  try {
    await page.goto('http://127.0.0.1:8000/admin/login');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    await page.goto('http://127.0.0.1:8000/admin/commissions');
    await page.waitForTimeout(5000); // WAIT 5 SECONDS FOR REACT TO CRASH AND PRINT
  } catch(e) {
    console.log("SCRIPT EXCEPTION:", e);
  } finally {
    await browser.close();
  }
})();
