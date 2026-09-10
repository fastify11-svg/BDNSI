const { test, expect } = require('@playwright/test');

test.describe('Live Audit E2E Tests', () => {
  

  const getAdminEmail = () => 'admin@gmail.com';
  const getAdminPassword = () => '12345678';
  const getCenterEmail = () => 'user@gmail.com';
  const getCenterPassword = () => '12345678'; // or 'password'

  test('Homepage renders correctly instead of hello from root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BDNSI|E2E Portal Name/);
  });

  test('Admin login and dashboard', async ({ page }) => {
    await page.goto('./admin/login');
    await page.fill('input[name="email"]', getAdminEmail());
    await page.fill('input[name="password"]', getAdminPassword());
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.locator('text=Total Center').first()).toBeVisible();
  });

  test('Sub-Admin (Center) login and dashboard', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('request', request => console.log('>>', request.method(), request.url()));
    page.on('response', response => console.log('<<', response.status(), response.url()));
    
    await page.goto('./login');
    await page.fill('input[name="email"]', getCenterEmail());
    
    // Attempt login with 12345678 first
    await page.fill('input[name="password"]', getCenterPassword());
    await page.click('button[type="submit"]');

    // If it fails with "These credentials do not match our records." we might try 'password'
    // For now we'll just expect it to work if the seeder was right
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Now verify the center dashboard loads
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

});
