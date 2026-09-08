<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

putenv('APP_DEBUG=true');
putenv('APP_ENV=local');
$_ENV['APP_DEBUG'] = true;
$_ENV['APP_ENV'] = 'local';

try {
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';

    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );
    $response->send();
    $kernel->terminate($request, $response);

} catch (\Throwable $e) {
    echo "<h1>FATAL ERROR CAUGHT:</h1>";
    echo "<pre>";
    $current = $e;
    while ($current) {
        echo "Exception: " . get_class($current) . "\n";
        echo "Message: " . $current->getMessage() . "\n";
        echo "File: " . $current->getFile() . ":" . $current->getLine() . "\n";
        echo "Trace:\n" . $current->getTraceAsString() . "\n\n";
        $current = $current->getPrevious();
    }
    echo "</pre>";
}
?>
