<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Result;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Enums\StudentStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PhaseJPrivacyVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_verification_does_not_expose_pii()
    {
        $center = Center::factory()->create(['status' => \App\Enums\CenterStatus::Approved]);
        $session = Session::create(['name' => '2026', 'status' => 1]);
        $subject = Subject::create(['name' => 'Computer Science', 'code' => 'CS101', 'status' => 1]);
        
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => StudentStatus::Approved,
            'registration' => '12345678',
            'roll' => '87654321',
            'phone' => '01700000000',
            'nid_or_birth' => 'NID123456',
            'present_address' => 'Dhaka',
            'email' => 'student@test.com'
        ]);

        $result = Result::create([
            'student_id' => $student->id,
            'certificate_serial' => 'ABC1234567',
            'written' => 50,
            'practical' => 30,
            'viva' => 10,
            'total' => 90,
            'grade' => 'A'
        ]);

        $response = $this->post(route('verify.check'), [
            'registration' => '12345678'
        ]);

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Verify')
            ->has('student.data', fn (Assert $page) => $page
                ->has('id')
                ->has('name')
                ->has('registration')
                ->has('roll')
                ->has('picture')
                ->has('result_grade')
                ->missing('phone')
                ->missing('email')
                ->missing('nid_or_birth')
                ->missing('present_address')
                ->etc()
            )
        );
    }

    public function test_public_result_does_not_expose_pii()
    {
        $center = Center::factory()->create(['status' => \App\Enums\CenterStatus::Approved]);
        $session = Session::create(['name' => '2026', 'status' => 1]);
        $subject = Subject::create(['name' => 'Computer Science', 'code' => 'CS101', 'status' => 1]);
        
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => StudentStatus::Approved,
            'registration' => '12345678',
            'roll' => '87654321',
            'phone' => '01700000000',
            'nid_or_birth' => 'NID123456',
            'present_address' => 'Dhaka',
            'email' => 'student@test.com'
        ]);

        $result = Result::create([
            'student_id' => $student->id,
            'certificate_serial' => 'ABC1234567',
            'written' => 50,
            'practical' => 30,
            'viva' => 10,
            'total' => 90,
            'grade' => 'A'
        ]);

        $response = $this->get(route('result', ['roll' => '87654321']));

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Result')
            ->has('student.data', fn (Assert $page) => $page
                ->has('id')
                ->has('name')
                ->has('registration')
                ->has('roll')
                ->has('picture')
                ->missing('phone')
                ->missing('email')
                ->missing('nid_or_birth')
                ->missing('present_address')
                ->etc()
            )
        );
    }
}
