<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FinancialHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:financial-health-check';

    protected $description = 'Checks financial data integrity across ledgers, orders, and student payments.';

    public function handle()
    {
        $this->info("Starting Financial Health Check...");

        // 1. Check if Order paid amounts match Student paid amounts
        $orders = \App\Models\Order::where('status', 'Paid')->orWhere('status', 'Partially Paid')->get();
        $discrepancies = 0;
        foreach ($orders as $order) {
            $student = \App\Models\Student::find($order->student_id);
            if ($student && $student->paid_amount < $order->paid_amount) {
                $this->error("Discrepancy found: Order {$order->id} paid_amount > Student {$student->id} paid_amount");
                $discrepancies++;
            }
        }

        // 2. Check if Ledger totals match Center current_due
        $centers = \App\Models\Center::all();
        foreach ($centers as $center) {
            $ledgerDue = \App\Models\CenterLedger::where('center_id', $center->id)
                ->select(\Illuminate\Support\Facades\DB::raw('SUM(CASE WHEN type="debit" THEN amount ELSE -amount END) as net_due'))
                ->value('net_due');
            
            if (abs((float)$ledgerDue - (float)$center->current_due) > 0.01) { // floating point tolerance
                $this->error("Ledger mismatch for Center {$center->code}: Ledger Net Due = {$ledgerDue}, Center current_due = {$center->current_due}");
                $discrepancies++;
            }
        }

        if ($discrepancies == 0) {
            $this->info("Financial health is OK. No discrepancies found.");
        } else {
            $this->error("Found {$discrepancies} financial discrepancies. Please review immediately.");
        }

        return 0;
    }
}
