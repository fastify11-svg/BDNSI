<?php
$files = [
    'scratch_read_config.php',
    'scratch_filesystems.php',
    'scratch_move_filesystems.php',
    'scratch_clear_config.php',
    'scratch_cleanup2.php'
];

foreach ($files as $file) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        unlink($path);
        echo "Deleted $file\n";
    }
}
echo "Cleanup complete.\n";
?>
