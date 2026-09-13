<?php

use App\Exceptions\Handler;
use App\Http\Kernel;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Foundation\Application;

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| The first thing we will do is create a new Laravel application instance
| which serves as the "glue" for all the components of Laravel and is the
| IoC container for the system binding all parts of the framework.
|
*/

$app = new Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

/*
|--------------------------------------------------------------------------
| Shared-hosting public path compatibility
|--------------------------------------------------------------------------
|
| The upload-ready Hostinger package flattens the normal Laravel public/
| directory into public_html. In that layout the compiled Vite manifest is
| <base>/build/manifest.json instead of <base>/public/build/manifest.json.
| Detect only that packaged layout and point Laravel's public_path() helper
| at the real web root. Normal source/development installations keep the
| standard <base>/public directory unchanged.
|
*/

$basePath = dirname(__DIR__);
$flatManifest = $basePath.'/build/manifest.json';
$standardManifest = $basePath.'/public/build/manifest.json';

if (is_file($flatManifest) && ! is_file($standardManifest)) {
    $app->usePublicPath($basePath);
}

/*
|--------------------------------------------------------------------------
| Bind Important Interfaces
|--------------------------------------------------------------------------
|
| Next, we need to bind some important interfaces into the container so
| we will be able to resolve them when needed. The kernels serve the
| incoming requests to this application and its console commands.
|
*/

$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    ExceptionHandler::class,
    Handler::class
);

/*
|--------------------------------------------------------------------------
| Return The Application
|--------------------------------------------------------------------------
|
| This script returns the application instance. The instance is given to
| the calling script so we can separate building the application from
| handling the request.
|
*/

return $app;
