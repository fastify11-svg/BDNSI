<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Admin;
use App\Models\Order;
use App\Models\Center;
use App\Models\Student;
use App\Models\Commission;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;

class PhaseNAdvancedReportingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $admin = Admin::factory()->create();
        
        $role = \App\Models\Role::firstOrCreate(['name' => 'admin'], ['display_name' => 'Admin']);
        $admin->addRole($role);
        
        $this->actingAs($admin, 'admin');
    }

    #[Test]
    public function admin_can_access_advanced_reports()
    {
        // Create dummy data
        $team = \App\Models\Team::create(['name' => 'Default Team', 'domain' => 'default']);
        $center = Center::factory()->create(['credit_enabled' => true, 'credit_limit' => 1000, 'team_id' => $team->id]);
        $session = \App\Models\Session::create(['name' => '2024', 'duration' => 6, 'team_id' => $team->id]);
        $subject = \App\Models\Subject::create(['name' => 'Math', 'code' => 'M101', 'duration' => 6, 'rate' => 500, 'type' => 0, 'team_id' => $team->id]);
        $student = Student::factory()->create(['center_id' => $center->id, 'session_id' => $session->id, 'subject_id' => $subject->id, 'phone' => '01700000000', 'team_id' => $team->id]);
        $order = Order::create(['center_id' => $center->id, 'order_number' => 'ORD-001', 'total_amount' => 500, 'payable_amount' => 500, 'paid_amount' => 500, 'due_amount' => 0, 'status' => Order::STATUS_PAID, 'team_id' => $team->id]);
        $policy = \App\Models\CommissionPolicy::create(['name' => 'Default Policy', 'value' => 10, 'team_id' => $team->id]);
        Commission::create(['order_id' => $order->id, 'amount' => 50, 'status' => 'Paid', 'team_id' => $team->id, 'commission_policy_id' => $policy->id, 'calculated_revenue' => 500]);
        
        // Mocking an audit log
        DB::table('audit_logs')->insert([
            'user_id' => 1,
            'event' => 'CERTIFICATE_VERIFIED',
            'auditable_type' => Student::class,
            'auditable_id' => $student->id,
            'created_at' => now(),
            'updated_at' => now(),
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test'
        ]);
        
        // Access reports
        $response = $this->get(route('admin.reports.index'));
        
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Reports/Index')
            ->has('metrics.total_revenue')
            ->has('revenue_chart_data')
            ->has('top_agents')
            ->has('product_demand')
            ->has('credit_exposure')
            ->has('metrics.total_issuances')
            ->has('metrics.total_verifications')
        );
    }
}
