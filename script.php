<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

try {
    \App\Models\GradeScale::where('course_type', 'Regular')->first();
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
}
