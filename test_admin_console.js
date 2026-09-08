const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message || err));

  const { execSync } = require('child_process');
  execSync('C:\\xampp\\php\\php.exe artisan tinker --execute="\\App\\Models\\Admin::updateOrCreate([\'email\' => \'admin_e2e_comm@example.com\'], [\'name\' => \'Admin\', \'password\' => bcrypt(\'password\')]);"', {stdio: 'inherit'});

  try {
    await page.goto('http://127.0.0.1:8000/admin/login');
    await page.fill('input[name="email"]', 'admin_e2e_comm@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    await page.goto('http://127.0.0.1:8000/admin/commissions');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Explicitly check if element is there
    const visible = await page.isVisible('text=E2E Staff Agent');
    console.log("Is E2E Staff Agent visible? ", visible);
    
    // Dump a part of body to see what's actually there if not visible
    if (!visible) {
        const bodyText = await page.evaluate(() => document.body.innerText);
        console.log("BODY TEXT START ===");
        console.log(bodyText.substring(0, 1000));
        console.log("=== BODY TEXT END");
    }
  } catch(e) {
    console.log("SCRIPT EXCEPTION:", e);
  } finally {
    await browser.close();
  }
})();
