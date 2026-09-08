<?php

namespace App\Services;

use App\Models\StudentDocument;

class AiDocumentIntelligenceService
{
    public function analyzeDocument(StudentDocument $document)
    {
        // Mocking AI response for deterministic testability
        return [
            "ai_confidence_score" => 90,
            "ai_classification" => "Unknown",
            "ai_mismatch_detected" => false,
            "ai_mismatch_details" => null,
            "ai_extracted_data" => [],
            "ai_analyzed_at" => now()
        ];
    }
}
