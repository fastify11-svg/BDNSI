<?php

namespace Tests\Feature;

use App\Enums\Gender;
use App\Enums\Religion;
use App\Models\Center;
use App\Models\CenterLedger;
use App\Models\Order;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use App\Models\Price;
use App\Models\Transaction;
use App\Events\PaymentSucceeded;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PhaseEComprehensiveVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected $centerA;
    protected $centerB;
    protected $userA;
    protected $userB;
    protected $session;
    protected $subject;
    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->centerA = Center::factory()->create([
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 0,
            'allow_registration_without_payment' => true,
            'status' => \App\Enums\CenterStatus::Approved,
        ]);

        $this->userA = User::factory()->create([
            'center_id' => $this->centerA->id,
            'username' => 'centera'.time(),
            'phone' => '017' . rand(10000000, 99999999),
        ]);

        $this->centerB = Center::factory()->create([
            'credit_enabled' => true,
            'credit_limit' => 5000,
            'current_due' => 0,
            'allow_registration_without_payment' => true,
            'status' => \App\Enums\CenterStatus::Approved,
        ]);

        $this->userB = User::factory()->create([
            'center_id' => $this->centerB->id,
            'username' => 'centerb'.time(),
            'phone' => '018' . rand(10000000, 99999999),
        ]);

        $this->admin = clone \App\Models\Admin::factory()->create();
        
        $adminMock = \Mockery::mock($this->admin)->makePartial();
        $adminMock->shouldReceive('isAbleTo')->andReturn(true);
        $adminMock->shouldReceive('hasRole')->andReturn(true);
        $adminMock->shouldReceive('hasPermission')->andReturn(true);
        
        $this->admin = $adminMock;

        $this->session = Session::first() ?: Session::create(['name' => 'Test Session', 'status' => \App\Enums\SessionStatus::Active]);
        $this->subject = Subject::first() ?: Subject::create(['name' => 'Test Subject']);

        Price::where('product_type', 'registration')->delete();
        Price::create([
            'center_id' => null,
            'product_type' => 'registration',
            'base_price' => 500,
            'discount' => 0,
            'status' => 1,
        ]);
    }

    private function getPayload($paymentMethod = 'pay_now')
    {
        return [
            'name' => 'Test Student ' . uniqid(),
            'fathers_name' => 'Father',
            'mothers_name' => 'Mother',
            'date_of_birth' => '2000-01-01',
            'gender' => Gender::Male,
            'religion' => Religion::Muslim,
            'phone' => '01711111111',
            'session_id' => $this->session->id,
            'subject_id' => $this->subject->id,
            'payment_method' => $paymentMethod,
        ];
    }

    public function test_pay_now_flow()
    {
        $this->actingAs($this->userA);
        $payload = $this->getPayload('pay_now');

        $response = $this->post(route('student.store'), $payload);
        
        $order = Order::latest()->first();
        $student = Student::latest()->first();

        $response->assertRedirect(route('center.orders.show', $order->id));
        $this->assertEquals(0, $student->payment_status);
        $this->assertEquals(500, $student->due_amount);
        $this->assertEquals('pending', strtolower($order->status));

        // Ledger NOT Debited
        $this->centerA->refresh();
        $this->assertEquals(0, $this->centerA->current_due);
        $ledgerExists = CenterLedger::where('reference_id', $order->id)->exists();
        $this->assertFalse($ledgerExists);

        // Documents Locked
        $docResponse = $this->get(route('student.show', [$student->id, 'idcard' => 'idcard']));
        $docResponse->assertStatus(403);

        // Simulate Payment
        $transaction = Transaction::create([
            'trx_id' => 'TRX_TEST1',
            'amount' => 500,
            'gateway' => 'sslcommerz',
            'status' => 'success',
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
        
        // This simulates the webhook firing PaymentSucceeded
        event(new PaymentSucceeded(clone $transaction, $order));

        $order->refresh();
        $student->refresh();
        $this->centerA->refresh();

        $this->assertEquals('paid', strtolower($order->status));
        $this->assertEquals(1, $student->payment_status);
        $this->assertEquals(0, $this->centerA->current_due);

        // Documents Unlocked
        $docResponse2 = $this->get(route('student.show', [$student->id, 'idcard' => 'idcard']));
        $docResponse2->assertStatus(200);
    }

    public function test_credit_flow_and_reconciliation()
    {
        $this->actingAs($this->userA);
        $payload = $this->getPayload('credit');

        $response = $this->post(route('student.store'), $payload);
        
        $order = Order::latest()->first();
        $student = Student::latest()->first();

        // Redirects back to index on success
        $response->assertRedirect(route('student.index'));

        // Ledger Debited
        $this->centerA->refresh();
        $this->assertEquals(500, $this->centerA->current_due);

        // Student still unpaid
        $this->assertEquals(0, $student->payment_status);
        
        // Documents Unlocked because credit is authorized
        $docResponse = $this->get(route('student.show', [$student->id, 'idcard' => 'idcard']));
        $docResponse->assertStatus(200);

        // Simulate Payment Reconciliation
        $transaction = Transaction::create([
            'trx_id' => 'TRX_TEST2',
            'amount' => 500,
            'gateway' => 'sslcommerz',
            'status' => 'success',
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
        event(new PaymentSucceeded(clone $transaction, $order));

        $order->refresh();
        $student->refresh();
        $this->centerA->refresh();

        // Order Paid, Student Paid
        $this->assertEquals('paid', strtolower($order->status));
        $this->assertEquals(1, $student->payment_status);

        // Ledger Credited -> Due is 0
        $this->assertEquals(0, $this->centerA->current_due);
    }

    public function test_duplicate_payment_protection()
    {
        $this->actingAs($this->userA);
        $this->post(route('student.store'), $this->getPayload('pay_now'));
        $order = Order::latest()->first();

        $transaction = Transaction::create([
            'trx_id' => 'TRX_DUP',
            'amount' => 500,
            'gateway' => 'sslcommerz',
            'status' => 'success',
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
        
        event(new PaymentSucceeded(clone $transaction, $order));
        $order->refresh();
        $this->assertEquals('paid', strtolower($order->status));
        $this->assertEquals(500, $order->paid_amount);
        $this->assertEquals(0, $order->due_amount);

        // Replay Event
        event(new PaymentSucceeded(clone $transaction, $order));
        
        // Assert amounts did not double
        $order->refresh();
        $this->assertEquals(500, $order->paid_amount, "Duplicate payment should not increase paid amount");
    }

    public function test_tenant_isolation()
    {
        $this->actingAs($this->userA);
        $this->post(route('student.store'), $this->getPayload('pay_now'));
        $studentA = Student::latest()->first();

        // Switch to User B
        $this->actingAs($this->userB);

        // Center B attempts to access Center A's student doc
        $docResponse = $this->get(route('student.show', [$studentA->id, 'idcard' => 'idcard']));
        $this->assertTrue(in_array($docResponse->status(), [403, 404]));
    }

    public function test_credit_limit_boundary()
    {
        $this->centerA->update(['credit_limit' => 500]);
        $this->actingAs($this->userA);
        
        // First request should pass (due becomes 500)
        $this->post(route('student.store'), $this->getPayload('credit'))->assertRedirect(route('student.index'));
        $this->centerA->refresh();
        $this->assertEquals(500, $this->centerA->current_due);

        // Second request should fail because limit is 500 and we need another 500
        $response = $this->post(route('student.store'), $this->getPayload('credit'));
        $response->assertSessionHasErrors('payment_method');
    }

    public function test_admin_registration()
    {
        $this->actingAs($this->admin, 'admin');

        $payload = array_merge($this->getPayload(), [
            'center_id' => $this->centerA->id,
            'status' => 1,
            'course_duration' => '6 Months',
            'qualification' => 'SSC',
            'course_type' => \App\Enums\CourseType::Regular,
            'nid_or_birth' => '1234567890',
            'present_address' => 'Dhaka',
            'permanent_address' => 'Dhaka',
        ]);
        
        // Admin creates registration
        $response = $this->post(route('admin.student.store'), $payload, ['X-Inertia' => 'true']);
        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('admin.student.index'));
        
        $order = Order::latest()->first();
        $this->assertNotNull($order, 'Order was not created by Admin StudentController');
        
        // Ledger should be debited unconditionally
        $this->centerA->refresh();
        $this->assertEquals(500, $this->centerA->current_due);
    }
}
