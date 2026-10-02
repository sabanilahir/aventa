<?php

namespace App\Console\Commands;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class SeedAllPermissions extends Command
{
    protected $signature = 'seed:all-permissions';
    protected $description = 'Seed all permissions and assign to admin';

    public function handle()
    {
        // Guest Management permissions
        $guestPermissions = [
            'guest-view',
            'guest-create', 
            'guest-edit',
            'guest-delete',
            'guest-checkin',
            'guest-acara',
            'guest-meja',
            'guest-grup',
            'guest-hadiah',
            'guest-souvenir',
            'guest-pertanyaan',
        ];

        // Settings permissions
        $settingsPermissions = [
            'settings-view',
            'settings-edit',
        ];

        $allPermissions = array_merge($guestPermissions, $settingsPermissions);

        foreach ($allPermissions as $permName) {
            Permission::firstOrCreate(['name' => $permName], ['group' => str_contains($permName, 'guest') ? 'Guest' : 'Settings']);
        }

        // Assign to admin role
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo($allPermissions);
        }

        // Also assign to user if exists
        $user = User::where('email', 'admin@example.com')->first();
        if ($user) {
            $user->assignRole('admin');
        }

        $this->info('All permissions seeded and assigned to admin!');
        $this->info('Permissions created: ' . count($allPermissions));
    }
}
