<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Illuminate\Console\Command;

class SeedMenus extends Command
{
    protected $signature = 'seed:menus';
    protected $description = 'Seed default menus for the application';

    public function handle()
    {
        // Parent menus
        $dashboard = Menu::firstOrCreate(
            ['title' => 'Dashboard'],
            ['icon' => 'LayoutDashboard', 'route' => '/dashboard', 'order' => 1]
        );

        $trah = Menu::firstOrCreate(
            ['title' => 'Trah'],
            ['icon' => 'Users', 'route' => '#', 'order' => 2]
        );

        $system = Menu::firstOrCreate(
            ['title' => 'System'],
            ['icon' => 'Settings', 'route' => '#', 'order' => 10]
        );

        // Child menus for Trah
        Menu::firstOrCreate(
            ['title' => 'Direktori Anggota', 'parent_id' => $trah->id],
            ['icon' => 'Users', 'route' => '/trah-members', 'order' => 1]
        );

        Menu::firstOrCreate(
            ['title' => 'Pengaturan Trah', 'parent_id' => $trah->id],
            ['icon' => 'Settings', 'route' => '/trah-settings', 'order' => 2]
        );

        // Child menus for System
        Menu::firstOrCreate(
            ['title' => 'Menu Management', 'parent_id' => $system->id],
            ['icon' => 'Menu', 'route' => '/menus', 'order' => 1]
        );

        Menu::firstOrCreate(
            ['title' => 'User Management', 'parent_id' => $system->id],
            ['icon' => 'UserCog', 'route' => '/users', 'order' => 2]
        );

        Menu::firstOrCreate(
            ['title' => 'Roles', 'parent_id' => $system->id],
            ['icon' => 'Shield', 'route' => '/roles', 'order' => 3]
        );

        $this->info('Menus seeded successfully!');
    }
}
