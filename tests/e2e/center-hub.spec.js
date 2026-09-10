const { test, expect } = require('@playwright/test');

test.describe('Center Hub E2E Tests (Orders & Certificates)', () => {

  const getCenterEmail = () => process.env.CENTER_EMAIL || 'center@bdnsi.com';
  const getCenterPassword = () => process.env.CENTER_PASSWORD || '12345678';

  test.beforeEach(async ({ page }) => {
    // 1. Ensure test prerequisites (Center and User)
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    await exec(`C:\\xampp\\php\\php.exe artisan tinker --execute="$c=App\\Models\\Center::firstOrCreate(['email'=>'center@bdnsi.com'],['name'=>'E2E Center','code'=>'E2E02','status'=>1]); App\\Models\\User::firstOrCreate(['email'=>'center@bdnsi.com'],['name'=>'E2E User','username'=>'center','password'=>Illuminate\\Support\\Facades\\Hash::make('12345678'),'center_id'=>$c->id]);"`);

    // Login as a Center user before each test
    await page.goto('./login');
    await page.fill('input[name="email"]', getCenterEmail());
    await page.fill('input[name="password"]', getCenterPassword());
    await page.click('button[type="submit"]');
    
    // Wait for the dashboard to load
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Center can view Order Invoices Hub', async ({ page }) => {
    // Navigate to orders
    await page.goto('./center/orders');
    await expect(page).toHaveURL(/.*center\/orders/);
    
    // Check that the table or heading is visible
    await expect(page.locator('text=Order History').first()).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('Center can view Certificate Hub', async ({ page }) => {
    // Navigate to certificates
    await page.goto('./center/certificates');
    await expect(page).toHaveURL(/.*center\/certificates/);
    
    // Check that the filter and table are visible
    await expect(page.locator('text=Certificate & Document Hub').first()).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });

});
