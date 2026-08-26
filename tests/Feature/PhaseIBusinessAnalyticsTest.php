<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Commission;
use App\Models\Order;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\Session;
use App\Models\Subject;
use App\Models\Transaction;
use App\Models\Team;
use App\Services\AnalyticsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PhaseIBusinessAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    protected AnalyticsService $analytics;

    protected function setUp(): void
    {
        parent::setUp();
        $this->analytics = new AnalyticsService();
    }

    protected function createOrder($overrides = [])
    {
        return Order::forceCreate(array_merge([
            'center_id' => 1,
            'order_number' => Str::random(10),
            'total_amount' => 0,
            'discount_amount' => 0,
            'payable_amount' => 0,
            'paid_amount' => 0,
            'due_amount' => 0,
            'status' => 'pending'
        ], $overrides));
    }

    protected function createStudent($overrides = [])
    {
        $session = Session::firstOrCreate(['id' => 1], ['name' => '2026', 'year' => '2026']);
        $subject = Subject::firstOrCreate(['id' => 1], ['name' => 'Math', 'code' => 'MTH', 'course_fee' => 0]);

        return Student::forceCreate(array_merge([
            'center_id' => 1,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'name' => 'Test Student',
            'fathers_name' => 'Father',
            'mothers_name' => 'Mother',
            'password' => 'secret',
            'date_of_birth' => '2000-01-01',
            'gender' => 1,
            'religion' => 1,
            'present_address' => 'N/A',
            'permanent_address' => 'N/A',
            'status' => 1,
            'payment_status' => 1,
            'course_type' => 1,
            'due_amount' => 0,
            'paid_amount' => 0
        ], $overrides));
    }

    /** @test */
    public function it_calculates_gross_revenue_correctly_ignoring_cancelled_orders()
    {
        $center = Center::factory()->create();

        $this->createOrder(['center_id' => $center->id, 'total_amount' => 1000, 'status' => 'pending']);
        $this->createOrder(['center_id' => $center->id, 'total_amount' => 500, 'status' => 'paid']);
        $this->createOrder(['center_id' => $center->id, 'total_amount' => 2000, 'status' => 'cancelled']);

        $revenue = $this->analytics->getGrossRevenue($center->id);

        $this->assertEquals(1500, $revenue);
    }

    /** @test */
    public function it_calculates_collected_revenue_correctly_and_handles_tenant_isolation()
    {
        $centerA = Center::factory()->create();
        $centerB = Center::factory()->create();

        $orderA = $this->createOrder(['center_id' => $centerA->id]);
        $orderB = $this->createOrder(['center_id' => $centerB->id]);

        $orderA->transactions()->create([
            'trx_id' => 'TRX_A1', 'amount' => 500, 'status' => 'success', 'currency' => 'BDT'
        ]);

        $orderA->transactions()->create([
            'trx_id' => 'TRX_A2', 'amount' => 300, 'status' => 'failed', 'currency' => 'BDT'
        ]);

        $orderB->transactions()->create([
            'trx_id' => 'TRX_B1', 'amount' => 1000, 'status' => 'success', 'currency' => 'BDT'
        ]);

        $this->assertEquals(1500, $this->analytics->getCollectedRevenue());
        $this->assertEquals(500, $this->analytics->getCollectedRevenue($centerA->id));
        $this->assertEquals(1000, $this->analytics->getCollectedRevenue($centerB->id));
    }

    /** @test */
    public function it_calculates_registration_counts_accurately()
    {
        $center = Center::factory()->create();

        $this->createStudent(['center_id' => $center->id, 'payment_status' => 1]);
        $this->createStudent(['center_id' => $center->id, 'payment_status' => 1]);
        $this->createStudent(['center_id' => $center->id, 'payment_status' => 1]);

        $this->createStudent(['center_id' => $center->id, 'payment_status' => 0]);
        $this->createStudent(['center_id' => $center->id, 'payment_status' => 0]);

        $stats = $this->analytics->getRegistrationCounts($center->id);

        $this->assertEquals(5, $stats['total']);
        $this->assertEquals(3, $stats['paid']);
        $this->assertEquals(2, $stats['unpaid']);
    }

    /** @test */
    public function it_calculates_document_approval_rates()
    {
        $center = Center::factory()->create();
        $student = $this->createStudent(['center_id' => $center->id]);

        $type = \App\Models\DocumentType::firstOrCreate(['id' => 1], ['name' => 'NID', 'is_required' => 1, 'is_active' => 1]);

        StudentDocument::forceCreate(['student_id' => $student->id, 'document_type_id' => $type->id, 'file_path' => 'x', 'status' => 'Approved']);
        StudentDocument::forceCreate(['student_id' => $student->id, 'document_type_id' => $type->id, 'file_path' => 'x', 'status' => 'Approved']);
        StudentDocument::forceCreate(['student_id' => $student->id, 'document_type_id' => $type->id, 'file_path' => 'x', 'status' => 'Rejected']);
        StudentDocument::forceCreate(['student_id' => $student->id, 'document_type_id' => $type->id, 'file_path' => 'x', 'status' => 'Pending']);

        $stats = $this->analytics->getDocumentApprovalStats($center->id);

        $this->assertEquals(4, $stats['total']);
        $this->assertEquals(2, $stats['approved']);
        $this->assertEquals(1, $stats['rejected']);
        $this->assertEquals(1, $stats['pending']);
        $this->assertEquals(50.0, $stats['approval_rate']);
    }

    /** @test */
    public function analytics_queries_do_not_mutate_the_ledger()
    {
        $center = Center::factory()->create();

        $order = $this->createOrder([
            'center_id' => $center->id,
            'total_amount' => 1000,
            'due_amount' => 1000,
            'paid_amount' => 0,
            'status' => 'pending'
        ]);

        $this->analytics->getGrossRevenue();
        $this->analytics->getOutstandingOrderDue();
        $this->analytics->getCollectedRevenue();

        $order->refresh();
        $this->assertEquals(1000, $order->due_amount);
        $this->assertEquals(0, $order->paid_amount);
        $this->assertEquals('pending', $order->status);
    }

    /** @test */
    public function it_counts_only_orders_with_the_canonical_partially_paid_status()
    {
        $center = Center::factory()->create();

        $this->createOrder([
            'center_id' => $center->id,
            'status' => Order::STATUS_PARTIALLY_PAID,
            'paid_amount' => 250,
            'due_amount' => 750,
        ]);
        $this->createOrder([
            'center_id' => $center->id,
            'status' => Order::STATUS_PAID,
            'paid_amount' => 1000,
            'due_amount' => 0,
        ]);

        $this->assertSame(1, $this->analytics->getPartialPaymentCount($center->id));
    }

    /** @test */
    public function it_calculates_commissions_from_the_commissions_table_and_scopes_by_order_center()
    {
        $centerA = Center::factory()->create();
        $centerB = Center::factory()->create();
        $team = Team::forceCreate(['name' => 'Analytics Team', 'email' => 'analytics-team@example.test']);

        $orderA = $this->createOrder(['center_id' => $centerA->id]);
        $orderB = $this->createOrder(['center_id' => $centerB->id]);

        Commission::forceCreate([
            'team_id' => $team->id,
            'order_id' => $orderA->id,
            'calculated_revenue' => 1000,
            'amount' => 100,
            'status' => 'Earned',
        ]);
        Commission::forceCreate([
            'team_id' => $team->id,
            'order_id' => $orderA->id,
            'calculated_revenue' => 1000,
            'amount' => 50,
            'status' => 'Paid',
        ]);
        Commission::forceCreate([
            'team_id' => $team->id,
            'order_id' => $orderB->id,
            'calculated_revenue' => 1000,
            'amount' => 200,
            'status' => 'Cancelled',
        ]);

        $stats = $this->analytics->getCommissionStats($centerA->id);

        $this->assertEquals(150, $stats['earned']);
        $this->assertEquals(50, $stats['paid']);
        $this->assertEquals(100, $stats['unpaid']);
    }
}
