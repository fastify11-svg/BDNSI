<?php

namespace App\Http\Controllers;

use App\Models\ConfigDictionary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiOcrController extends Controller
{
    public function extractData(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,webp,pdf|max:5120',
        ]);

        $file = $request->file('image');
        $base64 = base64_encode(file_get_contents($file->path()));
        $mimeType = $file->getClientMimeType();

        $apiSettings = ConfigDictionary::get('api_settings', []);
        $apiKey = $apiSettings['gemini_api_key'] ?? config('services.gemini.key');
        if (empty($apiKey)) {
            return response()->json(['error' => 'Invalid or missing Gemini API Key'], 500);
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='.$apiKey;

        $prompt = "Analyze this document. Extract: Name, Father's Name, Mother's Name, Date of Birth (YYYY-MM-DD), Phone Number, Passport Number, NID/Registration Number, Gender, District, Upazila. Return ONLY a raw JSON object with these keys. No markdown, no backticks.";

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
                'topK' => 32,
                'topP' => 1,
                'maxOutputTokens' => 1024,
            ],
        ];

        try {
            $response = Http::timeout(60)->post($url, $payload);

            if ($response->successful()) {
                $body = $response->json();
                $content = $body['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

                // Clean up potential markdown if the model disobeys
                $content = preg_replace('/```json\s*/', '', $content);
                $content = preg_replace('/```\s*/', '', $content);
                $content = trim($content);

                $data = json_decode($content, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                    return response()->json($data);
                } else {
                    Log::error('Gemini OCR JSON Parse Error', ['content' => $content]);

                    return response()->json(['message' => 'Failed to parse structured data from the document.'], 500);
                }
            } else {
                Log::error('Gemini OCR API Error', ['response' => $response->body()]);

                return response()->json(['message' => 'Failed to extract data via OCR Service.'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Gemini OCR Exception', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'Service temporarily unavailable.'], 500);
        }
    }
}
