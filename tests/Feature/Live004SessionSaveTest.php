<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class Live004SessionSaveTest extends TestCase
{
    use DatabaseTransactions;

    public function test_session_store_does_not_500()
    {
        $admin = Admin::factory()->create();
        
        $mockAdmin = \Mockery::mock($admin)->makePartial();
        $mockAdmin->shouldReceive('isAbleTo')->andReturn(true);
        $mockAdmin->shouldReceive('hasPermission')->andReturn(true);
        $mockAdmin->shouldReceive('hasRole')->andReturn(true);

        $response = $this->actingAs($mockAdmin, 'admin')
            ->post('/admin/session', [
                'name' => '2026-2027',
                'duration' => 6,
                'status' => 1,
                'exam_date' => '',
                'result_published_date' => '',
            ]);

        $response->assertStatus(302);
        
        $this->assertDatabaseHas('sessions', [
            'name' => '2026-2027',
            'duration' => 6,
            'status' => 1,
        ]);
    }
}
