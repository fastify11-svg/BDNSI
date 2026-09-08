<?php
$source = __DIR__ . '/scratch_filesystems.php';
$dest = __DIR__ . '/../config/filesystems.php';
if (file_exists($source)) {
    copy($source, $dest);
    echo "Copied config to $dest<br>";
} else {
    echo "Source not found.<br>";
}
?>
