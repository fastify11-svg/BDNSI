<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();
        
        $dbName = config('database.connections.' . config('database.default') . '.database');
        
        if ($dbName === 'yttccomb_bdnsi' || config('app.env') !== 'testing') {
            throw new \Exception('CRITICAL: Test suite attempted to run against primary local database or non-testing environment! Aborting to prevent data loss.');
        }
    }
}
