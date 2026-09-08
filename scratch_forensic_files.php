<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$filesToCheck = [
    __DIR__.'/../app/Http/Controllers/Admin/LeadController.php',
    __DIR__.'/../app/Models/Lead.php',
    __DIR__.'/../routes/admin.php'
];

foreach ($filesToCheck as $file) {
    echo "Checking $file:\n";
    if (file_exists($file)) {
        echo "EXISTS\n";
        if (basename($file) === 'admin.php') {
            $content = file_get_contents($file);
            if (strpos($content, 'leads') !== false) {
                echo "admin.php CONTAINS 'leads'\n";
            } else {
                echo "admin.php DOES NOT CONTAIN 'leads'\n";
            }
        }
    } else {
        echo "MISSING\n";
    }
    echo "\n";
}
?>
