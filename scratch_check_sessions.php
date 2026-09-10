<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$app->make('Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\LoadConfiguration')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\HandleExceptions')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\RegisterFacades')->bootstrap($app);

$columns = \Illuminate\Support\Facades\Schema::getColumnListing('sessions');
echo "SESSIONS COLUMNS: " . implode(', ', $columns) . "\n";

$migrations = \Illuminate\Support\Facades\DB::table('migrations')->where('migration', 'like', '%session%')->pluck('migration')->toArray();
echo "MIGRATIONS: " . implode(', ', $migrations) . "\n";
