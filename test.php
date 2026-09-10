<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$app->make('Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\LoadConfiguration')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\HandleExceptions')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\RegisterFacades')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\RegisterProviders')->bootstrap($app);
$app->make('Illuminate\Foundation\Bootstrap\BootProviders')->bootstrap($app);

$admin = \App\Models\Admin::first();
auth()->guard('admin')->login($admin);

$request = Illuminate\Http\Request::create('/admin/student/create', 'GET');
$response = $kernel->handle($request);

if ($response->getStatusCode() === 500) {
    if (isset($response->exception)) {
        echo "EXCEPTION: " . $response->exception->getMessage() . "\n";
        echo $response->exception->getTraceAsString();
    } else {
        echo "500 WITHOUT EXCEPTION";
    }
} else {
    echo "Status: " . $response->getStatusCode() . "\n";
}
