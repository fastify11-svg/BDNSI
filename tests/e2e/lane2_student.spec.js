const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Lane 2 - Student Instrumentation', () => {
    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('http://127.0.0.1:8000/login');
        await page.fill('input[type="email"]', 'superadmin@gmail.com');
        await page.fill('input[type="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin/dashboard');
    });

    test('Observe validation failure behavior without preserveState', async ({ page }) => {
        await page.goto('http://127.0.0.1:8000/admin/student/create');

        // Create a dummy photo
        const photoPath = path.join(__dirname, 'dummy_photo.jpg');
        if (!fs.existsSync(photoPath)) {
            fs.writeFileSync(photoPath, 'dummy content for image');
        }

        // Fill Phone, DOB, Photo
        const testPhone = '01712345678';
        const testDob = '1995-05-15';
        
        await page.fill('input[name="phone"]', testPhone);
        await page.fill('input[name="date_of_birth"]', testDob);
        
        // Find the file input for picture (assuming label or input[type="file"])
        const fileInput = await page.$('input[type="file"]');
        await fileInput.setInputFiles(photoPath);

        // DO NOT fill required fields like Name, Father's Name, Mother's Name, etc.
        // This will trigger a 422 validation error.
        
        // Click Save
        await page.click('button:has-text("Save & Register Student")');

        // Wait for the validation error (usually indicated by text-red-500 or just network idle)
        await page.waitForLoadState('networkidle');
        // Wait a bit extra to see if it remounts
        await page.waitForTimeout(1000);

        // Observe the DOM values
        const phoneValue = await page.inputValue('input[name="phone"]');
        const dobValue = await page.inputValue('input[name="date_of_birth"]');
        const photoPreview = await page.$('img[alt="Photo"]'); // Assuming there's a preview

        console.log(`[INSTRUMENTATION] Post-Validation Phone: "${phoneValue}"`);
        console.log(`[INSTRUMENTATION] Post-Validation DOB: "${dobValue}"`);
        console.log(`[INSTRUMENTATION] Post-Validation Photo Preview exists: ${!!photoPreview}`);

        // We assert what actually happens. Currently, we suspect they are lost.
        // We will output this to the terminal so we can see it.
        
        // Clean up
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }
    });
});
