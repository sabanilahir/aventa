<?php

namespace App\Console\Commands;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Console\Command;

class SetupSuperadmin extends Command
{
    protected $signature = 'setup:superadmin';
    protected $description = 'Setup superadmin role and permissions';

    public function handle()
    {
        // Create superadmin role if not exists
        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        
        // Create all permissions
        $permissions = [
            // Guest permissions
            ['name' => 'guest-view', 'group' => 'Guest'],
            ['name' => 'guest-create', 'group' => 'Guest'],
            ['name' => 'guest-edit', 'group' => 'Guest'],
            ['name' => 'guest-delete', 'group' => 'Guest'],
            ['name' => 'guest-checkin', 'group' => 'Guest'],
            ['name' => 'guest-acara', 'group' => 'Guest'],
            ['name' => 'guest-meja', 'group' => 'Guest'],
            ['name' => 'guest-grup', 'group' => 'Guest'],
            ['name' => 'guest-hadiah', 'group' => 'Guest'],
            ['name' => 'guest-souvenir', 'group' => 'Guest'],
            ['name' => 'guest-pertanyaan', 'group' => 'Guest'],
            // Settings permissions - only for superadmin
            ['name' => 'settings-manage', 'group' => 'Settings'],
            ['name' => 'users-manage', 'group' => 'Settings'],
            ['name' => 'roles-manage', 'group' => 'Settings'],
            ['name' => 'menus-manage', 'group' => 'Settings'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], ['group' => $perm['group']]);
        }

        // Give all permissions to superadmin
        $superadmin->givePermissionTo(Permission::all());

        // Give only guest permissions to admin
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $guestPerms = Permission::where('group', 'Guest')->get();
        $admin->givePermissionTo($guestPerms);

        // Create superadmin user if not exists
        $user = User::where('email', 'admin@example.com')->first();
        if ($user) {
            $user->assignRole('superadmin');
            $this->info('Superadmin role assigned to admin@example.com');
        }

        $this->info('Superadmin setup completed!');
        $this->info('Superadmin has all permissions');
        $this->info('Admin has Guest permissions only');
    }
}
