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

try {
    $output = new BufferedOutput();
    Artisan::call('migrate:status', [], $output);
    echo "<pre>" . $output->fetch() . "</pre>";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
