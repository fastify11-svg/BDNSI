const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runPhp(phpCode) {
    const tmpFile = path.join(process.cwd(), `_e2e_tmp_${Date.now()}.php`);
    const code = phpCode.trimStart().startsWith('<?php') ? phpCode : `<?php\n${phpCode}`;
    fs.writeFileSync(tmpFile, code);
    try {
        const result = spawnSync(
            'C:\\xampp\\php\\php.exe',
            ['artisan', 'tinker', `--execute=require '${tmpFile.replace(/\\/g, '/')}'`],
            { cwd: process.cwd(), encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'pipe'] }
        );
        console.log('stdout:', result.stdout);
        console.log('stderr (first 200):', (result.stderr || '').slice(0, 200));
        console.log('status:', result.status);
        if (result.error) console.log('error:', result.error);
        return result.stdout || '';
    } finally {
        try { fs.unlinkSync(tmpFile); } catch(e) { console.log('cleanup err:', e.message); }
    }
}

// Test: Create a commission exactly like the E2E test does
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

    $comm = \\App\\Models\\Commission::create([
        'team_id'              => $team->id,
        'order_id'             => $order->id,
        'transaction_id'       => $trx->id,
        'commission_policy_id' => $policy->id,
        'calculated_revenue'   => 5000,
        'amount'               => 500,
        'status'               => 'Earned',
    ]);

    echo "team_id={$team->id} comm_id={$comm->id} amount={$comm->amount}\\n";
`);

// Verify with separate call
runPhp(`
    $count = \\App\\Models\\Commission::count();
    $earned = \\App\\Models\\Commission::where('status', 'Earned')->sum('amount');
    echo "After setup: count={$count} earned_sum={$earned}\\n";
`);
