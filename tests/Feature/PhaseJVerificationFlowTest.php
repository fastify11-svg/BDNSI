<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Result;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Enums\StudentStatus;
use App\Enums\CenterStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhaseJVerificationFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function createValidStudent()
    {
        $center = Center::factory()->create(['status' => CenterStatus::Approved]);
        $session = Session::create(['name' => '2026', 'status' => 1]);
        $subject = Subject::create(['name' => 'Computer Science', 'code' => 'CS101', 'status' => 1]);
        
        $student = Student::factory()->create([
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'status' => StudentStatus::Approved,
            'registration' => '12345678',
            'roll' => '87654321',
        ]);

        $result = Result::create([
            'student_id' => $student->id,
            'certificate_serial' => 'VALIDSERIAL123',
            'written' => 50,
            'practical' => 30,
            'viva' => 10,
            'total' => 90,
            'grade' => 'A'
        ]);

        return $student;
    }

    public function test_guest_can_access_verification_page()
    {
        $response = $this->get(route('verify.index'));
        $response->assertStatus(200);
    }

    public function test_invalid_registration_returns_error()
    {
        $this->createValidStudent();

        $response = $this->post(route('verify.check'), [
            'registration' => 'INVALID123'
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['error' => 'No valid verified certificate found for this ID/Serial.']);
    }

    public function test_valid_registration_with_invalid_serial_returns_error()
    {
        $this->createValidStudent();

        $response = $this->post(route('verify.check'), [
            'registration' => '12345678',
            'certificate_serial' => 'WRONGSERIAL'
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['error' => 'No valid verified certificate found for this ID/Serial.']);
    }

    public function test_unapproved_student_cannot_be_verified()
    {
        $student = $this->createValidStudent();
        $student->update(['status' => StudentStatus::Pending]);

        $response = $this->post(route('verify.check'), [
            'registration' => '12345678'
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['error' => 'No valid verified certificate found for this ID/Serial.']);
    }

    public function test_student_without_result_cannot_be_verified()
    {
        $student = $this->createValidStudent();
        $student->result()->delete();

        $response = $this->post(route('verify.check'), [
            'registration' => '12345678'
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['error' => 'No valid verified certificate found for this ID/Serial.']);
    }

    public function test_audit_log_created_on_verification()
    {
        $this->createValidStudent();
        
        $this->assertDatabaseMissing('audit_logs', ['event' => 'CERTIFICATE_VERIFIED']);

        $response = $this->post(route('verify.check'), [
            'registration' => '12345678'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('audit_logs', [
            'event' => 'CERTIFICATE_VERIFIED'
        ]);
    }
}
