<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Center;
use App\Models\CenterLedger;
use App\Models\Role;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhaseGReportingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $role = \App\Models\Role::firstOrCreate(['name' => 'admin']);
        $this->admin = Admin::factory()->create();
        $this->admin->addRole($role);
        
        $centerRole = \App\Models\Role::firstOrCreate(['name' => 'center']);
        $this->center = Center::factory()->create(['id' => 1, 'name' => 'Center A', 'code' => 'C-001']);
        $this->centerUser = User::factory()->create(['center_id' => $this->center->id, 'username' => 'center_user', 'phone' => '01711111111']);
    }

    public function test_admin_can_access_reports()
    {
        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.reports.index'));

        $response->assertOk();
    }

    public function test_center_cannot_access_reports()
    {
        $response = $this->actingAs($this->centerUser)
            ->get(route('admin.reports.index'));

        // Since it uses admin guards, center user acting as default web guard
        // will get redirected to admin login or forbidden.
        $this->assertTrue(in_array($response->status(), [302, 401, 403]));
    }
    
    public function test_reports_calculate_revenue_correctly()
    {
        $sessionId = \App\Models\Session::create(['name' => '2026'])->id;
        $subjectId = \Illuminate\Support\Facades\DB::table('subjects')->insertGetId(['name' => 'Math']);
        // 5 students * 250 = 1250 in registrations
        Student::factory()->count(5)->create([
            'center_id' => $this->center->id,
            'session_id' => $sessionId,
            'subject_id' => $subjectId,
        ]);
        
        // 500 in ledger
        CenterLedger::create(['center_id' => $this->center->id, 'amount' => 500, 'type' => 'credit', 'description' => 'Payment', 'balance_after' => 500]);

        $response = $this->actingAs($this->admin, 'admin')
            ->get(route('admin.reports.index'));

        $response->assertOk();
        // Inertia testing
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Admin/Reports/Index')
            ->where('metrics.total_revenue', 500)
        );
    }
}
