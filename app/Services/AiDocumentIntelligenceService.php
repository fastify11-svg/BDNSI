<?php

namespace App\Services;

use App\Models\StudentDocument;

class AiDocumentIntelligenceService
{
    public function analyzeDocument(StudentDocument $document)
    {
        // Load student data for mismatch detection
        $student = $document->student;
        if (!$student) {
            return $this->defaultResponse();
        }

        // Get file
        $filePath = storage_path('app/public/' . str_replace('public/', '', $document->file_path));
        if (!file_exists($filePath)) {
            return $this->defaultResponse();
        }

        $base64 = base64_encode(file_get_contents($filePath));
        $mimeType = mime_content_type($filePath);

        $apiKey = \App\Models\ConfigDictionary::get('api_settings', [])['gemini_api_key'] ?? config('services.gemini.key');
        if (empty($apiKey)) {
            return $this->defaultResponse();
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

        $prompt = "Analyze this document. The document belongs to a student.
Extract data and return ONLY a raw JSON object with these keys (no markdown, no backticks):
- 'confidence_score': integer 0-100 indicating readability and confidence.
- 'classification': string indicating the document type (e.g., 'NID', 'Birth Certificate', 'SSC Certificate', 'Unknown').
- 'extracted_data': object containing keys: 'Name', 'Father_Name', 'Mother_Name', 'DOB'. If missing, use null.";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                        [
                            'inlineData' => [
                                'mimeType' => $mimeType,
                                'data' => $base64,
                            ],
                        ],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.1,
                'responseMimeType' => 'application/json',
            ],
        ];

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(60)->post($url, $payload);

            if ($response->successful()) {
                $body = $response->json();
                $content = $body['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                
                // Clean markdown if present
                $content = str_replace(['```json', '```'], '', $content);
                $result = json_decode(trim($content), true);

                if (is_array($result)) {
                    $extracted = $result['extracted_data'] ?? [];
                    $mismatchDetails = [];
                    $mismatchDetected = false;

                    // Mismatch detection
                    if (!empty($extracted['Name']) && strtolower(trim($extracted['Name'])) !== strtolower(trim($student->name))) {
                        $mismatchDetected = true;
                        $mismatchDetails[] = "Name mismatch: Document says '{$extracted['Name']}', DB says '{$student->name}'";
                    }
                    if (!empty($extracted['Father_Name']) && strtolower(trim($extracted['Father_Name'])) !== strtolower(trim($student->father_name))) {
                        $mismatchDetected = true;
                        $mismatchDetails[] = "Father Name mismatch: Document says '{$extracted['Father_Name']}', DB says '{$student->father_name}'";
                    }
                    if (!empty($extracted['Mother_Name']) && strtolower(trim($extracted['Mother_Name'])) !== strtolower(trim($student->mother_name))) {
                        $mismatchDetected = true;
                        $mismatchDetails[] = "Mother Name mismatch: Document says '{$extracted['Mother_Name']}', DB says '{$student->mother_name}'";
                    }
                    // DOB format comparison can be tricky, basic string compare for now
                    if (!empty($extracted['DOB']) && $student->dob && date('Y-m-d', strtotime($extracted['DOB'])) !== $student->dob) {
                        $mismatchDetected = true;
                        $mismatchDetails[] = "DOB mismatch: Document says '{$extracted['DOB']}', DB says '{$student->dob}'";
                    }

                    return [
                        "ai_confidence_score" => $result['confidence_score'] ?? 50,
                        "ai_classification" => $result['classification'] ?? "Unknown",
                        "ai_mismatch_detected" => $mismatchDetected,
                        "ai_mismatch_details" => empty($mismatchDetails) ? null : implode("; ", $mismatchDetails),
                        "ai_extracted_data" => $extracted,
                        "ai_analyzed_at" => now()
                    ];
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gemini Document Intelligence Error: ' . $e->getMessage());
        }

        return $this->defaultResponse();
    }

    private function defaultResponse()
    {
        return [
            "ai_confidence_score" => 0,
            "ai_classification" => "Unknown",
            "ai_mismatch_detected" => false,
            "ai_mismatch_details" => "Analysis failed or skipped",
            "ai_extracted_data" => [],
            "ai_analyzed_at" => now()
        ];
    }
}
