<?php
namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class GuestPermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
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
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], ['group' => $perm['group']]);
        }

        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            foreach ($permissions as $perm) {
                $permission = Permission::where('name', $perm['name'])->first();
                if ($permission && !$admin->hasPermissionTo($permission)) {
                    $admin->givePermissionTo($permission);
                }
            }
        }

        echo "Guest permissions created\n";
    }
}