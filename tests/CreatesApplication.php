<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;

trait CreatesApplication
{
    /**
     * Creates the application.
     *
     * @return Application
     */
    public function createApplication()
    {
        // STAGE 1: Pre-framework-bootstrap environmental check
        if (($_SERVER['APP_ENV'] ?? '') !== 'testing') {
            die("CRITICAL ABORT: PHPUnit must run in the 'testing' environment.\n");
        }

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        // STAGE 2: Post-bootstrap strict config whitelist validation
        $defaultConnection = $app['config']->get('database.default');

        if ($defaultConnection === 'sqlite') {
            $dbName = $app['config']->get('database.connections.sqlite.database');
            if ($dbName !== ':memory:') {
                 die("CRITICAL SAFETY ABORT: SQLite database must be in-memory (:memory:).\n");
            }
        } else {
            $dbName = $app['config']->get('database.connections.mysql.database');
            $dbUser = $app['config']->get('database.connections.mysql.username');

            if ($defaultConnection !== 'mysql' || $dbName !== 'bdnsi_testing' || $dbUser !== 'bdnsi_test_user') {
                die(sprintf(
                    "CRITICAL SAFETY ABORT: Unsafe database configuration resolved!\nExpected Connection: mysql, Got: %s\nExpected DB: bdnsi_testing, Got: %s\nExpected User: bdnsi_test_user, Got: %s\n",
                    $defaultConnection, $dbName, $dbUser
                ));
            }
        }

        return $app;
    }
}
