<?php

namespace App\Console\Commands;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class SetupGuestPermissions extends Command
{
    protected $signature = 'setup:guest-permissions';
    protected $description = 'Setup all guest management permissions';

    public function handle()
    {
        // All Guest permissions
        $perms = [
            'guest-view', 'guest-create', 'guest-edit', 'guest-delete',
            'guest-checkin', 'guest-acara', 'guest-meja', 'guest-grup',
            'guest-hadiah', 'guest-souvenir', 'guest-pertanyaan',
            'guest-settings', 'guest-skenario', 'guest-label',
            'guest-bahasa', 'guest-overview'
        ];

        // Create permissions
        foreach ($perms as $name) {
            Permission::firstOrCreate(['name' => $name], ['group' => 'Guest']);
            $this->info("Created: $name");
        }

        // Give to admin role
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo($perms);
            $this->info("Assigned all to admin role");
        }

        // Give to superadmin role
        $superadmin = Role::where('name', 'superadmin')->first();
        if ($superadmin) {
            $superadmin->givePermissionTo(Permission::all());
            $this->info("Assigned all to superadmin role");
        }

        $this->info("Guest permissions setup completed!");
    }
}
