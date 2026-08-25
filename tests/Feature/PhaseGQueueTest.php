<?php

namespace Tests\Feature;

use App\Jobs\GenerateCertificateAssets;
use App\Models\Center;
use App\Models\Student;
use App\Models\Result;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PhaseGQueueTest extends TestCase
{
    use RefreshDatabase;

    public function test_generate_certificate_assets_job_dispatches_and_executes()
    {
        $center = Center::factory()->create(['id' => 1, 'code' => 'C-001']);
        $sessionId = \Illuminate\Support\Facades\DB::table('sessions')->insertGetId(['name' => '2026']);
        $subjectId = \Illuminate\Support\Facades\DB::table('subjects')->insertGetId(['name' => 'Math']);

        $student = Student::factory()->create([
            'center_id' => $center->id, 
            'registration' => '123123',
            'session_id' => $sessionId,
            'subject_id' => $subjectId
        ]);
        $result = Result::create([
            'student_id' => $student->id,
            'written' => 40,
            'practical' => 40,
            'viva' => 20
        ]);

        $this->assertNull($result->certificate_serial);

        $job = new GenerateCertificateAssets($result);
        $job->handle(new \App\Services\CertificateGenerationService());

        $result->refresh();
        $this->assertNotNull($result->certificate_serial);
    }
}
