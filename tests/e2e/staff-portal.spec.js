const { test, expect } = require('@playwright/test');

test.describe('Staff Portal E2E Tests', () => {

  const getStaffEmail = () => process.env.STAFF_EMAIL || 'staff@gmail.com';
  const getStaffPassword = () => process.env.STAFF_PASSWORD || '12345678';

  test.beforeEach(async ({ page }) => {
    // 1. Ensure test prerequisites (Team / Staff user)
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    await exec(`C:\\xampp\\php\\php.exe artisan tinker --execute="if(App\\Models\\Team::where('login', 'staff@gmail.com')->count()===0) App\\Models\\Team::create(['name'=>'E2E Staff Agent','login'=>'staff@gmail.com','password'=>Illuminate\\Support\\Facades\\Hash::make('12345678'),'status'=>1]);"`);

    // Login as a Staff user before each test
    await page.goto('./staff/login');
    await page.fill('input[type="text"]', getStaffEmail());
    await page.fill('input[type="password"]', getStaffPassword());
    await page.click('button[type="submit"]');
    
    // Wait for the dashboard to load
    await expect(page).toHaveURL(/.*staff\/dashboard/);
  });

  test('Staff can view Dashboard', async ({ page }) => {
    // Check that the dashboard heading is visible
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('Staff can view assigned centers', async ({ page }) => {
    // Navigate to centers list
    await page.goto('./staff/center');
    await expect(page).toHaveURL(/.*staff\/center/);
    
    // Check that the table or heading is visible
    await expect(page.locator('text=Center').first()).toBeVisible();
  });

});
