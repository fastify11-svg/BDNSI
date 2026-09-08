const { test, expect } = require('@playwright/test');
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Absolute project root — explicit, never depends on process.cwd() in Playwright worker
const PROJECT_ROOT = 'C:\\BDNSI';
const PHP_EXE     = 'C:\\xampp\\php\\php.exe';

/**
 * Run PHP code through artisan tinker using spawnSync.
 * Writes code to a temp file then executes it via tinker --execute.
 * Uses absolute paths to avoid Playwright worker cwd issues.
 */
function runPhp(phpCode) {
    const tmpFile = path.join(PROJECT_ROOT, `_e2e_tmp_${Date.now()}.php`);
    const code = phpCode.trimStart().startsWith('<?php') ? phpCode : `<?php\n${phpCode}`;
    fs.writeFileSync(tmpFile, code);
    const forwardSlashPath = tmpFile.replace(/\\/g, '/');
    try {
        const result = spawnSync(
            PHP_EXE,
            ['artisan', 'tinker', `--execute=require '${forwardSlashPath}'`],
            {
                cwd:      PROJECT_ROOT,
                encoding: 'utf8',
                timeout:  30000,
                stdio:    ['ignore', 'pipe', 'pipe']
            }
        );
        if (result.error) {
            throw new Error(`spawnSync error: ${result.error.message}`);
        }
        if (result.stderr && /Exception|Fatal|Error:/i.test(result.stderr)) {
            throw new Error(`PHP error: ${result.stderr.slice(0, 400)}`);
        }
        const out = result.stdout || '';
        console.log(`[runPhp] exit=${result.status} out=${out.trim().slice(0,150)} err=${(result.stderr||'').trim().slice(0,80)}`);
        return out;
    } finally {
        try { fs.unlinkSync(tmpFile); } catch {}
    }
}

