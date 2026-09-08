const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  try {
    await page.goto('http://127.0.0.1:8000/admin/login');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    await page.goto('http://127.0.0.1:8000/admin/commissions');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const visible = await page.isVisible('text=E2E Staff Agent');
    console.log("Is E2E Staff Agent visible? ", visible);
    
    if (!visible) {
        console.log("Not visible, dumping HTML...");
        const html = await page.content();
        require('fs').writeFileSync('admin_commissions_final.html', html);
    }
  } catch(e) {
    console.log("SCRIPT EXCEPTION:", e);
  } finally {
    await browser.close();
  }
})();
