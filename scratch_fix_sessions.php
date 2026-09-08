<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$app->make('Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\LoadConfiguration')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\HandleExceptions')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\RegisterFacades')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\SetRequestForConsole')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\RegisterProviders')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\BootProviders')->bootstrap($app);

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Output\BufferedOutput;

try {
    echo "Disabling FK...<br>";
    Schema::disableForeignKeyConstraints();

    echo "Dropping sessions table if exists...<br>";
    Schema::dropIfExists('sessions');
    echo "Sessions table dropped.<br>";

    echo "Enabling FK...<br>";
    Schema::enableForeignKeyConstraints();

    DB::table('migrations')->where('migration', 'like', '%create_sessions_table%')->delete();
    echo "Deleted session migrations from DB.<br>";

    $output = new BufferedOutput();
    Artisan::call('migrate', ['--force' => true], $output);
    echo "<pre>" . $output->fetch() . "</pre>";
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
