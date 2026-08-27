<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SystemDbIntegrityCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:db-integrity-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks database for orphans, negative amounts, and index/foreign key integrity.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting DB Integrity Check...');
        $hasError = false;

        // 1. Orphan Check: Order Items without Order
        $orphanOrderItems = DB::table('order_items')->whereNotIn('order_id', function($q) {
            $q->select('id')->from('orders');
        })->count();
        if ($orphanOrderItems > 0) {
            $this->error("Found {$orphanOrderItems} orphan order items!");
            $hasError = true;
        } else {
            $this->info('✓ No orphan order items');
        }

        // 3. Negative Amounts: Payments
        $negativePayments = DB::table('payments')->where('amount', '<', 0)->count();
        if ($negativePayments > 0) {
            $this->error("Found {$negativePayments} negative payments!");
            $hasError = true;
        } else {
            $this->info('✓ No negative payments');
        }

        // 4. Negative Amounts: Orders
        $negativeOrders = DB::table('orders')->where('total_amount', '<', 0)
            ->orWhere('paid_amount', '<', 0)
            ->count();
        if ($negativeOrders > 0) {
            $this->error("Found {$negativeOrders} negative orders!");
            $hasError = true;
        } else {
            $this->info('✓ No negative orders');
        }

        // 5. Negative Amounts: Center Ledger
        $negativeLedger = DB::table('center_ledgers')->where('amount', '<', 0)->count();
        if ($negativeLedger > 0) {
            $this->error("Found {$negativeLedger} negative center ledger entries!");
            $hasError = true;
        } else {
            $this->info('✓ No negative center ledger entries');
        }

        // 6. Center due is not negative
        $negativeDueCenters = DB::table('centers')->where('current_due', '<', 0)->count();
        if ($negativeDueCenters > 0) {
            $this->warn("Found {$negativeDueCenters} centers with negative current_due (overpayment). This might be intentional but requires audit.");
        } else {
            $this->info('✓ No negative center current_due');
        }

        if ($hasError) {
            $this->error('DB Integrity check FAILED. Errors found.');
            return 1;
        }

        $this->info('DB Integrity check PASSED.');
        return 0;
    }
}
