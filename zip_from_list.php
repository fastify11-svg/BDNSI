<?php
$zipFile = 'deploy.zip';
if(file_exists($zipFile)) {
    unlink($zipFile);
}

$zip = new ZipArchive();
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
    die("Failed to create zip file.\n");
}

$files = file('valid_files.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$count = 0;
foreach($files as $file) {
    if(file_exists($file)) {
        $zip->addFile($file, $file);
        $count++;
    }
}
if(file_exists('.env.staging')) {
    $zip->addFile('.env.staging', '.env');
    $count++;
}
$zip->close();
echo "Added $count files to $zipFile\n";
