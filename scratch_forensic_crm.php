<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Admin;
use App\Models\Lead;
use Illuminate\Support\Facades\DB;

try {
    // We will bypass the HTTP server and use Laravel's request lifecycle
    $httpKernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    
    $admin = Admin::where('email', 'admin@gmail.com')->first();
    if (!$admin) {
        die("Admin not found.");
    }

    echo "--- TEST 1: Unauthenticated Access to Leads Index ---\n";
    $request = Request::create('/admin/leads', 'GET');
    $response = $httpKernel->handle($request);
    echo "Status: " . $response->getStatusCode() . " (Expected: 302/Redirect to login)\n\n";
    
    echo "--- TEST 2: Authenticated Admin Access to Leads Index ---\n";
    auth('admin')->login($admin);
    $request = Request::create('/admin/leads', 'GET');
    $request->setUserResolver(function () use ($admin) {
        return $admin;
    });
    $app['auth']->setDefaultDriver('admin');
    $response = $httpKernel->handle($request);
    echo "Status: " . $response->getStatusCode() . " (Expected: 200)\n\n";

    echo "--- TEST 3: Create a Controlled Test Lead ---\n";
    $createRequest = Request::create('/admin/leads', 'POST', [
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
    echo "Status: " . $response->getStatusCode() . " (Expected: 302/Redirect back)\n";
    
    $lead = Lead::where('phone', '01999999999')->first();
    if ($lead) {
        echo "Lead Created Successfully! ID: {$lead->id}, Created By: {$lead->created_by}\n";
    } else {
        echo "Lead Creation Failed!\n";
    }
    
    echo "\n--- TEST 4: Audit Logging Verification ---\n";
    $audit = DB::table('audit_logs')
        ->where('auditable_type', Lead::class)
        ->where('auditable_id', $lead->id ?? 0)
        ->where('event', 'created')
        ->first();
    if ($audit) {
        echo "Audit Log Found! Event: {$audit->event}, User ID: {$audit->user_id}\n";
    } else {
        echo "Audit Log Missing!\n";
    }

    echo "\n--- TEST 5: IDOR / Update Lead Status ---\n";
    if ($lead) {
        $updateRequest = Request::create('/admin/leads/' . $lead->id, 'PUT', [
            'name' => 'Forensic Test Lead',
            'phone' => '01999999999',
            'source' => 'Website',
            'status' => 'Contacted'
        ]);
        $updateRequest->setUserResolver(function () use ($admin) {
            return $admin;
        });
        $response = $httpKernel->handle($updateRequest);
        echo "Status: " . $response->getStatusCode() . " (Expected: 302)\n";
        
        $lead->refresh();
        echo "Lead Status Updated To: {$lead->status}\n";
        
        $auditUpdate = DB::table('audit_logs')
            ->where('auditable_type', Lead::class)
            ->where('auditable_id', $lead->id)
            ->where('event', 'updated')
            ->first();
        if ($auditUpdate) {
            echo "Audit Log for Update Found! Event: {$auditUpdate->event}\n";
        }
    }

    echo "\n--- TEST 6: Unauthorized Role Access (IDOR Verification) ---\n";
    // Using a regular user to attempt update on lead
    $user = \App\Models\User::first();
    if ($user && $lead) {
        auth('web')->login($user);
        $app['auth']->setDefaultDriver('web');
        $unauthorizedRequest = Request::create('/admin/leads/' . $lead->id, 'PUT', [
            'status' => 'Qualified'
        ]);
        $unauthorizedRequest->setUserResolver(function () use ($user) {
            return $user;
        });
        $response = $httpKernel->handle($unauthorizedRequest);
        echo "Unauthorized Status: " . $response->getStatusCode() . " (Expected: 302/Redirect or 403)\n";
    } else {
        echo "No standard user found to test IDOR.\n";
    }

    // Cleanup Test Lead
    if ($lead) {
        $lead->delete();
        DB::table('audit_logs')->where('auditable_type', Lead::class)->where('auditable_id', $lead->id)->delete();
        echo "\nTest Lead and associated audit logs safely removed.\n";
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
?>
