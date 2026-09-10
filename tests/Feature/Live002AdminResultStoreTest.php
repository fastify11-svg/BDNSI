<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Center;
use App\Models\Session;
use App\Models\Subject;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class Live002AdminResultStoreTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_result_store()
    {
        $admin = Admin::factory()->create();
        
        $mockAdmin = \Mockery::mock($admin)->makePartial();
        $mockAdmin->shouldReceive('isAbleTo')->andReturn(true);
        $mockAdmin->shouldReceive('hasPermission')->andReturn(true);
        $mockAdmin->shouldReceive('hasRole')->andReturn(true);

        $center = Center::create(['code' => 'C01', 'name' => 'Center 1', 'status' => \App\Enums\CenterStatus::Approved]);
        $session = Session::create(['name' => 'S1', 'duration' => 6, 'status' => \App\Enums\SessionStatus::Active]);
        $subject = Subject::create(['name' => 'Sub1', 'code' => 'SB1']);
        
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => \App\Enums\StudentStatus::Approved,
        ]);

        $response = $this->withoutExceptionHandling()
            ->actingAs($mockAdmin, 'admin')
            ->post('/admin/result', [
                'id' => $student->id,
                'status' => true,
                'written' => 60,
                'practical' => 20,
                'viva' => 10,
            ]);

        $response->assertStatus(302);
    }
}
