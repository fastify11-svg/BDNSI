<?php

namespace Tests\Feature;

use App\Models\DocumentType;
use App\Models\Student;
use App\Models\StudentDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PhaseOAiDocumentIntelligenceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
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

        // Create a fake dummy image in storage
        \Illuminate\Support\Facades\Storage::fake('public');
        \Illuminate\Support\Facades\Storage::disk('public')->put('dummy.jpg', 'fake-image-content');

        // Fake the Gemini API response
        \Illuminate\Support\Facades\Http::fake([
            'generativelanguage.googleapis.com/*' => \Illuminate\Support\Facades\Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'confidence_score' => 95,
                                        'classification' => 'National ID',
                                        'extracted_data' => [
                                            'Name' => 'Md Ali',
                                            'DOB' => '2000-01-01'
                                        ]
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        // Mock config so the service doesn't bail out
        config(['services.gemini.key' => 'fake-api-key']);

        // Actually run the service
        $aiService = new \App\Services\AiDocumentIntelligenceService();
        $result = $aiService->analyzeDocument($document);

        $this->assertEquals(95, $result['ai_confidence_score']);
        $this->assertEquals('National ID', $result['ai_classification']);
        $this->assertTrue($result['ai_mismatch_detected']);
        $this->assertStringContainsString('Name mismatch', $result['ai_mismatch_details']);
        $this->assertEquals('Md Ali', $result['ai_extracted_data']['Name']);

        // Test the Job
        \App\Jobs\AnalyzeStudentDocument::dispatchSync($document);

        $document->refresh();
        $this->assertEquals(95, $document->ai_confidence_score);
        $this->assertTrue($document->ai_mismatch_detected);
    }
}
