<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Illuminate\Console\Command;

class SeedGuestMenus extends Command
{
    protected $signature = 'seed:guest-menus';
    protected $description = 'Seed guest management menus';

    public function handle()
    {
        // USER Section - List Acara & Dashboard
        $user = Menu::firstOrCreate(
            ['title' => 'USER'],
            ['icon' => 'Users', 'route' => '#', 'order' => 1]
        );

        Menu::firstOrCreate(
            ['title' => 'List Acara', 'parent_id' => $user->id],
            ['icon' => 'Calendar', 'route' => '/guest-acara', 'order' => 1]
        );

        Menu::firstOrCreate(
            ['title' => 'Dashboard', 'parent_id' => $user->id],
            ['icon' => 'LayoutDashboard', 'route' => '/guest-dashboard', 'order' => 2]
        );

        // TAMU Section
        $tamu = Menu::firstOrCreate(
            ['title' => 'TAMU'],
            ['icon' => 'UserCheck', 'route' => '#', 'order' => 3]
        );

        Menu::firstOrCreate(
            ['title' => 'Tamu', 'parent_id' => $tamu->id],
            ['icon' => 'Users', 'route' => '/guest-tamu', 'order' => 1]
        );

        Menu::firstOrCreate(
            ['title' => 'Hadiah Tamu', 'parent_id' => $tamu->id],
            ['icon' => 'Gift', 'route' => '/guest-hadiah', 'order' => 2]
        );

        Menu::firstOrCreate(
            ['title' => 'Souvenir Tamu', 'parent_id' => $tamu->id],
            ['icon' => 'Package', 'route' => '/guest-souvenir', 'order' => 3]
        );

        // MEJA Section
        $meja = Menu::firstOrCreate(
            ['title' => 'MEJA'],
            ['icon' => 'LayoutGrid', 'route' => '#', 'order' => 4]
        );

        Menu::firstOrCreate(
            ['title' => 'Meja', 'parent_id' => $meja->id],
            ['icon' => 'LayoutGrid', 'route' => '/guest-meja', 'order' => 1]
        );

        // PENGATURAN Section
        $pengaturan = Menu::firstOrCreate(
            ['title' => 'PENGATURAN'],
            ['icon' => 'Settings', 'route' => '#', 'order' => 5]
        );

        Menu::firstOrCreate(
            ['title' => 'Grup Tamu', 'parent_id' => $pengaturan->id],
            ['icon' => 'Folder', 'route' => '/guest-grup', 'order' => 1]
        );

        Menu::firstOrCreate(
            ['title' => 'Pertanyaan RSVP', 'parent_id' => $pengaturan->id],
            ['icon' => 'HelpCircle', 'route' => '/guest-pertanyaan', 'order' => 2]
        );

        // Remove old menus
        Menu::where('title', 'Dashboard')->whereNull('parent_id')->delete();
        Menu::where('title', 'Trah')->whereNull('parent_id')->delete();
        Menu::where('title', 'System')->whereNull('parent_id')->delete();

        $this->info('Guest management menus seeded successfully!');
    }
}
