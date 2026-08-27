<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\Result;
use App\Models\Session;
use App\Models\Student;
use App\Models\Subject;
use App\Enums\StudentStatus;
use App\Enums\CenterStatus;
use App\Services\CertificateGenerationService;
use App\Jobs\GenerateCertificateAssets;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;
use Illuminate\Database\QueryException;

class PhaseJCertificateConcurrencyTest extends TestCase
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
        ]);

        $result = Result::create([
            'student_id' => $student->id,
            'written' => 50,
            'practical' => 30,
            'viva' => 10,
            'total' => 90,
            'grade' => 'A'
        ]);

        return $result;
    }

    public function test_certificate_generation_is_idempotent()
    {
        $result = $this->createValidStudent();
        
        $service = new CertificateGenerationService();
        $service->generateCertificateSerial($result);
        
        $firstSerial = $result->certificate_serial;
        $this->assertNotNull($firstSerial);

        // Call again
        $service->generateCertificateSerial($result);
        $this->assertEquals($firstSerial, $result->fresh()->certificate_serial);
    }

    public function test_certificate_serial_enforces_unique_constraint()
    {
        $result1 = $this->createValidStudent();
        $result2 = $this->createValidStudent();
        
        $result1->certificate_serial = 'TESTDUPE12';
        $result1->save();

        $this->expectException(QueryException::class);
        $result2->certificate_serial = 'TESTDUPE12';
        $result2->save();
    }

    public function test_job_dispatch_is_safe_for_duplicates()
    {
        Queue::fake();

        $result = $this->createValidStudent();
        
        GenerateCertificateAssets::dispatch($result);
        GenerateCertificateAssets::dispatch($result);

        Queue::assertPushed(GenerateCertificateAssets::class, 1);
        
        // Execute first job
        $job = new GenerateCertificateAssets($result);
        $job->handle(new CertificateGenerationService());
        
        $firstSerial = $result->fresh()->certificate_serial;
        $this->assertNotNull($firstSerial);
        
        // Execute second job (duplicate dispatch)
        $job2 = new GenerateCertificateAssets($result);
        $job2->handle(new CertificateGenerationService());
        
        $this->assertEquals($firstSerial, $result->fresh()->certificate_serial);
    }
}
