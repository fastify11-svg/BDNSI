<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Output\BufferedOutput;

function runArtisanCommand($command) {
    try {
        echo "=== Running $command ===\n";
        $output = new BufferedOutput();
        Artisan::call($command, [], $output);
        echo $output->fetch() . "\n";
    } catch (\Exception $e) {
        echo "Command failed or doesn't exist: " . $e->getMessage() . "\n\n";
    }
}

runArtisanCommand('system:db-integrity-check');
runArtisanCommand('system:financial-health-check');
runArtisanCommand('system:financial-reconciliation');
runArtisanCommand('system:health-check');
?>
