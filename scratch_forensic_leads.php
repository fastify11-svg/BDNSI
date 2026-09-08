<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $columns = DB::select("SHOW COLUMNS FROM leads");
    echo "Leads Columns:\n";
    foreach ($columns as $c) {
        echo "- " . $c->Field . "\n";
    }
    
    $leadsCount = DB::table('leads')->count();
    echo "Leads count: $leadsCount\n";
    if ($leadsCount > 0) {
        $leads = DB::table('leads')->get();
        echo "Leads Data:\n";
        foreach ($leads as $lead) {
            echo "- ID: {$lead->id}, Name: {$lead->name}, Created By: {$lead->created_by}\n";
        }
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
