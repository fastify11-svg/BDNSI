<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use App\Models\Transaction;
use App\Models\PaymentGateway;
use App\Models\Center;
use App\Events\PaymentSucceeded;

class PhaseHPaymentIdempotencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_sslcommerz_webhook_is_idempotent()
    {
        Event::fake([PaymentSucceeded::class]);

        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'sslcommerz'],
            [
                'name' => 'SSLCommerz',
                'is_sandbox' => true,
            ]
        );
        $gateway->update(['is_active' => true]);

        $center = Center::factory()->create();

        $transaction = Transaction::create([
            'trx_id' => 'TRX_TEST_IDEMP_123',
            'amount' => 1000,
            'gateway' => 'sslcommerz',
            'status' => 'pending',
            'payable_type' => Center::class,
            'payable_id' => $center->id,
        ]);

        // Mock SSLCommerz API
        Http::fake([
            'sandbox.sslcommerz.com/*' => Http::response(['status' => 'VALID'], 200)
        ]);

        // First callback
        $response1 = $this->postJson('/payment/callback/sslcommerz', [
            'status' => 'VALID',
            'val_id' => '12345',
            'tran_id' => 'TRX_TEST_IDEMP_123'
        ]);

        $response1->assertStatus(200);
        Event::assertDispatched(PaymentSucceeded::class, 1);
        $this->assertEquals('success', $transaction->fresh()->status);

        // Second callback (Duplicate)
        $response2 = $this->postJson('/payment/callback/sslcommerz', [
            'status' => 'VALID',
            'val_id' => '12345',
            'tran_id' => 'TRX_TEST_IDEMP_123'
        ]);

        $response2->assertStatus(200);
        // Event should NOT be dispatched again
        Event::assertDispatched(PaymentSucceeded::class, 1);
    }
}
