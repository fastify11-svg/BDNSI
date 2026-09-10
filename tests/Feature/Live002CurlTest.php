<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class Live002CurlTest extends TestCase
{
    use DatabaseTransactions;

    public function test_curl()
    {
        $admin = Admin::factory()->create();
        
        $role = \App\Models\Role::firstOrCreate(['name' => 'superadmin']);
        $permission = \App\Models\Permission::firstOrCreate(['name' => 'result-read']);
        if (!$role->hasPermission('result-read')) {
            $role->attachPermission($permission);
        }
        if (!$admin->hasRole('superadmin')) {
            $admin->attachRole($role);
        }
        \Illuminate\Support\Facades\Config::set('laratrust.cache.enabled', false);
        
        $response = $this->actingAs($admin, 'admin')->get('/admin/result');
        echo "STATUS: " . $response->status() . "\n";
        if ($response->status() === 500) {
            echo "EXCEPTION: " . $response->exception->getMessage() . "\n";
            echo $response->exception->getTraceAsString() . "\n";
        }
    }
}
