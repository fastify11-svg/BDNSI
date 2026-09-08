<?php
// SECURE: Delete this file after use
// Live migration runner for Commission Module (Phase L)
$token = $_GET['token'] ?? '';
if ($token !== 'bdnsi_migrate_2026') {
    http_response_code(403);
    die('Forbidden');
}

$app_root = realpath(__DIR__ . '/..');
chdir($app_root);

// Load environment
require $app_root . '/vendor/autoload.php';
$app = require_once $app_root . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

header('Content-Type: text/plain');

echo "=== LIVE MIGRATION RUNNER ===\n";
echo "App root: $app_root\n";
echo "DB: " . config('database.connections.mysql.database') . "\n\n";

// Check which migrations are pending
$pending = Artisan::call('migrate:status');
echo "--- migrate:status ---\n";
echo Artisan::output();

echo "\n--- Running migrate --force ---\n";
Artisan::call('migrate', ['--force' => true]);
echo Artisan::output();

echo "\n--- optimize:clear ---\n";
Artisan::call('optimize:clear');
echo Artisan::output();

echo "\nDone at " . date('Y-m-d H:i:s') . "\n";

// Self-delete
@unlink(__FILE__);
echo "Script removed.\n";
