<?php

namespace App\Console\Commands;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Console\Command;

class AddPermission extends Command
{
    protected $signature = 'permission:add {name} {group=Guest}';
    protected $description = 'Add new permission';

    public function handle()
    {
        $name = $this->argument('name');
        $group = $this->argument('group');

        $permission = Permission::firstOrCreate(
            ['name' => $name],
            ['group' => $group]
        );

        $this->info("Permission '{$name}' created in group '{$group}'");

        // Assign to superadmin
        $superadmin = Role::where('name', 'superadmin')->first();
        if ($superadmin) {
            $superadmin->givePermissionTo($permission);
            $this->info("Assigned to superadmin");
        }
    }
}
