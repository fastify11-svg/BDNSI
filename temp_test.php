<?php
$user = App\Models\User::where('email', 'user@gmail.com')->first();
Auth::login($user);
$center = App\Models\Center::find($user->center_id);
$status = $center ? (is_object($center->status) ? $center->status->value : $center->status) : null;
echo 'User: ' . $user->email . "\n";
echo 'Center Status: ' . print_r($status, true) . "\n";
if (! $center || ($status != 1 && $status !== App\Enums\CenterStatus::Approved && strtolower((string) $status) !== 'approved')) {
    echo "LOGOUT TRIGGERED\n";
} else {
    echo "SUCCESS NO LOGOUT\n";
}