test.describe('Phase L Commission E2E', () => {
    test.beforeEach(async () => {
        runPhp(`
            $admin = \\App\\Models\\Admin::where('email', 'admin@gmail.com')->first();
            if (!$admin) {
                $admin = \\App\\Models\\Admin::create([
                    'name'           => 'Admin',
                    'email'          => 'admin@gmail.com',
                    'password'       => bcrypt('password'),
                ]);
                $adminRole = \\App\\Models\\Role::firstOrCreate(['name' => 'admin']);
                $admin->syncRoles([$adminRole]);
            } else {
                $admin->update(['password' => bcrypt('password')]);
            }
        `);
    });


    test('Staff sees earned commission and Admin approves it', async ({ page }) => {
        // ── SETUP: create team, policy, center, order, transaction, commission ──
        runPhp(`
            \\App\\Models\\Commission::where('calculated_revenue', 5000)->delete();
            \\App\\Models\\Transaction::where('trx_id', 'TRX-COMM-E2E')->delete();
            \\App\\Models\\Order::where('order_number', 'ORD-COMM-E2E')->delete();
            \\App\\Models\\Center::where('code', 'E2E-COMM')->delete();
            \\App\\Models\\CommissionPolicy::where('name', 'E2E Fixed Commission')->delete();
            \\App\\Models\\Team::where('email', 'staff_e2e_comm@example.com')->delete();

            $team = \\App\\Models\\Team::create([
                'name'      => 'E2E Staff Agent',
                'email'     => 'staff_e2e_comm@example.com',
                'password'  => bcrypt('password'),
                'role'      => 'agent',
                'is_active' => true,
            ]);

            $policy = \\App\\Models\\CommissionPolicy::create([
                'name'      => 'E2E Fixed Commission',
                'type'      => 'fixed',
                'value'     => 500,
                'team_id'   => $team->id,
                'is_active' => true,
            ]);

            $center = \\App\\Models\\Center::create([
                'code'          => 'E2E-COMM',
                'name'          => 'E2E Center Comm',
                'owner_name'    => 'E2E Owner',
                'director_name' => 'E2E Director',
                'mobile'        => '01700000000',
                'email'         => 'center_e2e_comm@example.com',
                'password'      => bcrypt('password'),
                'team_id'       => $team->id,
            ]);

            $order = \\App\\Models\\Order::create([
                'center_id'      => $center->id,
                'order_number'   => 'ORD-COMM-E2E',
                'total_amount'   => 5000,
                'payable_amount' => 5000,
                'paid_amount'    => 5000,
                'due_amount'     => 0,
                'status'         => 'paid',
            ]);

            $trx = \\App\\Models\\Transaction::create([
                'payable_type' => \\App\\Models\\Order::class,
                'payable_id'   => $order->id,
                'trx_id'       => 'TRX-COMM-E2E',
                'amount'       => 5000,
                'status'       => 'Success',
            ]);

            \\Illuminate\\Support\\Facades\\Cache::forget('processed_trx_TRX-COMM-E2E');

            \\App\\Models\\Commission::create([
                'team_id'             => $team->id,
                'order_id'            => $order->id,
                'transaction_id'      => $trx->id,
                'commission_policy_id'=> $policy->id,
                'calculated_revenue'  => 5000,
                'amount'              => 500,
                'status'              => 'Earned',
            ]);

            $count = \\App\\Models\\Commission::count();
            $earned = \\App\\Models\\Commission::where('status', 'Earned')->sum('amount');
            echo "SETUP_DONE: commissions={$count} earned_sum={$earned}\\n";
        `);

        // Verify DB state before browser navigates
        const verifyOut = runPhp(`
            $count = \\App\\Models\\Commission::count();
            $teams = \\App\\Models\\Team::where('email', 'staff_e2e_comm@example.com')->count();
            echo "VERIFY: commissions={$count} teams={$teams}\\n";
        `);
        console.log('[e2e verify]', verifyOut.trim());

        // ── STEP 1: Staff logs in and sees earned commission ──

        await page.context().clearCookies();
        await page.goto('/staff/login');
        await page.fill('input[placeholder*="officer"]', 'staff_e2e_comm@example.com');
        await page.fill('input[placeholder*="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/staff/dashboard', { timeout: 25000 });

        await page.goto('/staff/commissions');

        // Save debug HTML for inspection on failure
        const pageHtml = await page.content();
        fs.writeFileSync('staff_commissions_debug.html', pageHtml);

        // The staff commission page shows totals.earned in a card
        // Should see ৳ 500 (may be formatted as "৳ 500.00" or "৳ 500")
        await expect(page.locator('p:has-text("৳")').first()).toBeVisible({ timeout: 25000 });

        // Verify the page data contains 500 (earned total)
        const pageData = JSON.parse(
            pageHtml.match(/data-page="([^"]+)"/)?.[1]
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&') || '{}'
        );
        const earnedTotal = pageData?.props?.totals?.earned;
        expect(Number(earnedTotal)).toBeGreaterThan(0);
        expect(Number(earnedTotal)).toBe(500);

        // ── STEP 2: Admin approves and pays commission ──
        await page.context().clearCookies();
        await page.goto('/admin/login');
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin/dashboard', { timeout: 25000 });

        // Verify DB right before Admin visits
        const adminVerifyOut = runPhp(`
            $a = \\App\\Models\\Admin::where('email', 'admin@gmail.com')->first();
            echo "ADMIN_VERIFY: commissions=" . \\App\\Models\\Commission::count() . " teams=" . \\App\\Models\\Team::count() . "\\n";
        `);
        console.log('[admin verify]', adminVerifyOut.trim());

        await page.goto('/admin/commissions');
        await page.waitForLoadState('networkidle');

        // Dump admin page for debugging
        const adminHtml = await page.content();
        require('fs').writeFileSync('admin_commissions_debug.html', adminHtml);

        // Parse Inertia data for debugging
        const adminData = JSON.parse(
            (adminHtml.match(/data-page="([^"]+)"/) || ['','{}'])[1]
                .replace(/&quot;/g, '"').replace(/&amp;/g, '&')
        );
        const summaries = adminData?.props?.agentSummaries || [];
        console.log('Admin agentSummaries count:', summaries.length);
        console.log('Admin agentSummaries:', JSON.stringify(summaries));

        // Assert agent summary panel - wait explicitly
        await expect(page.locator('text=E2E Staff Agent').first()).toBeVisible({ timeout: 25000 });

        await expect(page.locator('text=Earned (Pending):').first()).toBeVisible();

        // Assert transaction table
        await expect(page.locator('text=ORD-COMM-E2E').first()).toBeVisible({ timeout: 25000 });

        // Approve
        await page.click('button:has-text("Approve")');
        // Wait for modal to appear then confirm
        await page.waitForSelector('button:has-text("Confirm")', { timeout: 5000 });
        await page.click('button:has-text("Confirm")');
        
        // Wait for the modal to close and page to reload by waiting for the 'Approved' span
        await expect(page.locator('span.bg-blue-500:has-text("Approved")').first()).toBeVisible({ timeout: 15000 });

        // Pay
        await page.waitForTimeout(500); // brief pause for page re-render
        await page.click('button:has-text("Pay")');
        await page.waitForSelector('button:has-text("Confirm")', { timeout: 5000 });
        await page.click('button:has-text("Confirm")');
        
        await expect(page.locator('span.bg-green-500:has-text("Paid")').first()).toBeVisible({ timeout: 15000 });
    });

    test.afterEach(async () => {
        // Cleanup all E2E test data
        runPhp(`
            \\App\\Models\\Commission::where('calculated_revenue', 5000)->delete();
            \\App\\Models\\Transaction::where('trx_id', 'TRX-COMM-E2E')->delete();
            \\App\\Models\\Order::where('order_number', 'ORD-COMM-E2E')->delete();
            \\App\\Models\\Center::where('code', 'E2E-COMM')->delete();
            \\App\\Models\\CommissionPolicy::where('name', 'E2E Fixed Commission')->delete();
            \\App\\Models\\Team::where('email', 'staff_e2e_comm@example.com')->delete();
            \\App\\Models\\Admin::where('email', 'admin_e2e_comm@example.com')->delete();
        `);
    });
});
