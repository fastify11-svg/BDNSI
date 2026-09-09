<?php

namespace Tests\Feature;

use App\Models\Center;
use App\Models\DocumentType;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Notifications\DocumentApproved;
use App\Notifications\DocumentRejected;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PhaseGNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_document_approval_sends_notification()
    {
        Notification::fake();

        $center = Center::factory()->create(['id' => 1, 'code' => 'C-001']);
        $sessionId = \App\Models\Session::create(['name' => '2026'])->id;
        $subjectId = \Illuminate\Support\Facades\DB::table('subjects')->insertGetId(['name' => 'Math']);
        $student = Student::factory()->create(['center_id' => $center->id, 'session_id' => $sessionId, 'subject_id' => $subjectId]);
        $docType = DocumentType::create(['name' => 'NID']);
        
        $document = StudentDocument::create([
            'student_id' => $student->id,
            'document_type_id' => $docType->id,
            'file_path' => 'fake',
            'status' => 'Pending'
        ]);

        $service = new \App\Services\DocumentVerificationService();
        $service->approveDocument($document);

        Notification::assertSentTo(
            $center,
            DocumentApproved::class
        );
    }

    public function test_document_rejection_sends_notification()
    {
        Notification::fake();

        $center = Center::factory()->create(['id' => 1, 'code' => 'C-002']);
        $sessionId = \App\Models\Session::create(['name' => '2026'])->id;
        $subjectId = \Illuminate\Support\Facades\DB::table('subjects')->insertGetId(['name' => 'Math']);
        $student = Student::factory()->create(['center_id' => $center->id, 'session_id' => $sessionId, 'subject_id' => $subjectId]);
        $docType = DocumentType::create(['name' => 'NID']);
        
        $document = StudentDocument::create([
            'student_id' => $student->id,
            'document_type_id' => $docType->id,
            'file_path' => 'fake',
            'status' => 'Pending'
        ]);

        $service = new \App\Services\DocumentVerificationService();
        $service->rejectDocument($document, 'Fake reason');

        Notification::assertSentTo(
            $center,
            DocumentRejected::class,
            function ($notification, $channels) use ($center) {
                return str_contains($notification->toArray($center)['message'], 'Fake reason');
            }
        );
    }
}
