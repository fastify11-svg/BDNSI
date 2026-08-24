<?php

namespace Tests\Feature;

use App\Models\PaymentGateway;
use App\Models\Student;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SslCommerzIpnTest extends TestCase
{
    use RefreshDatabase;

    public function test_ipn_safely_handles_invalid_callback()
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'sslcommerz'],
            ['name' => 'SSLCommerz', 'is_active' => true, 'config' => json_encode([])]
        );

        $response = $this->post(route('payment.callback', ['gateway' => 'sslcommerz']), [
            'status' => 'INVALID',
            'val_id' => '12345',
            'tran_id' => 'TRX_123',
        ]);

        $response->assertStatus(400);
        $this->assertEquals('SSLCommerz IPN Invalid', $response->json('message'));
    }

    public function test_ipn_verifies_successfully()
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'sslcommerz'],
            ['name' => 'SSLCommerz', 'is_active' => true, 'config' => json_encode([])]
        );

        $center = \App\Models\Center::firstOrCreate(
            ['code' => 'T3'],
            ['name' => 'Test Center 3', 'owner_name' => 'Test Owner', 'email' => 't3@example.com', 'password' => bcrypt('password')]
        );
        $subject = \App\Models\Subject::firstOrCreate(['name' => 'Test Subject', 'code' => 'S1']);
        $session = \App\Models\Session::firstOrCreate(['name' => 'Test Session']);

        $student = clone Student::factory()->create([
            'center_id' => $center->id,
            'subject_id' => $subject->id,
            'session_id' => $session->id,
            'fathers_name' => 'Test Father',
            'mothers_name' => 'Test Mother',
            'date_of_birth' => '2000-01-01',
            'present_address' => 'Present Address',
            'permanent_address' => 'Permanent Address',
        ]);

        $transaction = \App\Models\Transaction::create([
            'trx_id' => 'TRX_123',
            'amount' => 100,
            'status' => 'pending',
            'payable_type' => get_class($student),
            'payable_id' => $student->id,
        ]);

        Http::fake([
            '*' => Http::response(['status' => 'VALIDATED'], 200),
        ]);

        $response = $this->post(route('payment.callback', ['gateway' => 'sslcommerz']), [
            'status' => 'VALID',
            'val_id' => 'VAL_12345',
            'tran_id' => 'TRX_123',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('SSLCommerz IPN Verified successfully', $response->json('message'));
        $this->assertEquals('success', $transaction->fresh()->status);
    }
}
