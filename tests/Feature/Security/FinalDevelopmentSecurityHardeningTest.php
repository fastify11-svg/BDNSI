<?php

namespace Tests\Feature\Security;

use App\Models\Center;
use App\Models\Order;
use App\Models\PaymentGateway;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Team;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FinalDevelopmentSecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    private function activateSsl(): PaymentGateway
    {
        return PaymentGateway::updateOrCreate(
            ['slug' => 'sslcommerz'],
            [
                'name' => 'SSLCommerz',
                'is_active' => true,
                'is_sandbox' => true,
                'store_id' => 'test',
                'store_password' => 'test',
            ]
        );
    }

    public function test_debug_test_500_route_is_removed(): void
    {
        $this->get('/test-500')->assertNotFound();
    }

    public function test_payment_process_requires_auth_and_uses_server_order_amount(): void
    {
        $this->activateSsl();

        $this->post(route('payment.process'), [
            'gateway' => 'sslcommerz',
            'amount' => 1,
        ])->assertForbidden();

        $center = Center::factory()->create();
        $user = User::factory()->create(['center_id' => $center->id, 'username' => 'center_user_'.uniqid(), 'phone' => '01710000001']);
        $order = Order::create([
            'center_id' => $center->id,
            'order_number' => 'ORD-SEC-1',
            'total_amount' => 1500,
            'payable_amount' => 1500,
            'paid_amount' => 0,
            'due_amount' => 1500,
            'status' => 'pending',
        ]);

        Http::fake([
            '*' => Http::response(['GatewayPageURL' => 'https://example.test/pay'], 200),
        ]);

        $response = $this->actingAs($user)->post(route('payment.process'), [
            'gateway' => 'sslcommerz',
            'order_id' => $order->id,
            'amount' => 1,
        ]);

        $this->assertTrue(in_array($response->status(), [302, 303, 409], true), 'status='.$response->status());

        $trx = Transaction::query()->latest('id')->first();
        $this->assertNotNull($trx);
        $this->assertSame('1500.00', number_format((float) $trx->amount, 2, '.', ''));
        $this->assertSame(Order::class, $trx->payable_type);
        $this->assertSame($order->id, $trx->payable_id);
    }

    public function test_payment_process_blocks_cross_center_order(): void
    {
        $this->activateSsl();

        $centerA = Center::factory()->create();
        $centerB = Center::factory()->create();
        $userA = User::factory()->create(['center_id' => $centerA->id, 'username' => 'center_a_'.uniqid(), 'phone' => '01710000002']);
        $orderB = Order::create([
            'center_id' => $centerB->id,
            'order_number' => 'ORD-SEC-2',
            'total_amount' => 900,
            'payable_amount' => 900,
            'paid_amount' => 0,
            'due_amount' => 900,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($userA)->post(route('payment.process'), [
            'gateway' => 'sslcommerz',
            'order_id' => $orderB->id,
            'amount' => 900,
        ]);

        $this->assertTrue(in_array($response->status(), [403, 404], true), 'status='.$response->status());
        $this->assertSame(0, Transaction::count());
    }

    public function test_sslcommerz_ipn_rejects_amount_mismatch(): void
    {
        $this->activateSsl();

        $center = Center::factory()->create();
        $session = Session::create(['name' => 'IPN Session', 'status' => 1]);
        $subject = Subject::create(['name' => 'IPN Subject', 'code' => 'IPN1']);
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
        ]);
        $transaction = Transaction::create([
            'trx_id' => 'TRX_AMT_MISMATCH',
            'amount' => 1000,
            'status' => 'pending',
            'payable_type' => Student::class,
            'payable_id' => $student->id,
        ]);

        Http::fake([
            '*' => Http::response(['status' => 'VALIDATED', 'amount' => '1.00'], 200),
        ]);

        $this->post(route('payment.callback', ['gateway' => 'sslcommerz']), [
            'status' => 'VALID',
            'val_id' => 'VAL_1',
            'tran_id' => 'TRX_AMT_MISMATCH',
        ])->assertStatus(400);

        $this->assertSame('pending', $transaction->fresh()->status);
    }

    public function test_staff_cannot_enroll_into_foreign_team_center(): void
    {
        $teamA = Team::create([
            'name' => 'Team A',
            'is_active' => true,
            'email' => 'a@example.com',
            'password' => bcrypt('password'),
        ]);
        $teamB = Team::create([
            'name' => 'Team B',
            'is_active' => true,
            'email' => 'b@example.com',
            'password' => bcrypt('password'),
        ]);
        $foreignCenter = Center::factory()->create(['team_id' => $teamB->id]);

        $session = Session::create(['name' => 'Sec Session', 'status' => 1]);
        $subject = Subject::create(['name' => 'Sec Subject', 'code' => 'SEC1']);

        $response = $this->actingAs($teamA, 'staff')->post(route('staff.student.store'), [
            'name' => 'Cross Tenant Student',
            'fathers_name' => 'Father',
            'mothers_name' => 'Mother',
            'date_of_birth' => '2001-01-01',
            'gender' => 'male',
            'religion' => 'islam',
            'phone' => '01710000000',
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'center_id' => $foreignCenter->id,
        ]);

        $this->assertTrue(in_array($response->status(), [403, 302], true), 'status='.$response->status());
        $this->assertSame(0, Student::withoutGlobalScopes()->where('name', 'Cross Tenant Student')->count());
    }
}
