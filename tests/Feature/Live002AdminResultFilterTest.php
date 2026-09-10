<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Center;
use App\Models\Session;
use App\Models\Subject;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class Live002AdminResultFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_result_filter_renders()
    {
        $admin = Admin::factory()->create();
        
        $mockAdmin = \Mockery::mock($admin)->makePartial();
        $mockAdmin->shouldReceive('isAbleTo')->andReturn(true);
        $mockAdmin->shouldReceive('hasPermission')->andReturn(true);
        $mockAdmin->shouldReceive('hasRole')->andReturn(true);

        $center = Center::create(['code' => 'C01', 'name' => 'Center 1', 'status' => \App\Enums\CenterStatus::Approved]);
        $session = Session::create(['name' => 'S1', 'duration' => 6, 'status' => \App\Enums\SessionStatus::Active]);
        $subject = Subject::create(['name' => 'Sub1', 'code' => 'SB1']);
        
        Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => \App\Enums\StudentStatus::Approved,
        ]);

        $response = $this->withoutExceptionHandling()
            ->actingAs($mockAdmin, 'admin')
            ->get('/admin/result?center='.$center->id.'&session='.$session->id.'&subject='.$subject->id);

        $response->assertStatus(200);
    }
}
