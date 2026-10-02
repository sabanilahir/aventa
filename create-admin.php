<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

// Create role
$role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

// Create or get user
$user = User::firstOrCreate(
    ['email' => 'admin@admin.com'],
    [
        'name' => 'Admin',
        'password' => Hash::make('admin123')
    ]
);

// Assign role
$user->assignRole('admin');

echo "Admin user created/updated successfully!\n";
echo "Email: admin@admin.com\n";
echo "Password: admin123\n";
