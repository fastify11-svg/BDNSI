<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SystemHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:health-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifies active connectivity to Database, Cache/Redis, Storage, and external APIs.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Active System Health Check...');
        $hasError = false;

        // 1. Database Connectivity
        try {
            DB::connection()->getPdo();
            $this->info('✓ Database connectivity: OK');
        } catch (\Exception $e) {
            $this->error('Database connectivity FAILED: ' . $e->getMessage());
            $hasError = true;
        }

        // 2. Cache/Redis Connectivity
        try {
            Cache::put('health_check_test', '1', 10);
            if (Cache::get('health_check_test') === '1') {
                $this->info('✓ Cache/Redis connectivity: OK');
            } else {
                throw new \Exception("Cache read/write mismatch");
            }
        } catch (\Exception $e) {
            $this->error('Cache/Redis connectivity FAILED: ' . $e->getMessage());
            $hasError = true;
        }

        // 3. Storage Permissions (Public and Private)
        try {
            Storage::disk('public')->put('health.txt', 'ok');
            Storage::disk('public')->delete('health.txt');
            $this->info('✓ Public Storage: OK');
        } catch (\Exception $e) {
            $this->error('Public Storage FAILED: ' . $e->getMessage());
            $hasError = true;
        }

        try {
            Storage::disk('private')->put('health.txt', 'ok');
            Storage::disk('private')->delete('health.txt');
            $this->info('✓ Private Storage: OK');
        } catch (\Exception $e) {
            $this->error('Private Storage FAILED: ' . $e->getMessage());
            $hasError = true;
        }

        // 4. External Gateway Connectivity (Optional/Simulation)
        // Checking SSLCommerz Sandbox API accessibility
        try {
            $response = Http::timeout(5)->get('https://sandbox.sslcommerz.com');
            // As long as it doesn't throw a connection error, it's reachable
            $this->info('✓ SSLCommerz Gateway API: Reachable');
        } catch (\Exception $e) {
            $this->warn('SSLCommerz Gateway API unreachable: ' . $e->getMessage());
        }

        if ($hasError) {
            $this->error('Active System Health Check FAILED. The system is degraded.');
            return 1;
        }

        $this->info('Active System Health Check PASSED. All core services are operational.');
        return 0;
    }
}
