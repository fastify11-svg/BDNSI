<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminRbacTest extends TestCase
{
    use RefreshDatabase;

    public function test_subadmin_cannot_access_financial_routes()
    {
        $role = clone Role::firstOrCreate(['name' => 'sub_admin']);
        $admin = clone Admin::factory()->create();
        $admin->addRole($role);

        $response = $this->actingAs($admin, 'admin')->get(route('admin.financial.index'));

        // Should return 403 Forbidden because they lack 'admin' role
        $response->assertStatus(403);
    }

    public function test_admin_can_access_financial_routes()
    {
        $role = clone Role::firstOrCreate(['name' => 'admin']);
        $admin = clone Admin::factory()->create();
        $admin->addRole($role);

        $response = $this->actingAs($admin, 'admin')->get(route('admin.financial.index'));

        // Should NOT return 403. Might return 200 or 500/redirect if DB isn't seeded completely, but not 403.
        $this->assertNotEquals(403, $response->getStatusCode());
    }

    public function test_subadmin_can_access_student_routes()
    {
        $role = Role::firstOrCreate(['name' => 'sub_admin']);
        $permission = \App\Models\Permission::firstOrCreate(['name' => 'student-read']);
        $role->givePermission($permission);
        
        $admin = clone Admin::factory()->create();
        $admin->addRole($role);

        $response = $this->actingAs($admin, 'admin')->get(route('admin.student.index'));

        // Should NOT return 403.
        $this->assertNotEquals(403, $response->getStatusCode());
    }
}
