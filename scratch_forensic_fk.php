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
    $columns = DB::select("SHOW COLUMNS FROM students");
    echo "Students Columns:\n";
    foreach ($columns as $c) {
        echo "- " . $c->Field . "\n";
    }
    
    // Check if there are any students
    $studentCount = DB::table('students')->count();
    echo "Students count: $studentCount\n";
    if ($studentCount > 0) {
        $uniqueSessions = DB::table('students')->distinct()->pluck('session_id')->toArray();
        echo "Session IDs referenced in students: " . implode(", ", $uniqueSessions) . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
