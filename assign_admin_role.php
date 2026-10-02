<?php
$admin = App\Models\User::where('email', 'admin@example.com')->first();
if ($admin) {
    $admin->assignRole('admin');
    echo "Admin role assigned to admin@example.com\n";
} else {
    echo "Admin user not found\n";
}
