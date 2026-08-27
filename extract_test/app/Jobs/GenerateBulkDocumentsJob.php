<?php

namespace App\Jobs;

use App\Models\DocumentTemplate;
use App\Models\Student;
use App\Services\PdfEngineService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use ZipArchive;

class GenerateBulkDocumentsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600;

    protected int $templateId;
    protected array $studentIds;
    protected array $options;
    protected string $batchJobId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $templateId, array $studentIds, array $options, string $batchJobId)
    {
        $this->templateId = $templateId;
        $this->studentIds = $studentIds;
        $this->options = $options;
        $this->batchJobId = $batchJobId;
    }

    /**
     * Execute the job.
     */
    public function handle(PdfEngineService $pdfService): void
    {
        $template = DocumentTemplate::with('fields')->find($this->templateId);
        if (! $template) {
            Cache::put("bulk_pdf_{$this->batchJobId}", [
                'status' => 'failed',
                'message' => 'Document template not found.',
                'percentage' => 0,
            ], 3600);
            return;
        }

        $total = count($this->studentIds);
        $completed = 0;
        $generatedPdfFiles = [];

        Cache::put("bulk_pdf_{$this->batchJobId}", [
            'status' => 'processing',
            'total' => $total,
            'completed' => 0,
            'percentage' => 0,
        ], 3600);

        $students = Student::withoutGlobalScopes()
            ->with(['center', 'subject', 'session', 'result'])
            ->whereIn('id', $this->studentIds)
            ->get();

        foreach ($students as $student) {
            try {
                $pdfPath = $pdfService->renderTemplateForStudent($template, $student, $this->options);
                $generatedPdfFiles[] = [
                    'path' => $pdfPath,
                    'name' => sprintf('%s_%s_%s.pdf', $template->document_type ?? 'doc', $student->roll ?? $student->id, preg_replace('/[^A-Za-z0-9]/', '_', $student->name)),
                ];
            } catch (\Throwable $e) {
                Log::error("Bulk PDF Generation Error for Student #{$student->id}: " . $e->getMessage());
            }

            $completed++;
            $percentage = $total > 0 ? round(($completed / $total) * 100) : 100;

            Cache::put("bulk_pdf_{$this->batchJobId}", [
                'status' => 'processing',
                'total' => $total,
                'completed' => $completed,
                'percentage' => $percentage,
            ], 3600);
        }

        // Package all generated PDFs into a .zip archive
        $archiveDir = storage_path('app/public/bulk_archives');
        if (! File::exists($archiveDir)) {
            File::makeDirectory($archiveDir, 0755, true);
        }

        $zipFilename = "batch_documents_{$this->batchJobId}.zip";
        $zipFilePath = "{$archiveDir}/{$zipFilename}";

        $zip = new ZipArchive();
        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            foreach ($generatedPdfFiles as $file) {
                if (File::exists($file['path'])) {
                    $zip->addFile($file['path'], $file['name']);
                }
            }
            $zip->close();
        }

        Cache::put("bulk_pdf_{$this->batchJobId}", [
            'status' => 'completed',
            'total' => $total,
            'completed' => $completed,
            'percentage' => 100,
            'zip_file' => $zipFilename,
            'zip_url' => url("admin/documents/bulk-download/{$zipFilename}"),
        ], 7200);
    }
}
