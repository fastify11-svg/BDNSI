<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class OptimizeExistingImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:optimize-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimizes all existing images in the public storage directory';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting image optimization process...');

        // Scan public storage recursively
        $files = Storage::disk('public')->allFiles();

        $optimizedCount = 0;
        $failedCount = 0;
        $skippedCount = 0;

        $bar = $this->output->createProgressBar(count($files));

        foreach ($files as $file) {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));

            // Skip non-optimizable files
            if (in_array($extension, ['svg', 'pdf', 'ico', 'gif', 'txt', 'csv', 'zip', 'json', 'sql'])) {
                $skippedCount++;
                $bar->advance();

                continue;
            }

            $absolutePath = Storage::disk('public')->path($file);

            try {
                // Determine mime type to be safe
                $mimeType = mime_content_type($absolutePath);
                if (! $mimeType || ! str_starts_with($mimeType, 'image/')) {
                    $skippedCount++;
                    $bar->advance();

                    continue;
                }

                $image = Image::make($absolutePath);

                // Original file size before compression
                $originalSize = filesize($absolutePath);

                // Resize if width > 1200
                $image->resize(1200, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                // Overwrite the file with 80% quality
                $image->save($absolutePath, 80);

                // Check new size
                clearstatcache();
                $newSize = filesize($absolutePath);

                if ($newSize < $originalSize) {
                    $optimizedCount++;
                } else {
                    $skippedCount++;
                }
            } catch (\Exception $e) {
                // If it's not a valid image or corrupted, just skip it
                $failedCount++;
                $this->error("Failed file {$absolutePath}: ".$e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();

        $this->newLine(2);
        $this->info('Optimization Complete!');
        $this->info("Successfully Optimized: {$optimizedCount} files.");
        $this->comment("Skipped (unsupported/already optimized): {$skippedCount} files.");
        if ($failedCount > 0) {
            $this->error("Failed to process: {$failedCount} files.");
        }
    }
}
