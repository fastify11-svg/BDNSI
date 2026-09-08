<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    $tables = DB::select('SHOW TABLES');
    $dbName = DB::connection()->getDatabaseName();
    $tableKey = "Tables_in_" . $dbName;
    
    echo "TABLES:\n";
    foreach ($tables as $table) {
        $name = $table->$tableKey;
        $count = DB::table($name)->count();
        echo "- $name: $count rows\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
