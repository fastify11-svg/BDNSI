<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateBulkDocumentsJob;
use App\Models\DocumentTemplate;
use App\Models\Student;
use App\Services\PdfEngineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BulkDocumentController extends Controller
{
    /**
     * Dispatch an asynchronous bulk document generation job.
     */
    public function bulkGenerate(Request $request): JsonResponse
    {
        $request->validate([
            'template_id' => 'required|exists:document_templates,id',
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'integer',
            'format' => 'nullable|string|in:A4,A3,A5,Letter,Legal,CR80',
            'landscape' => 'nullable|boolean',
            'scale' => 'nullable|numeric',
        ]);

        $batchJobId = Str::uuid()->toString();

        $options = [
            'format' => $request->input('format', 'A4'),
            'landscape' => $request->boolean('landscape', false),
            'scale' => $request->input('scale', '1.0'),
            'force_fresh' => $request->boolean('force_fresh', false),
        ];

        // Ensure user is authorized for these students (Tenant Isolation)
        $user = auth()->guard('web')->user();
        if ($user && $user->center_id) {
            $unauthorizedCount = \App\Models\Student::withoutGlobalScopes()
                ->whereIn('id', $request->student_ids)
                ->where('center_id', '!=', $user->center_id)
                ->count();
            if ($unauthorizedCount > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. You can only generate documents for students belonging to your center.',
                ], 403);
            }
        }

        // Store initial queue status in cache
        Cache::put("bulk_pdf_{$batchJobId}", [
            'status' => 'queued',
            'total' => count($request->student_ids),
            'completed' => 0,
            'percentage' => 0,
        ], 3600);

        GenerateBulkDocumentsJob::dispatch(
            (int)$request->template_id,
            $request->student_ids,
            $options,
            $batchJobId
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Bulk PDF document generation dispatched to background queue.',
            'job_id' => $batchJobId,
        ]);
    }

    /**
     * Real-time Server-Sent Events (SSE) progress stream for bulk PDF generation.
     */
    public function bulkProgress(string $jobId)
    {
        return response()->stream(function () use ($jobId) {
            while (true) {
                if (connection_aborted()) {
                    break;
                }

                $progress = Cache::get("bulk_pdf_{$jobId}");

                if (! $progress) {
                    echo "event: close\n";
                    echo "data: " . json_encode(['status' => 'not_found', 'message' => 'Job expired or not found']) . "\n\n";
                    ob_flush();
                    flush();
                    break;
                }

                echo "data: " . json_encode($progress) . "\n\n";
                ob_flush();
                flush();

                if ($progress['status'] === 'completed' || $progress['status'] === 'failed') {
                    break;
                }

                sleep(1);
            }
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache',
            'Connection'        => 'keep-alive',
            'X-Accel-Buffering' => 'no', // Prevents Nginx from buffering the stream
        ]);
    }

    /**
     * Download the compiled .zip archive of batch documents.
     */
    public function bulkDownload(string $filename): BinaryFileResponse|JsonResponse
    {
        // Sanitize filename
        $safeFilename = basename($filename);
        $filePath = storage_path("app/public/bulk_archives/{$safeFilename}");

        if (! File::exists($filePath)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Archive file not found or expired.',
            ], 404);
        }

        return response()->download($filePath, $safeFilename, [
            'Content-Type' => 'application/zip',
        ]);
    }

    /**
     * Render and stream a single PDF document in real-time.
     */
    public function renderSingle(Request $request, int $templateId, int $studentId, PdfEngineService $pdfService): BinaryFileResponse|JsonResponse
    {
        $template = DocumentTemplate::with('fields')->findOrFail($templateId);
        $student = Student::withoutGlobalScopes()
            ->with(['center', 'subject', 'session', 'result', 'semesterResults'])
            ->findOrFail($studentId);

        $user = auth()->guard('web')->user();
        if ($user && $user->center_id && $student->center_id !== $user->center_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. You can only render documents for students belonging to your center.',
            ], 403);
        }

        $options = [
            'format' => $request->query('format', $template->document_type === 'idcard' ? 'CR80' : 'A4'),
            'landscape' => $request->has('landscape') ? filter_var($request->query('landscape'), FILTER_VALIDATE_BOOLEAN) : ($template->document_type === 'idcard'),
            'scale' => $request->query('scale', '1.0'),
            'force_fresh' => $request->has('fresh'),
        ];

        try {
            $pdfPath = $pdfService->renderTemplateForStudent($template, $student, $options);

            $downloadName = sprintf('%s_%s_%s.pdf', $template->document_type ?? 'document', $student->roll ?? $student->id, preg_replace('/[^A-Za-z0-9]/', '_', $student->name));

            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $downloadName . '"',
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('BulkDocumentController renderSingle failed', [
                'template_id' => $templateId,
                'student_id'  => $studentId,
                'error'       => $e->getMessage(),
            ]);

            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to render PDF. Please try again or contact support.',
            ], 500);
        }
    }
}
