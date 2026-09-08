<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

try {
    Artisan::call('route:clear');
    echo "Route cache cleared.\n";
    
    $routes = Route::getRoutes();
    foreach ($routes as $route) {
        if (strpos($route->uri(), 'leads') !== false) {
            echo "Method: " . implode('|', $route->methods()) . "\n";
            echo "URI: " . $route->uri() . "\n";
            echo "Name: " . $route->getName() . "\n";
            echo "Action: " . $route->getActionName() . "\n\n";
        }
    }
    echo "Done.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
