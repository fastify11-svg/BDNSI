const { test, expect } = require('@playwright/test');

test('Sidebar Navigation from Session', async ({ page }) => {
    // Login
    await page.goto('./login');
    await page.fill('input[name="email"]', 'admin@bdnsi.gov.bd');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');

    // Go to Session
    await page.click('a[href$="/admin/session"]');
    await page.waitForURL('**/admin/session');

    // Click on Center
    await page.click('a[href$="/admin/center"]');
    await page.waitForURL('**/admin/center');
    expect(page.url()).toContain('/admin/center');
    
    // Go back to Session
    await page.click('a[href$="/admin/session"]');
    await page.waitForURL('**/admin/session');
    
    // Click on Center Risk
    await page.click('a[href$="/admin/center-risk"]');
    await page.waitForURL('**/admin/center-risk');
    expect(page.url()).toContain('/admin/center-risk');
    
    // Go back to Session
    await page.click('a[href$="/admin/session"]');
    await page.waitForURL('**/admin/session');
    
    // Click on Leads
    await page.click('a[href$="/admin/leads"]');
    await page.waitForURL('**/admin/leads');
    expect(page.url()).toContain('/admin/leads');

    console.log('Sidebar navigation successful for Center, Center Risk, and Leads.');
});
