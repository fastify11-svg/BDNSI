<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$zipFile = '../deploy.zip';
echo "Check file: $zipFile<br>\n";
echo "Exists: " . (file_exists($zipFile) ? 'YES' : 'NO') . "<br>\n";
if (file_exists($zipFile)) {
    echo "Size: " . number_format(filesize($zipFile)) . " bytes<br>\n";
}
echo "class ZipArchive: " . (class_exists('ZipArchive') ? 'YES' : 'NO') . "<br>\n";
echo "cwd: " . getcwd() . "<br>\n";
echo "dir listing of parent:<br><pre>\n";
$files = scandir('..');
foreach($files as $f) {
    echo $f . "\n";
}
echo "</pre>\n";
