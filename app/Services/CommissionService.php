<?php

namespace App\Services;

use App\Models\Commission;
use App\Models\CommissionPolicy;
use App\Models\Order;
use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommissionService
{
    /**
     * Calculate and record commission for an order payment.
     *
     * @param Order $order
     * @param Transaction $transaction
     * @param float $amountPaid
     */
    public function calculateAndRecord(Order $order, Transaction $transaction, float $amountPaid): void
    {
        try {
            DB::transaction(function () use ($order, $transaction, $amountPaid) {
                $center = $order->center;
                if (!$center || !$center->team_id) {
                    return; // No staff associated with this center
                }

                $team = Team::find($center->team_id);
                if (!$team) {
                    return;
                }

                // Check for duplicate commission for this transaction with exclusive lock
                $exists = Commission::where('transaction_id', $transaction->id)
                    ->where('order_id', $order->id)
                    ->lockForUpdate()
                    ->exists();

                if ($exists) {
                    Log::warning('Commission already calculated for transaction', ['transaction_id' => $transaction->id]);
                    return;
                }

                // Find applicable policy. Order items might have different products, but for simplicity we'll check order level or just use a default policy
                // Let's assume there's a global policy or team specific policy
                $policy = CommissionPolicy::where('is_active', true)
                    ->where(function ($query) use ($team) {
                        $query->where('team_id', $team->id)->orWhereNull('team_id');
                    })
                    ->orderBy('team_id', 'desc') // prioritize team specific
                    ->first();

                if (!$policy) {
                    return;
                }

                $commissionAmount = 0;
                if ($policy->type === 'percentage') {
                    $commissionAmount = $amountPaid * ($policy->value / 100);
                } else {
                    // Fixed amount per order, so only give it on the first payment
                    $alreadyAwarded = Commission::where('order_id', $order->id)
                        ->where('commission_policy_id', $policy->id)
                        ->exists();

                    if (!$alreadyAwarded) {
                        $commissionAmount = $policy->value;
                    }
                }

                if ($commissionAmount > 0) {
                    Commission::create([
                        'team_id' => $team->id,
                        'order_id' => $order->id,
                        'transaction_id' => $transaction->id,
                        'commission_policy_id' => $policy->id,
                        'calculated_revenue' => $amountPaid,
                        'amount' => $commissionAmount,
                        'status' => 'Earned',
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error('CommissionService failed: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'transaction_id' => $transaction->id,
            ]);
        }
    }

    /**
     * Approve a commission.
     */
    public function approve(Commission $commission, int $userId): void
    {
        if ($commission->status !== Commission::STATUS_EARNED) {
            throw new \Exception("Only earned commissions can be approved.");
        }

        $commission->status = Commission::STATUS_APPROVED;
        $commission->save();

        \App\Models\AuditLog::create([
            'user_id' => $userId,
            'action' => 'commission_approved',
            'model_type' => Commission::class,
            'model_id' => $commission->id,
            'details' => json_encode(['amount' => $commission->amount])
        ]);
    }

    /**
     * Pay a commission.
     */
    public function pay(Commission $commission, int $userId): void
    {
        if ($commission->status !== Commission::STATUS_APPROVED) {
            throw new \Exception("Only approved commissions can be paid.");
        }

        $commission->status = Commission::STATUS_PAID;
        $commission->save();

        \App\Models\AuditLog::create([
            'user_id' => $userId,
            'action' => 'commission_paid',
            'model_type' => Commission::class,
            'model_id' => $commission->id,
            'details' => json_encode(['amount' => $commission->amount])
        ]);
    }

    /**
     * Reverse a commission.
     */
    public function reverse(Commission $commission, int $userId, string $reason): void
    {
        if (in_array($commission->status, [Commission::STATUS_CANCELLED, Commission::STATUS_REVERSED])) {
            throw new \Exception("Commission is already reversed or cancelled.");
        }

        $oldStatus = $commission->status;
        $commission->status = Commission::STATUS_REVERSED;
        $commission->save();

        \App\Models\AuditLog::create([
            'user_id' => $userId,
            'action' => 'commission_reversed',
            'model_type' => Commission::class,
            'model_id' => $commission->id,
            'details' => json_encode(['old_status' => $oldStatus, 'amount' => $commission->amount, 'reason' => $reason])
        ]);
    }
}
