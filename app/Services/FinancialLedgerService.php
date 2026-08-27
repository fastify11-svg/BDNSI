<?php

namespace App\Services;

use App\Models\Center;
use App\Models\CenterLedger;
use Illuminate\Support\Facades\DB;

class FinancialLedgerService
{
    /**
     * Record an order (increases the due).
     */
    public function recordOrder(Center $center, $order, float $amount, string $description = 'Order placed'): void
    {
        DB::transaction(function () use ($center, $order, $amount, $description) {
            $balanceAfter = $center->current_due + $amount;

            $ledger = CenterLedger::create([
                'center_id' => $center->id,
                'type' => 'debit',
                'amount' => $amount,
                'balance_after' => $balanceAfter,
                'reference_id' => $order->id,
                'reference_type' => get_class($order),
                'description' => $description,
            ]);

            $center->update(['current_due' => $balanceAfter]);

            \App\Models\AuditLog::create([
                'user_id' => auth()->id() ?? 1,
                'event' => 'LEDGER_DEBIT',
                'auditable_type' => CenterLedger::class,
                'auditable_id' => $ledger->id,
                'new_values' => ['amount' => $amount, 'balance_after' => $balanceAfter, 'reference' => $order->id],
                'ip_address' => request()->ip() ?? '127.0.0.1',
                'user_agent' => request()->userAgent() ?? 'System'
            ]);
        });
    }

    /**
     * Record a payment (decreases the due).
     */
    public function recordPayment(Center $center, $transaction, float $amount, string $description = 'Payment received'): void
    {
        DB::transaction(function () use ($center, $transaction, $amount, $description) {
            $balanceAfter = max(0, $center->current_due - $amount);

            $ledger = CenterLedger::create([
                'center_id' => $center->id,
                'type' => 'credit',
                'amount' => $amount,
                'balance_after' => $balanceAfter,
                'reference_id' => $transaction->id,
                'reference_type' => get_class($transaction),
                'description' => $description,
            ]);

            $center->update(['current_due' => $balanceAfter]);

            \App\Models\AuditLog::create([
                'user_id' => auth()->id() ?? 1,
                'event' => 'LEDGER_CREDIT',
                'auditable_type' => CenterLedger::class,
                'auditable_id' => $ledger->id,
                'new_values' => ['amount' => $amount, 'balance_after' => $balanceAfter, 'reference' => $transaction->id],
                'ip_address' => request()->ip() ?? '127.0.0.1',
                'user_agent' => request()->userAgent() ?? 'System'
            ]);
        });
    }

    /**
     * Record a manual adjustment.
     */
    public function recordAdjustment(Center $center, float $amount, string $type, string $description): void
    {
        DB::transaction(function () use ($center, $amount, $type, $description) {
            if ($type === 'debit') {
                $balanceAfter = $center->current_due + $amount;
            } else {
                $balanceAfter = max(0, $center->current_due - $amount);
            }

            $ledger = CenterLedger::create([
                'center_id' => $center->id,
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $balanceAfter,
                'reference_id' => null,
                'reference_type' => null,
                'description' => $description,
            ]);

            $center->update(['current_due' => $balanceAfter]);

            \App\Models\AuditLog::create([
                'user_id' => auth()->id() ?? 1,
                'event' => 'LEDGER_ADJUSTMENT',
                'auditable_type' => CenterLedger::class,
                'auditable_id' => $ledger->id,
                'new_values' => ['type' => $type, 'amount' => $amount, 'balance_after' => $balanceAfter, 'description' => $description],
                'ip_address' => request()->ip() ?? '127.0.0.1',
                'user_agent' => request()->userAgent() ?? 'System'
            ]);
        });
    }
}
