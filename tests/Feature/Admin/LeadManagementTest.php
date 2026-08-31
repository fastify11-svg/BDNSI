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
    }
}
