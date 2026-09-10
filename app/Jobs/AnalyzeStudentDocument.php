<?php

namespace App\Jobs;

use App\Models\StudentDocument;
use App\Services\AiDocumentIntelligenceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AnalyzeStudentDocument implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $document;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(StudentDocument $document)
    {
        $this->document = $document;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(AiDocumentIntelligenceService $aiService)
    {
        $result = $aiService->analyzeDocument($this->document);

        $this->document->update([
            'ai_confidence_score' => $result['ai_confidence_score'],
            'ai_classification' => $result['ai_classification'],
            'ai_mismatch_detected' => $result['ai_mismatch_detected'],
            'ai_mismatch_details' => $result['ai_mismatch_details'],
            'ai_extracted_data' => $result['ai_extracted_data'],
            'ai_analyzed_at' => $result['ai_analyzed_at'],
        ]);
    }
}
