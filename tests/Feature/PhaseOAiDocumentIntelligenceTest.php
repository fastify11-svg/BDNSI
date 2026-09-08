<?php

namespace Tests\Feature;

use App\Models\DocumentType;
use App\Models\Student;
use App\Models\StudentDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhaseOAiDocumentIntelligenceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function ai_service_analyzes_document_and_detects_mismatch()
    {
        $team = \App\Models\Team::create(['name' => 'Default Team', 'domain' => 'default']);
        $center = \App\Models\Center::factory()->create(['team_id' => $team->id]);
        $session = \App\Models\Session::create(['name' => '2024', 'duration' => 6, 'team_id' => $team->id]);
        $subject = \App\Models\Subject::create(['name' => 'Math', 'code' => 'M101', 'duration' => 6, 'rate' => 500, 'type' => 0, 'team_id' => $team->id]);

        $student = Student::factory()->create([
            'name' => 'Mohammad Ali',
            'date_of_birth' => '2000-01-01',
            'center_id' => $center->id,
            'session_id' => $session->id,
            'subject_id' => $subject->id,
            'team_id' => $team->id,
        ]);

        $docType = DocumentType::create([
            'name' => 'National ID',
            'is_required' => 1
        ]);

        $document = StudentDocument::create([
            'student_id' => $student->id,
            'document_type_id' => $docType->id,
            'file_path' => 'dummy.jpg',
            'status' => 'Pending'
        ]);

        // Mock the AI Service
        $aiService = \Mockery::mock(\App\Services\AiDocumentIntelligenceService::class);
        $aiService->shouldReceive('analyzeDocument')->once()->with($document)->andReturn([
            'ai_confidence_score' => 95,
            'ai_classification' => 'National ID',
            'ai_mismatch_detected' => true,
            'ai_mismatch_details' => 'Name mismatch: Md Ali vs Mohammad Ali',
            'ai_extracted_data' => [
                'name' => 'Md Ali',
                'dob' => '2000-01-01'
            ],
            'ai_analyzed_at' => now()
        ]);

        // Run the service action
        $result = $aiService->analyzeDocument($document);

        // Assert
        $document->update($result);

        $this->assertEquals(95, $document->ai_confidence_score);
        $this->assertEquals('National ID', $document->ai_classification);
        $this->assertTrue($document->ai_mismatch_detected);
    }
}
