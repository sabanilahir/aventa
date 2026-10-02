<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

// Get admin role
$role = Role::where('name', 'admin')->first();
if (!$role) {
    $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
}

// Get all permissions
$permissions = Permission::pluck('id')->toArray();

// Assign all permissions to admin role
$role->permissions()->sync($permissions);

// Also give all permissions directly to admin user
$user = User::where('email', 'admin@admin.com')->first();
if ($user) {
    $user->permissions()->sync($permissions);
    $user->roles()->sync([$role->id]);
}

echo "All permissions assigned to admin role!\n";
echo "Total permissions: " . count($permissions) . "\n";
