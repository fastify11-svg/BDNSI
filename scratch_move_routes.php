<?php
$source = __DIR__ . '/scratch_admin.php';
$dest = __DIR__ . '/../routes/admin.php';
if (file_exists($source)) {
    copy($source, $dest);
    echo "Copied routes to $dest<br>";
} else {
    echo "Source not found.<br>";
}
?>
