const { test, expect } = require('@playwright/test');

test.describe('Authentication E2E Tests', () => {

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const centerEmail = process.env.CENTER_EMAIL;
  const centerPassword = process.env.CENTER_PASSWORD;

  test.beforeAll(() => {
    if (!adminEmail || !adminPassword || !centerEmail || !centerPassword) {
      console.warn('WARNING: Missing CI credentials (ADMIN_EMAIL, ADMIN_PASSWORD, CENTER_EMAIL, CENTER_PASSWORD) in process.env. Using dummy values for local development if not in CI.');
    }
  });

  const getAdminEmail = () => process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const getAdminPassword = () => process.env.ADMIN_PASSWORD || '12345678';
  const getCenterEmail = () => process.env.CENTER_EMAIL || 'center@bdnsi.com';
  const getCenterPassword = () => process.env.CENTER_PASSWORD || '12345678';


  test('Admin login success', async ({ page }) => {
    await page.goto('./admin/login');
    await page.fill('input[name="email"]', getAdminEmail());
    await page.fill('input[name="password"]', getAdminPassword());
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('Admin login failure with wrong password', async ({ page }) => {
    await page.goto('./admin/login');
    await page.fill('input[name="email"]', getAdminEmail());
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should stay on login and show error
    await expect(page).toHaveURL(/.*admin\/login/);
    await expect(page.locator('text=These credentials do not match our records.')).toBeVisible();
  });

  test('Center user login success', async ({ page }) => {
    // Note: Assuming a default center user is seeded
    await page.goto('./login');
    await page.fill('input[name="email"]', getCenterEmail());
    await page.fill('input[name="password"]', getCenterPassword());
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('Logout works', async ({ page }) => {
    await page.goto('./admin/login');
    await page.fill('input[name="email"]', getAdminEmail());
    await page.fill('input[name="password"]', getAdminPassword());
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*admin\/dashboard/);

    // Logout process using data-testid
    const userMenuButton = page.getByTestId('user-menu');
    if (await userMenuButton.isVisible()) {
        await userMenuButton.click();
    }
    
    // Find the link or button that says Log Out
    const logoutBtn = page.getByTestId('logout-btn');
    if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
    } else {
        // Fallback for current ui
        await page.goto('./admin/logout'); // this might be a get request or need form submit
    }

    // Wait for redirect
    await expect(page).toHaveURL(/\/(admin\/login)?$/);
  });

});
