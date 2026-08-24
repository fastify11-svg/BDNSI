<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Order;
use App\Models\Transaction;
use App\Services\FinancialLedgerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinancialLedgerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_adds_debit_when_order_is_placed()
    {
        $center = Center::factory()->create([
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 0,
        ]);

        $order = Order::create([
            'center_id' => $center->id,
            'order_number' => 'ORD-123',
            'total_amount' => 1000,
        ]);

        $service = new FinancialLedgerService();
        $service->recordOrder($center, $order, 1000);

        $this->assertEquals(1000, $center->fresh()->current_due);
        $this->assertDatabaseHas('center_ledgers', [
            'center_id' => $center->id,
            'type' => 'debit',
            'amount' => 1000,
            'balance_after' => 1000,
            'reference_id' => $order->id,
            'reference_type' => Order::class,
        ]);
    }

    public function test_it_adds_credit_when_payment_is_received()
    {
        $center = Center::factory()->create([
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 1000,
        ]);

        $transaction = Transaction::create([
            'trx_id' => 'TRX-123',
            'amount' => 500,
            'status' => 'success',
        ]);

        $service = new FinancialLedgerService();
        $service->recordPayment($center, $transaction, 500);

        $this->assertEquals(500, $center->fresh()->current_due);
        $this->assertDatabaseHas('center_ledgers', [
            'center_id' => $center->id,
            'type' => 'credit',
            'amount' => 500,
            'balance_after' => 500,
            'reference_id' => $transaction->id,
            'reference_type' => Transaction::class,
        ]);
    }
}
