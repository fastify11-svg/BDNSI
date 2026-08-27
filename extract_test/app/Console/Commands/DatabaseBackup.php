<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class DatabaseBackup extends Command
{
    protected $signature = 'app:backup';

    protected $description = 'Take daily database backup';

    public function handle()
    {

        $filename = 'backup-'.now()->format('Y-m-d_H-i-s').'.sql';
        $path = storage_path("app/backups/{$filename}");
        $escapedPath = escapeshellarg($path);

        $db = config('database.connections.mysql');

        if (! empty($db['password'])) {
            $command = "mysqldump -u{$db['username']} -p\"{$db['password']}\" {$db['database']} > {$escapedPath}";
        } else {
            $command = "mysqldump -u{$db['username']} {$db['database']} > {$escapedPath}";
        }

        $result = null;
        $output = null;
        exec($command, $output, $result);

        if ($result === 0) {
            $this->info("Backup successful: {$filename}");

            $backupDir = storage_path('app/backups');
            $files = collect(File::files($backupDir))
                ->filter(fn ($file) => $file->getExtension() === 'sql')
                ->sortBy(fn ($file) => $file->getMTime())

                ->values();

            if ($files->count() > 10) {
                $filesToDelete = $files->take($files->count() - 10);

                foreach ($filesToDelete as $oldFile) {
                    File::delete($oldFile->getPathname());
                    $this->info('Deleted old backup: '.$oldFile->getFilename());
                }
            }

        } else {
            $this->error('Backup failed.');
        }
    }
}
