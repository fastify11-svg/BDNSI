<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Student;
use App\Models\User;
use App\Models\Session;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhaseDCertificateHubTest extends TestCase
{
    use RefreshDatabase;

    public function test_center_can_view_cleared_student_certificate()
    {
        $center = Center::factory()->create(['credit_limit' => 0]);
        $user = User::factory()->create(['center_id' => $center->id, 'username' => 'center'.time(), 'phone' => '1234567890']);
        $session = \App\Models\Session::create(['name' => 'Test Session', 'status' => \App\Enums\SessionStatus::Active, 'course_type' => \App\Enums\CourseType::Regular, 'duration' => 6]);
        $subject = \App\Models\Subject::create(['name' => 'Test Subject', 'code' => 'TS101', 'fee' => 1000]);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'result_publised' => now(), // Required to appear in cert hub
            'due_amount' => 0, // Financially cleared
            'paid_amount' => 1000,
            'payment_status' => 1
        ]);

        $response = $this->actingAs($user)->get(route('center.certificates.index'));
        $response->assertStatus(200);

        // Check if student is cleared in the UI
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Center/Certificate/Index')
            ->where('students.data.0.id', $student->id)
            ->where('students.data.0.is_cleared', true)
        );

        // Try downloading
        $downloadResponse = $this->actingAs($user)->get(route('center.certificates.show', $student->id));
        $downloadResponse->assertStatus(200);
    }

    public function test_center_cannot_download_unpaid_student_certificate_if_no_credit()
    {
        $center = Center::factory()->create([
            'credit_limit' => 0,
            'allow_certificate_without_payment' => 0
        ]);
        $user = User::factory()->create(['center_id' => $center->id, 'username' => 'center2'.time(), 'phone' => '1234567890']);
        $session = \App\Models\Session::create(['name' => 'Test Session 2', 'status' => \App\Enums\SessionStatus::Active, 'course_type' => \App\Enums\CourseType::Regular, 'duration' => 6]);
        $subject = \App\Models\Subject::create(['name' => 'Test Subject 2', 'code' => 'TS102', 'fee' => 1000]);

        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'result_publised' => now(),
            'due_amount' => 1000,
            'paid_amount' => 0,
            'payment_status' => 0
        ]);

        $response = $this->actingAs($user)->get(route('center.certificates.index'));
        $response->assertStatus(200);
        
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Center/Certificate/Index')
            ->where('students.data.0.id', $student->id)
            ->where('students.data.0.is_cleared', false)
        );

        // Try downloading directly, should be forbidden
        $downloadResponse = $this->actingAs($user)->get(route('center.certificates.show', $student->id));
        $downloadResponse->assertStatus(403);
    }
}
