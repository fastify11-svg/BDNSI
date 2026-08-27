import { chromium } from 'playwright';

(async () => {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        console.log('Navigating to http://127.0.0.1:8000 ...');
        await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle', timeout: 30000 });
        
        console.log('Taking screenshot...');
        await page.screenshot({ path: 'scratch/empty_states.png', fullPage: true });
        console.log('Screenshot saved to scratch/empty_states.png');

        const content = await page.content();
        
        const checks = [
            'No promotional banners are currently active.',
            'No active courses available right now.',
            'No recent notices available.',
            'No video content available.',
            'No leadership team registered.',
            'Information not available.'
        ];
        
        console.log('\n--- VERIFICATION RESULTS ---');
        let allPassed = true;
        for (const check of checks) {
            if (content.includes(check)) {
                console.log(`[PASS] Found empty state text: "${check}"`);
            } else {
                console.log(`[FAIL] Missing empty state text: "${check}"`);
                allPassed = false;
            }
        }

        if (allPassed) {
            console.log('\nSUCCESS: All dynamic empty states rendered correctly!');
        } else {
            console.log('\nWARNING: Some empty states are missing. Check if data exists or if implementation failed.');
        }

    } catch (e) {
        console.error('Error during verification:', e.message);
    } finally {
        await browser.close();
    }
})();
