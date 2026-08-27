<?php

namespace App\Events;

use App\Models\Transaction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentSucceeded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param Transaction $transaction  The successfully completed transaction.
     * @param mixed       $payable      The Student, Center, or User the payment belongs to.
     */
    public function __construct(
        public readonly Transaction $transaction,
        public readonly mixed $payable
    ) {}
}
