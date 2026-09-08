<?php
$filesystemsPath = __DIR__ . '/../config/filesystems.php';
if (file_exists($filesystemsPath)) {
    echo "=== config/filesystems.php ===\n";
    echo file_get_contents($filesystemsPath);
} else {
    echo "filesystems.php not found.\n";
}
echo "\n=== env ===\n";
echo "FILESYSTEM_DRIVER: " . env('FILESYSTEM_DRIVER') . "\n";
echo "FILESYSTEM_CLOUD: " . env('FILESYSTEM_CLOUD') . "\n";
?>
