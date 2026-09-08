<?php
$files = [
    'scratch_hello.php',
    'scratch_error_dumper.php',
    'scratch_check_dirs.php',
    'scratch_fix_cache.php',
    'scratch_fix_sessions.php',
    'scratch_fix_env.php',
    'scratch_cleanup.php'
];

foreach ($files as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        unlink(__DIR__ . '/' . $file);
        echo "Deleted $file<br>";
    }
}
echo "Cleanup complete.";
?>
