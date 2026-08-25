<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Student;
use App\Models\Result;
use App\Models\User;
use App\Models\Admin;
use App\Services\CertificateGenerationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhaseGCertificateVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->center = Center::factory()->create(['id' => 1, 'name' => 'Center A', 'code' => 'C-001']);
        
        $sessionId = \Illuminate\Support\Facades\DB::table('sessions')->insertGetId(['name' => '2026']);
        $subjectId = \Illuminate\Support\Facades\DB::table('subjects')->insertGetId(['name' => 'Math']);
        
        $this->student = Student::factory()->create([
            'center_id' => $this->center->id, 
            'registration' => '999999',
            'status' => \App\Enums\StudentStatus::Approved,
            'session_id' => $sessionId,
            'subject_id' => $subjectId
        ]);
        
        $this->result = Result::create([
            'student_id' => $this->student->id,
            'written' => 40,
            'practical' => 40,
            'viva' => 20
        ]);
    }

    public function test_certificate_serial_is_generated_idempotently()
    {
        $service = new CertificateGenerationService();
        
        $this->assertNull($this->result->certificate_serial);
        
        $result = $service->generateCertificateSerial($this->result);
        $serial1 = $result->certificate_serial;
        $this->assertNotNull($serial1);
        
        // Calling again should return the exact same serial (idempotent)
        $result2 = $service->generateCertificateSerial($this->result);
        $this->assertEquals($serial1, $result2->certificate_serial);
    }

    public function test_public_verification_fails_with_invalid_serial()
    {
        $response = $this->post(route('verify.check'), [
            'registration' => '999999',
            'certificate_serial' => 'INVALID_SERIAL'
        ]);

        $response->assertSessionHasErrors(['error']);
    }

    public function test_public_verification_succeeds_with_valid_serial()
    {
        $service = new CertificateGenerationService();
        $this->result = $service->generateCertificateSerial($this->result);
        
        $response = $this->post(route('verify.check'), [
            'registration' => '999999',
            'certificate_serial' => $this->result->certificate_serial
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertOk();
    }
}
