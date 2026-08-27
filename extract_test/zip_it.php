<?php
$zipFile = 'deploy.zip';
if(file_exists($zipFile)) {
    unlink($zipFile);
}

$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Failed to create zip file.\n");
}

$iterator = new RecursiveIteratorIterator(
    new RecursiveCallbackFilterIterator(
        new RecursiveDirectoryIterator(__DIR__, RecursiveDirectoryIterator::SKIP_DOTS),
        function ($current, $key, $iterator) {
            $excludeDirs = ['node_modules', '.git', '.agents', 'storage/framework/cache/data', 'storage/framework/views', 'storage/framework/sessions', 'storage/logs', 'storage_backup', 'public/storage_backup', 'playwright-report', 'test-results'];
            if ($current->isDir()) {
                foreach ($excludeDirs as $exclude) {
                    if (str_ends_with(str_replace('\\', '/', $current->getPathname()), '/' . $exclude) || 
                        $current->getFilename() === $exclude) {
                        return false;
                    }
                }
            }
            
            $excludeFiles = ['.env', 'validFiles.json', 'file_list.txt', 'file_list2.txt', 'build_tar.mjs', 'full_auto_deploy.mjs', 'fix_live_env.js', 'zip_it.cjs', 'zip_it.mjs', 'setup.log', 'playwright-output.log', 'zip_it.php'];
            if ($current->isFile()) {
                $filename = $current->getFilename();
                if (in_array($filename, $excludeFiles)) return false;
                if (str_starts_with($filename, 'deploy') && (str_ends_with($filename, '.zip') || str_ends_with($filename, '.tar.gz'))) return false;
                if ($filename === 'latest_bdnsi_working_db.sql') return false;
            }
            return true;
        }
    )
);

$count = 0;
foreach ($iterator as $file) {
    if (!$file->isDir()) {
        $realPath = $file->getRealPath();
        $relativePath = substr($realPath, strlen(__DIR__) + 1);
        $relativePath = str_replace('\\', '/', $relativePath);
        $zip->addFile($realPath, $relativePath);
        $count++;
    }
}
$zip->addFile(__DIR__ . '/.env.staging', '.env');
$count++;
$zip->close();
echo "Added $count files to $zipFile\n";
