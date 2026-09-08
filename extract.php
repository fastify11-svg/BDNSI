<?php
// Vendor extraction — writes output to log file since display_errors may be Off
$log = __DIR__ . '/extract_log.txt';
$out = [];

$out[] = "=== EXTRACT START " . date('Y-m-d H:i:s') . " ===";
$out[] = "PHP: " . PHP_VERSION;
$out[] = "DIR: " . __DIR__;
$zip_path = __DIR__ . '/../vendor.zip';
$out[] = "ZIP: " . $zip_path;
$out[] = "ZIP exists: " . (file_exists($zip_path) ? 'YES (' . filesize($zip_path) . ' bytes)' : 'NO');
$out[] = "ZipArchive: " . (class_exists('ZipArchive') ? 'YES' : 'NO');

file_put_contents($log, implode("\n", $out) . "\n");

if (!file_exists($zip_path)) {
    file_put_contents($log, "FATAL: vendor.zip not found\n", FILE_APPEND);
    http_response_code(200);
    echo implode("\n", $out) . "\nFATAL: vendor.zip not found";
    exit;
}

$zip = new ZipArchive();
$res = $zip->open($zip_path);
if ($res !== TRUE) {
    file_put_contents($log, "FATAL: Cannot open zip code=$res\n", FILE_APPEND);
    echo "FATAL: Cannot open zip code=$res";
    exit;
}

file_put_contents($log, "Zip opened OK, numFiles=" . $zip->numFiles . "\n", FILE_APPEND);
$dest = realpath(__DIR__ . '/..');
$ok = $zip->extractTo($dest);
$zip->close();

file_put_contents($log, "Extract result: " . ($ok ? 'OK' : 'FAILED') . " to $dest\n", FILE_APPEND);

http_response_code(200);
header('Content-Type: text/plain');
echo implode("\n", $out) . "\n";
echo "Zip numFiles: " . ($zip->numFiles ?? 'N/A') . "\n";
echo "Extract to: $dest\n";
echo "Result: " . ($ok ? 'SUCCESS' : 'FAILED') . "\n";
if ($ok) {
    @unlink($zip_path);
    echo "Cleanup: vendor.zip removed\n";
}
file_put_contents($log, "Done.\n", FILE_APPEND);
