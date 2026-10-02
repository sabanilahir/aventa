<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class WaSettingsMenuSeeder extends Seeder
{
    public function run(): void
    {
        // Add WhatsApp Settings menu
        $menu = Menu::create([
            'title' => 'WhatsApp Settings',
            'icon' => 'MessageSquare',
            'route' => '/wa-settings',
            'order' => 99,
            'permission_name' => 'wa-settings-view',
        ]);

        // Create permission
        Permission::firstOrCreate(['name' => 'wa-settings-view']);

        // Give permission to admin role
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo('wa-settings-view');
        }

        $this->command->info('WhatsApp Settings menu created successfully!');
    }
}