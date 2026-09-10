<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$app->make('Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\LoadConfiguration')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\HandleExceptions')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\RegisterFacades')->bootstrap($app);

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

Schema::table('sessions', function (Blueprint $table) {
    if (!Schema::hasColumn('sessions', 'status')) {
        $table->tinyInteger('status')->unsigned()->default(1);
    }
    if (!Schema::hasColumn('sessions', 'result_published_date')) {
        $table->date('result_published_date')->nullable();
    }
    if (!Schema::hasColumn('sessions', 'team_id')) {
        $table->unsignedBigInteger('team_id')->nullable();
    }
    if (!Schema::hasColumn('sessions', 'duration')) {
        $table->unsignedInteger('duration')->nullable();
    }
    if (!Schema::hasColumn('sessions', 'exam_date')) {
        $table->date('exam_date')->nullable();
    }
});

echo "Sessions table repaired!\n";
