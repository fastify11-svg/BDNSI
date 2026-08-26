<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Center;
use App\Models\Order;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class SystemFinancialReconciliation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:financial-reconciliation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reconciles financial records to detect inconsistencies.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Financial Reconciliation...');
        $hasError = false;

        // 1. Order paid/due/status consistency
        $inconsistentOrders = Order::whereRaw('payable_amount != paid_amount + due_amount')->get();
        if ($inconsistentOrders->count() > 0) {
            $this->error('Found orders where payable_amount != paid_amount + due_amount:');
            foreach ($inconsistentOrders as $order) {
                $this->error("Order ID: {$order->id}");
            }
            $hasError = true;
        } else {
            $this->info('✓ Order paid/due amounts match payable_amount');
        }

        // 2. Student payment allocation consistency
        // A student is marked paid if their registration fee is paid.
        // We will just do a generic check if any student has negative paid amount.
        $negativeStudents = Student::where('paid_amount', '<', 0)->count();
        if ($negativeStudents > 0) {
            $this->error("Found {$negativeStudents} students with negative paid_amount.");
            $hasError = true;
        } else {
            $this->info('✓ No negative student paid amounts');
        }

        // 3. Center ledger/current_due consistency
        $centers = Center::all();
        $inconsistentCenters = 0;
        foreach ($centers as $center) {
            $ledgerSum = DB::table('center_ledgers')
                ->where('center_id', $center->id)
                ->selectRaw("SUM(CASE WHEN type = 'debit' THEN amount WHEN type = 'credit' THEN -amount ELSE 0 END) as calculated_due")
                ->value('calculated_due') ?? 0;
            
            // Allow small floating point differences
            if (abs($center->current_due - $ledgerSum) > 0.01) {
                $this->error("Center {$center->id} current_due ({$center->current_due}) does not match ledger sum ({$ledgerSum})");
                $inconsistentCenters++;
                $hasError = true;
            }
        }
        if ($inconsistentCenters === 0) {
            $this->info('✓ All center current_due values match their ledger sums');
        }

        // 4. Negative due
        $negativeDue = Center::where('current_due', '<', 0)->count();
        if ($negativeDue > 0) {
            $this->warn("Found {$negativeDue} centers with negative current_due (overpayment).");
        } else {
            $this->info('✓ No centers with negative current_due');
        }

        // 5. Credit limit violations
        // Find centers where due > credit_limit and status is not restricted (if we have such status)
        // Actually, just report if due > limit
        $limitViolations = Center::whereRaw('current_due > credit_limit')->count();
        if ($limitViolations > 0) {
            $this->warn("Found {$limitViolations} centers exceeding their credit limit.");
        } else {
            $this->info('✓ No centers exceeding credit limit');
        }

        if ($hasError) {
            $this->error('Financial reconciliation FAILED. Discrepancies found.');
            return 1;
        }

        $this->info('Financial reconciliation PASSED. No discrepancies found.');
        return 0;
    }
}
