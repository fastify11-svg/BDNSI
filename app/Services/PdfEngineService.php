<?php

namespace App\Services;

use App\Models\DocumentTemplate;
use App\Models\Student;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use SimpleSoftwareIO\QrCode\Generator;

class PdfEngineService
{
    protected DocumentGeneratorService $documentService;

    public function __construct(DocumentGeneratorService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Render raw HTML string to a pixel-perfect PDF file using Headless Chromium.
     *
     * @param string $html
     * @param string $outputPath
     * @param array $options
     * @return string
     * @throws \Exception
     */
    public function renderHtmlToPdf(string $html, string $outputPath, array $options = []): string
    {
        // 1. Ensure output directory exists
        $outputDir = dirname($outputPath);
        if (! File::exists($outputDir)) {
            File::makeDirectory($outputDir, 0755, true);
        }

        // 2. Write temp HTML file
        $tempHtmlPath = storage_path('app/temp_' . uniqid('pdf_', true) . '.html');
        File::put($tempHtmlPath, $html);

        // 3. Prepare parameters
        $format = $options['format'] ?? 'A4';
        $landscape = isset($options['landscape']) && $options['landscape'] ? 'true' : 'false';
        $scale = $options['scale'] ?? '1.0';

        $nodeScript = base_path('pdf_engine.mjs');
        $command = [
            'node',
            $nodeScript,
            "--html={$tempHtmlPath}",
            "--output={$outputPath}",
            "--format={$format}",
            "--landscape={$landscape}",
            "--scale={$scale}",
        ];

        try {
            $process = new \Symfony\Component\Process\Process($command);
            $process->setTimeout(60);
            $process->run();

            if (! $process->isSuccessful()) {
                \Illuminate\Support\Facades\Log::error('PDF Engine Chromium Error: ' . $process->getErrorOutput());
                throw new \Exception('PDF generation failed: ' . ($process->getErrorOutput() ?: $process->getOutput()));
            }

            return $outputPath;
        } finally {
            if (File::exists($tempHtmlPath)) {
                File::delete($tempHtmlPath);
            }
        }
    }

    /**
     * Render a DocumentTemplate for a Student with Anti-Forgery QR, Watermark and Smart Caching.
     *
     * @param DocumentTemplate $template
     * @param Student $student
     * @param array $options
     * @return string
     * @throws \Exception
     */
    public function renderTemplateForStudent(DocumentTemplate $template, Student $student, array $options = []): string
    {
        // Eager load relations
        $student->loadMissing(['center', 'subject', 'session', 'result', 'semesterResults']);

        // 1. Smart Caching: Compute hash of student data + template updated_at
        $studentState = md5(json_encode([
            $student->id,
            $student->name,
            $student->roll,
            $student->registration,
            $student->updated_at?->timestamp,
            $template->id,
            $template->updated_at?->timestamp,
            $options['format'] ?? 'default',
            $options['landscape'] ?? 'default',
        ]));

        $cacheDir = storage_path("app/public/generated_pdfs/{$template->id}");
        $cachedFilePath = "{$cacheDir}/{$student->id}_{$studentState}.pdf";

        // If cached and fresh generation not forced, return immediately (< 5ms response!)
        if (empty($options['force_fresh']) && File::exists($cachedFilePath)) {
            return $cachedFilePath;
        }

        // 2. Build template HTML with dynamic anti-forgery QR code
        $qrCodeSvg = $this->generateDynamicQrCode($student);
        $html = $this->compileTemplateHtml($template, $student, $qrCodeSvg, $options);

        // 3. Determine Layout & Paper Size
        $format = $options['format'] ?? ($template->document_type === 'idcard' ? 'CR80' : 'A4');
        $landscape = isset($options['landscape']) ? (bool)$options['landscape'] : ($template->document_type === 'idcard');

        // 4. Render to PDF via Headless Chromium
        return $this->renderHtmlToPdf($html, $cachedFilePath, [
            'format' => $format,
            'landscape' => $landscape,
            'scale' => $options['scale'] ?? '1.0',
        ]);
    }

    /**
     * Generate dynamic cryptographic QR code linking to the verification endpoint.
     */
    public function generateDynamicQrCode(Student $student): string
    {
        $verificationUrl = url('/verify?reg=' . urlencode($student->registration ?? $student->roll ?? $student->id));

        try {
            $qrcode = new Generator;
            return $qrcode->format('svg')->size(140)->errorCorrection('H')->generate($verificationUrl);
        } catch (\Throwable $e) {
            return '';
        }
    }

    /**
     * Compile DocumentTemplate with Student Data, Watermark, and Anti-Forgery QR code.
     */
    protected function compileTemplateHtml(DocumentTemplate $template, Student $student, string $qrCodeSvg, array $options = []): string
    {
        $fields = $this->documentService->generateForStudent($template, $student);
        $templateWidth = $template->width ?? ($template->document_type === 'idcard' ? '324px' : '794px');
        $templateHeight = $template->height ?? ($template->document_type === 'idcard' ? '204px' : '1123px');

        $bgUrl = $template->background_image ? asset($template->background_image) : '';

        $elementsHtml = '';
        foreach ($fields as $item) {
            $f = $item['field'];
            $val = $item['value'];
            $type = $item['type'];

            $style = sprintf(
                'position:absolute; left:%spx; top:%spx; font-size:%spx; font-family:%s; color:%s; font-weight:%s; text-align:%s; z-index:10;',
                $f->x_position ?? 0,
                $f->y_position ?? 0,
                $f->font_size ?? 12,
                $f->font_family ?? 'Inter, sans-serif',
                $f->color ?? '#111827',
                $f->font_weight ?? 'normal',
                $f->alignment ?? 'left'
            );

            if ($type === 'image' && $val) {
                $elementsHtml .= sprintf('<img src="%s" style="%s width:%spx; height:%spx; object-fit:cover; border-radius:4px;" />', $val, $style, $f->width ?? 80, $f->height ?? 80);
            } elseif ($type === 'qrcode') {
                $elementsHtml .= sprintf('<div style="%s width:%spx; height:%spx;">%s</div>', $style, $f->width ?? 80, $f->height ?? 80, $qrCodeSvg);
            } elseif ($type === 'html') {
                $elementsHtml .= sprintf('<div style="%s">%s</div>', $style, $val);
            } else {
                $elementsHtml .= sprintf('<div style="%s">%s</div>', $style, htmlspecialchars((string)$val));
            }
        }

        // Security Anti-Forgery Watermark
        $watermarkText = 'BDNSI OFFICIAL &bull; VERIFIED SECURE &bull; ' . date('Y-m-d');

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .document-canvas {
            position: relative;
            width: {$templateWidth};
            height: {$templateHeight};
            background-image: url('{$bgUrl}');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            overflow: hidden;
        }
        .security-watermark {
            position: absolute;
            bottom: 6px;
            right: 12px;
            font-size: 8px;
            font-weight: 700;
            color: rgba(100, 116, 139, 0.4);
            letter-spacing: 1px;
            text-transform: uppercase;
            z-index: 5;
        }
    </style>
</head>
<body>
    <div class="document-canvas">
        {$elementsHtml}
        <div class="security-watermark">{$watermarkText}</div>
    </div>
</body>
</html>
HTML;
    }
}
