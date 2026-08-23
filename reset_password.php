<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$admin = App\Models\Admin::where('email', 'admin@gmail.com')->first();
if ($admin) {
    $admin->password = Illuminate\Support\Facades\Hash::make('12345678');
    $admin->save();
    echo "Password reset for {$admin->email}\n";
} else {
    echo "Admin not found\n";
}
