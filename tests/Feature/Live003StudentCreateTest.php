<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class Live003StudentCreateTest extends TestCase
{
    public function test_student_create_renders()
    {
        $this->withoutExceptionHandling();
        $admin = \App\Models\Admin::factory()->create();
        $mockAdmin = \Mockery::mock($admin)->makePartial();
        $mockAdmin->shouldReceive('isAbleTo')->andReturn(true);
        $mockAdmin->shouldReceive('hasPermission')->andReturn(true);
        $mockAdmin->shouldReceive('hasRole')->andReturn(true);

        $response = $this->actingAs($mockAdmin, 'admin')->get('/admin/student/create');

        $response->assertStatus(200);
    }
}
