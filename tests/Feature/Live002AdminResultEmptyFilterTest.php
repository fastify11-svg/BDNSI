<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class Live002AdminResultEmptyFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_result_empty_filter_renders()
    {
        $admin = Admin::factory()->create();
        
        $mockAdmin = \Mockery::mock($admin)->makePartial();
        $mockAdmin->shouldReceive('isAbleTo')->andReturn(true);
        $mockAdmin->shouldReceive('hasPermission')->andReturn(true);
        $mockAdmin->shouldReceive('hasRole')->andReturn(true);

        $response = $this->withoutExceptionHandling()
            ->actingAs($mockAdmin, 'admin')
            ->get('/admin/result?center=&session=&subject=');

        $response->assertStatus(200);
    }
}
