const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Student Enrollment and License E2E Flow', () => {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '12345678';
  const testCnic = `999${Date.now()}`;
  const testStudentName = `E2E Student ${Date.now()}`;

  test('Admin creates student with Approved status → license auto-generated', async ({ page }) => {
    test.setTimeout(90000);
    // 1. Ensure test prerequisites
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    await exec(`C:\\xampp\\php\\php.exe artisan tinker --execute="if(App\\Models\\Session::count()===0) App\\Models\\Session::create(['name'=>'2024-2025','status'=>1]); if(App\\Models\\Subject::count()===0) App\\Models\\Subject::create(['name'=>'E2E Subject','code'=>'E2E101','status'=>1]); if(App\\Models\\Center::count()===0) App\\Models\\Center::create(['name'=>'E2E Center','code'=>'E2E01','email'=>'e2ecenter@bdnsi.com','status'=>1]); if(App\\Models\\Division::count()===0) App\\Models\\Division::create(['name'=>'E2E Division']); if(App\\Models\\District::count()===0) App\\Models\\District::create(['name'=>'E2E District','division_id'=>App\\Models\\Division::first()->id]); if(App\\Models\\Upazila::count()===0) App\\Models\\Upazila::create(['name'=>'E2E Upazila','district_id'=>App\\Models\\District::first()->id]);"`);
    
    // Create a dummy image for upload
    const dummyPath = path.resolve('dummy.jpg');
    if (!fs.existsSync(dummyPath)) {
        const minPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        fs.writeFileSync(dummyPath, minPng);
    }
    // 1. Login
    await page.goto('./admin/login');
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', exception => console.log('BROWSER ERROR:', exception));
    page.on('response', async response => {
      if(response.status() >= 500) {
        console.log('500 ERROR ON:', response.url());
        try { console.log(await response.text()); } catch(e){}
      }
      if(response.url().includes('/admin/student') && response.request().method() === 'POST') {
        console.log('POST STATUS:', response.status(), 'LOCATION:', await response.headerValue('location'));
        try {
          console.log('POST BODY:', await response.json());
        } catch(e) {}
      }
    });

    await page.waitForSelector('input[name="email"]', { timeout: 15000 });
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
    console.log('? Login OK');

    // 2. Open create page
    await page.goto('./admin/student/create');
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForTimeout(2000);

    const selects = page.locator('form select');
    const totalSelects = await selects.count();
    
    // Select all generic selects
    for (let i = 0; i < totalSelects; i++) {
        const html = await selects.nth(i).innerHTML();
        if (html.includes('Select District') || html.includes('Select Upazila') || html.includes('Pending')) {
            continue;
        }
        
        const opts = await selects.nth(i).evaluate(el => el.options.length);
        const firstVal = await selects.nth(i).evaluate(el => el.options[0]?.value);
        
        if (firstVal === '' && opts > 1) {
            await selects.nth(i).selectOption({ index: 1 });
        } else if (opts > 0) {
            await selects.nth(i).selectOption({ index: 0 });
        }
    }
    console.log('? Generic Selects OK');

    // 4. Fill text inputs
    await page.fill('input[placeholder="Enter full name"]', testStudentName);
    await page.fill('input[placeholder="NID or Birth Reg No"]', testCnic);
    await page.fill('input[placeholder="Father\'s name"]', 'Test Father');
    await page.fill('input[placeholder="Mother\'s name"]', 'Test Mother');
    await page.fill('input[placeholder="01700000000"]', '01700000000');
    console.log('? Text Inputs OK');

    // DOB
    const dateInputs = page.locator('form input[type="date"]');
    if (await dateInputs.count() > 2) await dateInputs.nth(2).fill('2000-01-01');
    else if (await dateInputs.count() > 0) await dateInputs.nth(0).fill('2000-01-01');
    console.log('? DOB OK');

    // District and Upazila
    for (let i = 0; i < totalSelects; i++) {
        const html = await selects.nth(i).innerHTML();
        if (html.includes('Select District')) {
            const districtName = await selects.nth(i).getAttribute('name');
            await page.waitForFunction((name) => {
                const select = document.querySelector(`select[name="${name}"]`);
                return select && select.options.length > 1;
            }, districtName);
            const distVal = await page.evaluate((name) => {
                return document.querySelector(`select[name="${name}"]`).options[1].value;
            }, districtName);
            await selects.nth(i).selectOption(distVal);
            console.log('? District selected');
            
            if (i + 1 < totalSelects) {
                const upazilaName = await selects.nth(i+1).getAttribute('name');
                await page.waitForFunction((name) => {
                    const select = document.querySelector(`select[name="${name}"]`);
                    return select && select.options.length > 1;
                }, upazilaName);
                const upaVal = await page.evaluate((name) => {
                    return document.querySelector(`select[name="${name}"]`).options[1].value;
                }, upazilaName);
                await selects.nth(i+1).selectOption(upaVal);
                console.log('? Upazila selected');
            }
        }
    }

    // Status -> Approved
    for (let i = 0; i < totalSelects; i++) {
      const opts = await selects.nth(i).evaluate(el =>
        Array.from(el.options).map(o => ({ text: o.text, value: o.value }))
      );
      const approvedOpt = opts.find(o => o.text.toLowerCase().includes('approved'));
      if (approvedOpt) {
        await selects.nth(i).selectOption(approvedOpt.value);
        console.log('? Status set to Approved (value:', approvedOpt.value, ')');
        break;
      }
    }

    // Upload Picture using payload directly
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
        const minPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        await fileInput.last().setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer: minPng
        });
        console.log('? Picture uploaded via payload');
    }
    
    // Remove all required attributes from all inputs to prevent browser interference
    await page.evaluate(() => {
        document.querySelectorAll('input, select, textarea').forEach(el => el.removeAttribute('required'));
    });

    // Submit
    await page.click('form button[type="submit"]');
    console.log('? Submitted');

    try {
      await page.waitForURL(url => !url.includes('/create'), { timeout: 30000 });
      console.log('? Redirect OK:', page.url());
    } catch {
      console.log('Still on:', page.url());
      await page.screenshot({ path: 'validation-error-4.png', fullPage: true });
      console.log('Screenshot saved to validation-error-4.png');
      const errors = await page.locator('p.text-rose-500.text-\\[11px\\]').allTextContents();
      console.log('VALIDATION ERRORS FOUND:', errors);
    }

    // 4. Verify License was auto-generated
    await page.goto('./admin/license');
    await page.waitForTimeout(3000);
    const pageHtml = await page.content();
    const found = pageHtml.includes(testCnic);
    console.log('License found?', found, '| CNIC:', testCnic);
    
    expect(found).toBe(true);
  });
});
