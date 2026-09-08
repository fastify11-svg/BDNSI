<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$timestamp = date('Y-m-d_H-i-s');
$backupDir = __DIR__.'/../storage/app/backups';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Backup .env
$envBackupPath = "$backupDir/.env.backup_$timestamp";
if (file_exists(__DIR__.'/../.env')) {
    copy(__DIR__.'/../.env', $envBackupPath);
    echo "Backed up .env to $envBackupPath<br>";
}

// Backup DB
$dbHost = env('DB_HOST');
$dbPort = env('DB_PORT');
$dbName = env('DB_DATABASE');
$dbUser = env('DB_USERNAME');
$dbPass = env('DB_PASSWORD');

$dbBackupPath = "$backupDir/db_backup_$timestamp.sql";
$command = "mysqldump --host=$dbHost --port=$dbPort --user=$dbUser --password='$dbPass' $dbName > $dbBackupPath 2>&1";
exec($command, $output, $returnVar);

if ($returnVar === 0 && file_exists($dbBackupPath)) {
    echo "Backed up database to $dbBackupPath (Size: " . filesize($dbBackupPath) . " bytes)<br>";
} else {
    echo "Failed to backup database. Command returned $returnVar. Output: " . implode("\n", $output) . "<br>";
}

echo "POST_INCIDENT_BACKUP_TIMESTAMP: $timestamp<br>";
?>
