<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Lead;
use App\Models\Team;
use App\Models\Center;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Role;

class LeadManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $role = Role::firstOrCreate(['name' => 'admin', 'display_name' => 'Admin']);
        
        $this->admin = Admin::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password')
        ]);
        $this->admin->attachRole($role);
    }

    public function test_admin_can_view_leads_index()
    {
        Lead::create([
            'name' => 'Test Lead',
            'phone' => '01700000000',
            'status' => 'New'
        ]);

        $response = $this->actingAs($this->admin, 'admin')->get(route('admin.leads.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_a_lead()
    {
        $team = Team::create([
            'name' => 'Sales Team',
        ]);

        $leadData = [
            'name' => 'John Doe',
            'phone' => '01800000000',
            'source' => 'Facebook',
            'team_id' => $team->id,
            'status' => 'New',
        ];

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.leads.store'), $leadData);

        $response->assertRedirect();
        $this->assertDatabaseHas('leads', [
            'name' => 'John Doe',
            'phone' => '01800000000',
            'status' => 'New',
            'team_id' => $team->id,
        ]);
    }

    public function test_admin_can_update_a_lead()
    {
        $lead = Lead::create([
            'name' => 'Old Name',
            'phone' => '01900000000',
            'status' => 'New'
        ]);
        
        $center = Center::create([
            'name' => 'New Center',
            'center_code' => 'NC01',
            'owner_name' => 'Test Owner',
            'status' => 1,
            'phone' => '01234'
        ]);

        $updatedData = [
            'name' => 'Updated Name',
            'phone' => '01900000000',
            'status' => 'Converted',
            'center_id' => $center->id,
        ];

        $response = $this->actingAs($this->admin, 'admin')->put(route('admin.leads.update', $lead), $updatedData);

        $response->assertRedirect();
        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'name' => 'Updated Name',
            'status' => 'Converted',
            'center_id' => $center->id,
        ]);
    }

    public function test_admin_can_delete_a_lead()
    {
        $lead = Lead::create([
            'name' => 'To Delete',
            'phone' => '01111111111',
            'status' => 'New'
        ]);

        $response = $this->actingAs($this->admin, 'admin')->delete(route('admin.leads.destroy', $lead));

        $response->assertRedirect();
        $this->assertDatabaseMissing('leads', [
            'id' => $lead->id,
        ]);
        
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'lead_deleted',
            'auditable_id' => $lead->id,
            'auditable_type' => Lead::class,
            'user_id' => $this->admin->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_leads()
    {
        $response = $this->get(route('admin.leads.index'));
        $response->assertRedirect(route('admin.login'));
    }

    public function test_sub_admin_without_role_cannot_access_leads()
    {
        $subAdminRole = Role::firstOrCreate(['name' => 'sub_admin', 'display_name' => 'Sub Admin']);
        $subAdmin = Admin::create([
            'name' => 'Test Sub Admin',
            'email' => 'subadmin@test.com',
            'password' => bcrypt('password')
        ]);
        $subAdmin->attachRole($subAdminRole);

        $response = $this->actingAs($subAdmin, 'admin')->get(route('admin.leads.index'));
        $response->assertStatus(403);
    }

    public function test_lead_creation_records_created_by_and_audit_log()
    {
        $leadData = [
            'name' => 'Audit Lead',
            'phone' => '01888888888',
            'status' => 'New',
        ];

        $this->actingAs($this->admin, 'admin')->post(route('admin.leads.store'), $leadData);

        $this->assertDatabaseHas('leads', [
            'name' => 'Audit Lead',
            'created_by' => $this->admin->id,
        ]);

        $lead = Lead::where('name', 'Audit Lead')->first();

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'event' => 'lead_created',
            'auditable_id' => $lead->id,
            'auditable_type' => Lead::class,
        ]);
    }

    public function test_lead_update_records_audit_log()
    {
        $lead = Lead::create([
            'name' => 'Update Audit',
            'phone' => '01900000000',
            'status' => 'New'
        ]);

        $updatedData = [
            'name' => 'Updated Audit Name',
            'phone' => '01900000000',
            'status' => 'Converted',
        ];

        $this->actingAs($this->admin, 'admin')->put(route('admin.leads.update', $lead), $updatedData);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'event' => 'lead_updated',
            'auditable_id' => $lead->id,
            'auditable_type' => Lead::class,
        ]);
    }

    public function test_lead_conversion_creates_center_and_price()
    {
        $lead = Lead::create([
            'name' => 'Conversion Test',
            'phone' => '01500000000',
            'status' => 'Negotiating',
            'proposed_price' => 5000.00,
            'created_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin, 'admin')->post(route('admin.leads.convert', $lead));

        $response->assertRedirect();
        
        $this->assertDatabaseHas('centers', [
            'name' => 'Conversion Test',
            'mobile' => '01500000000',
        ]);

        $center = Center::where('name', 'Conversion Test')->first();

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'status' => 'Converted',
            'center_id' => $center->id,
        ]);

        $this->assertDatabaseHas('prices', [
            'center_id' => $center->id,
            'product_type' => 'STUDENT_REGISTRATION',
            'base_price' => 5000.00,
            'status' => 1,
        ]);
    }

    public function test_sub_admin_cannot_convert_unowned_lead()
    {
        $subAdminRole = Role::firstOrCreate(['name' => 'sub_admin', 'display_name' => 'Sub Admin']);
        // Create permission and attach to role
        $permission = \App\Models\Permission::firstOrCreate(['name' => 'update-leads', 'display_name' => 'Update Leads']);
        $subAdminRole->attachPermission($permission);

        $subAdmin = Admin::create([
            'name' => 'Sales Agent',
            'email' => 'sales@test.com',
            'password' => bcrypt('password')
        ]);
        $subAdmin->attachRole($subAdminRole);

        // Lead created by someone else
        $lead = Lead::create([
            'name' => 'Other Lead',
            'phone' => '01234567890',
            'status' => 'New',
            'created_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($subAdmin, 'admin')->post(route('admin.leads.convert', $lead));
        $response->assertStatus(403);
    }
}
