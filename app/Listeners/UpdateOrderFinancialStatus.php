<?php

namespace App\Listeners;

use App\Events\PaymentSucceeded;
use App\Models\Order;
use App\Models\CenterLedger;
use App\Models\Student;
use App\Services\FinancialLedgerService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class UpdateOrderFinancialStatus implements ShouldQueue
{
    /**
     * Handle the PaymentSucceeded event for Orders.
     */
    public function handle(PaymentSucceeded $event): void
    {
        $payable = $event->payable;

        // Only handle Order payables
        if (!($payable instanceof Order)) {
            return;
        }

        try {
            $order = Order::find($payable->id);

            if (!$order) {
                Log::warning('UpdateOrderFinancialStatus: Order not found', ['id' => $payable->id]);
                return;
            }

            $cacheKey = 'processed_trx_' . $event->transaction->trx_id;
            if (\Illuminate\Support\Facades\Cache::has($cacheKey)) {
                Log::warning('UpdateOrderFinancialStatus: Transaction already processed', ['trx_id' => $event->transaction->trx_id]);
                return;
            }
            \Illuminate\Support\Facades\Cache::put($cacheKey, true, now()->addDays(30));

            $amount = (float) $event->transaction->amount;
            $remainingAmount = $amount;

            // 1. Update Order Status
            $order->paid_amount = ($order->paid_amount ?? 0) + $amount;
            $order->due_amount  = max(0, ($order->due_amount ?? 0) - $amount);

            if ($order->due_amount <= 0) {
                $order->status = 'Paid';
            } elseif ($order->paid_amount > 0) {
                $order->status = 'Partially Paid';
            } else {
                $order->status = 'Pending';
            }

            $order->saveQuietly();

            // 2. Look up the associated Student via OrderItem
            $orderItems = $order->items()->where('itemable_type', Student::class)->get();
            
            foreach ($orderItems as $item) {
                if ($remainingAmount <= 0) break;

                $student = Student::withoutGlobalScopes()->find($item->itemable_id);
                if ($student && $student->due_amount > 0) {
                    $studentDue = (float) $student->due_amount;
                    $payForStudent = min($studentDue, $remainingAmount);
                    
                    $student->paid_amount = ($student->paid_amount ?? 0) + $payForStudent;
                    $student->due_amount = max(0, $studentDue - $payForStudent);
                    
                    if ($student->due_amount <= 0) {
                        $student->payment_status = 1; // 1=Paid
                    }
                    $student->saveQuietly();
                    
                    $remainingAmount -= $payForStudent;
                }
            }

            // 3. Ledger Reconciliation
            // Check if this Order was previously posted to the CenterLedger as a debit.
            $wasDebited = CenterLedger::where('reference_id', $order->id)
                ->where('reference_type', Order::class)
                ->where('type', 'debit')
                ->exists();

            if ($wasDebited) {
                $center = $order->center;
                if ($center) {
                    $ledgerService = new FinancialLedgerService();
                    // This creates a credit entry and reduces the center's current_due
                    $ledgerService->recordPayment($center, $event->transaction, $amount, 'Payment for Order #' . $order->order_number);
                }
            } else {
                Log::info('UpdateOrderFinancialStatus: Order was Pay-Now, no ledger reduction needed.', ['order_id' => $order->id]);
            }

            // 4. Record Commission for Sales Staff
            $commissionService = new \App\Services\CommissionService();
            $commissionService->calculateAndRecord($order, $event->transaction, $amount);

            // 5. Notify Center
            if ($order->center) {
                $order->center->notify(new \App\Notifications\OrderPaid($order));
            }

            Log::info('Order financial status updated after payment', [
                'order_id'       => $order->id,
                'amount_added'   => $amount,
                'new_paid'       => $order->paid_amount,
                'new_due'        => $order->due_amount,
                'status'         => $order->status,
                'ledger_credited'=> $wasDebited
            ]);

        } catch (\Exception $e) {
            Log::error('UpdateOrderFinancialStatus failed: ' . $e->getMessage(), [
                'order_id' => $payable->id ?? null,
                'trx_id'   => $event->transaction->trx_id,
            ]);
        }
    }
}
