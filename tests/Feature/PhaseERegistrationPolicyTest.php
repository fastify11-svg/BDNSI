<?php

namespace Tests\Feature;

use App\Enums\CourseType;
use App\Enums\Gender;
use App\Enums\Religion;
use App\Models\Center;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use App\Models\Order;
use App\Models\Price;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhaseERegistrationPolicyTest extends TestCase
{
    use DatabaseTransactions, WithFaker;

    protected $center;
    protected $user;
    protected $session;
    protected $subject;

    protected function setUp(): void
    {
        parent::setUp();

        $this->center = Center::factory()->create([
            'credit_enabled' => true,
            'credit_limit' => 10000,
            'current_due' => 0,
            'allow_registration_without_payment' => false,
            'status' => \App\Enums\CenterStatus::Approved,
        ]);

        $this->user = User::factory()->create([
            'center_id' => $this->center->id,
            'username' => 'center'.time(),
            'phone' => '1234567890'
        ]);

        $this->session = Session::first();
        if (!$this->session) {
            $this->session = Session::create(['name' => 'Test Session', 'status' => \App\Enums\SessionStatus::Active]);
        }

        $this->subject = Subject::first();
        if (!$this->subject) {
            $this->subject = Subject::create(['name' => 'Test Subject']);
        }

        // Setup base price for registration
        Price::where('product_type', 'registration')->delete();
        Price::create([
            'center_id' => null,
            'product_type' => 'registration',
            'base_price' => 500,
            'discount' => 0,
            'status' => 1,
        ]);
    }

    public function test_registration_creates_order_and_blocks_access_without_credit_policy()
    {
        $this->actingAs($this->user);

        // Center does NOT have allow_registration_without_payment enabled
        $this->center->update([
            'allow_registration_without_payment' => false,
            'current_due' => 0,
        ]);

        $payload = [
            'name' => 'John Doe',
            'fathers_name' => 'Father Doe',
            'mothers_name' => 'Mother Doe',
            'date_of_birth' => '2000-01-01',
            'gender' => Gender::Male,
            'religion' => Religion::Muslim,
            'phone' => '01700000000',
            'session_id' => $this->session->id,
            'subject_id' => $this->subject->id,
            'payment_method' => 'pay_now'
        ];

        $response = $this->post(route('student.store'), $payload);

        // The center should be redirected to pay the invoice
        $order = Order::latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals(500, $order->total_amount);
        
        $response->assertRedirect(route('center.orders.show', $order->id));

        $student = Student::latest()->first();
        $this->assertEquals(0, $student->payment_status);
        $this->assertEquals(500, $student->due_amount);

        // Access to ID card should be blocked
        $docResponse = $this->get(route('student.show', [$student->id, 'idcard' => 'idcard']));
        $docResponse->assertStatus(403);
    }

    public function test_registration_creates_order_and_allows_access_with_credit_policy()
    {
        $this->center->update([
            'allow_registration_without_payment' => true,
            'current_due' => 0,
        ]);

        $this->actingAs($this->user);

        $payload = [
            'name' => 'Jane Doe',
            'fathers_name' => 'Father Doe',
            'mothers_name' => 'Mother Doe',
            'date_of_birth' => '2000-01-01',
            'gender' => Gender::Female,
            'religion' => Religion::Muslim,
            'phone' => '01800000000',
            'session_id' => $this->session->id,
            'subject_id' => $this->subject->id,
            'payment_method' => 'credit'
        ];

        $response = $this->post(route('student.store'), $payload);

        // Since policy is true and credit used, should redirect back to index
        $response->assertRedirect(route('student.index'));

        $order = Order::latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals(500, $order->total_amount);

        $student = Student::latest()->first();
        $this->assertEquals(0, $student->payment_status);
        $this->assertEquals(500, $student->due_amount);

        // Ledger should be updated immediately
        $this->center->refresh();
        $this->assertEquals(500, $this->center->current_due);

        // Access to ID card should be allowed
        $docResponse = $this->get(route('student.show', [$student->id, 'idcard' => 'idcard']));
        $docResponse->assertStatus(200);
    }

    public function test_free_registration_is_completed_immediately()
    {
        $this->withoutExceptionHandling();
        // Set price to 0
        Price::where('product_type', 'registration')->delete();
        Price::create([
            'center_id' => null,
            'product_type' => 'registration',
            'base_price' => 0,
            'discount' => 0,
            'status' => 1,
        ]);

        $this->actingAs($this->user);

        $payload = [
            'name' => 'Free Doe',
            'fathers_name' => 'Father Doe',
            'mothers_name' => 'Mother Doe',
            'date_of_birth' => '2000-01-01',
            'gender' => Gender::Male,
            'religion' => Religion::Muslim,
            'phone' => '01900000000',
            'session_id' => $this->session->id,
            'subject_id' => $this->subject->id,
        ];

        $response = $this->post(route('student.store'), $payload);

        $response->assertRedirect(route('student.index'));

        $student = Student::latest()->first();
        $this->assertEquals(1, $student->payment_status);
        $this->assertEquals(0, $student->due_amount);

        $order = Order::latest()->first();
        $this->assertEquals('paid', strtolower($order->status));

        // Access allowed
        $docResponse = $this->get(route('student.show', [$student->id, 'idcard' => 'idcard']));
        $docResponse->assertStatus(200);
    }
}
