<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Illuminate\Console\Command;

class UpdateMenuPermissions extends Command
{
    protected $signature = 'menu:update-permissions';
    protected $description = 'Update menu permissions for proper access control';

    public function handle()
    {
        // Update System menu - only for superadmin
        $system = Menu::where('title', 'System')->first();
        if ($system) {
            $system->update(['permission_name' => 'users-manage']);
            $this->info("Updated System menu");
        }

        // Add Permissions menu under System
        $permissionsMenu = Menu::firstOrCreate(
            ['title' => 'Permissions'],
            ['icon' => 'ShieldCheck', 'route' => '/permissions', 'order' => 4, 'permission_name' => 'permissions-manage']
        );
        $this->info("Permissions menu: " . $permissionsMenu->title);

        // Update or create menus
        $menusToUpdate = [
            ['title' => 'Menu Management', 'permission' => 'menus-manage'],
            ['title' => 'User Management', 'permission' => 'users-manage'],
            ['title' => 'Roles', 'permission' => 'roles-manage'],
            ['title' => 'Permissions', 'permission' => 'permissions-manage'],
        ];

        foreach ($menusToUpdate as $menuData) {
            $menu = Menu::where('title', $menuData['title'])->first();
            if ($menu) {
                $menu->update(['permission_name' => $menuData['permission']]);
                $this->info("Updated: " . $menu->title);
            }
        }

        $this->info("\nMenu permissions updated!");
    }
}
