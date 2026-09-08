<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Lead;
use Illuminate\Support\Facades\DB;

try {
    $httpKernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    
    $admin = Admin::where('email', 'admin@gmail.com')->first();
    if (!$admin) {
        die("Admin not found.");
    }
    
    // Fake server variables for proper routing
    $_SERVER['HTTP_HOST'] = 'nenobet.live';
    $_SERVER['SERVER_NAME'] = 'nenobet.live';

    echo "--- TEST 1: Unauthenticated Access to Leads Index ---\n";
    $request = Request::create('https://nenobet.live/admin/leads', 'GET');
    $response = $httpKernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n\n";
    
    echo "--- TEST 2: Authenticated Admin Access to Leads Index ---\n";
    auth('admin')->login($admin);
    $request = Request::create('https://nenobet.live/admin/leads', 'GET');
    $request->setUserResolver(function () use ($admin) {
        return $admin;
    });
    $app['auth']->setDefaultDriver('admin');
    $response = $httpKernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n\n";

    echo "--- TEST 3: Create a Controlled Test Lead ---\n";
    $createRequest = Request::create('https://nenobet.live/admin/leads', 'POST', [
        'name' => 'Forensic Test Lead',
        'phone' => '01999999999',
        'source' => 'Website',
        'status' => 'New',
        'notes' => 'Test lead created during forensic audit.'
    ]);
    $createRequest->setUserResolver(function () use ($admin) {
        return $admin;
    });
    $response = $httpKernel->handle($createRequest);
    echo "Status: " . $response->getStatusCode() . "\n";
    
    $lead = Lead::where('phone', '01999999999')->first();
    if ($lead) {
        echo "Lead Created Successfully! ID: {$lead->id}, Created By: {$lead->created_by}\n";
    } else {
        echo "Lead Creation Failed!\n";
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
?>
