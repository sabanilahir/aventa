<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Console\Command;

class SetupMainModule extends Command
{
    protected $signature = 'menu:main-module';
    protected $description = 'Setup main module structure';

    public function handle()
    {
        // USER Section
        $user = Menu::firstOrCreate(['title' => 'USER'], ['icon' => 'Users', 'route' => '#', 'order' => 1, 'permission_name' => 'guest-view']);
        Menu::firstOrCreate(['title' => 'List Acara', 'parent_id' => $user->id], ['icon' => 'Calendar', 'route' => '/guest-acara', 'order' => 1, 'permission_name' => 'guest-acara']);
        Menu::firstOrCreate(['title' => 'Dashboard', 'parent_id' => $user->id], ['icon' => 'LayoutDashboard', 'route' => '/guest-dashboard', 'order' => 2, 'permission_name' => 'guest-view']);

        // OVERVIEW Section
        $overview = Menu::firstOrCreate(['title' => 'OVERVIEW'], ['icon' => 'BarChart', 'route' => '#', 'order' => 2, 'permission_name' => 'guest-view']);
        Menu::firstOrCreate(['title' => 'Overview Tamu', 'parent_id' => $overview->id], ['icon' => 'Users', 'route' => '/guest-overview/tamu', 'order' => 1, 'permission_name' => 'guest-view']);
        Menu::firstOrCreate(['title' => 'Overview Meja', 'parent_id' => $overview->id], ['icon' => 'LayoutGrid', 'route' => '/guest-overview/meja', 'order' => 2, 'permission_name' => 'guest-meja']);

        // TAMU Section
        $tamu = Menu::firstOrCreate(['title' => 'TAMU'], ['icon' => 'UserCheck', 'route' => '#', 'order' => 3, 'permission_name' => 'guest-view']);
        Menu::firstOrCreate(['title' => 'Tamu', 'parent_id' => $tamu->id], ['icon' => 'Users', 'route' => '/guest-tamu', 'order' => 1, 'permission_name' => 'guest-view']);
        Menu::firstOrCreate(['title' => 'Hadiah Tamu', 'parent_id' => $tamu->id], ['icon' => 'Gift', 'route' => '/guest-hadiah', 'order' => 2, 'permission_name' => 'guest-hadiah']);
        Menu::firstOrCreate(['title' => 'Check In Tamu', 'parent_id' => $tamu->id], ['icon' => 'CheckCircle', 'route' => '/guest-checkin', 'order' => 3, 'permission_name' => 'guest-checkin']);
        Menu::firstOrCreate(['title' => 'Souvenir Tamu', 'parent_id' => $tamu->id], ['icon' => 'Package', 'route' => '/guest-souvenir', 'order' => 4, 'permission_name' => 'guest-souvenir']);

        // PENGATURAN Section
        $pengaturan = Menu::firstOrCreate(['title' => 'PENGATURAN'], ['icon' => 'Settings', 'route' => '#', 'order' => 10, 'permission_name' => 'guest-settings']);
        Menu::firstOrCreate(['title' => 'Umum', 'parent_id' => $pengaturan->id], ['icon' => 'Settings', 'route' => '/guest-settings', 'order' => 1, 'permission_name' => 'guest-settings']);
        Menu::firstOrCreate(['title' => 'Grup', 'parent_id' => $pengaturan->id], ['icon' => 'Folder', 'route' => '/guest-grup', 'order' => 2, 'permission_name' => 'guest-grup']);
        Menu::firstOrCreate(['title' => 'Meja', 'parent_id' => $pengaturan->id], ['icon' => 'LayoutGrid', 'route' => '/guest-meja', 'order' => 3, 'permission_name' => 'guest-meja']);
        Menu::firstOrCreate(['title' => 'Skenario', 'parent_id' => $pengaturan->id], ['icon' => 'Play', 'route' => '/guest-skenario', 'order' => 4, 'permission_name' => 'guest-skenario']);
        Menu::firstOrCreate(['title' => 'Pertanyaan', 'parent_id' => $pengaturan->id], ['icon' => 'HelpCircle', 'route' => '/guest-pertanyaan', 'order' => 5, 'permission_name' => 'guest-pertanyaan']);
        Menu::firstOrCreate(['title' => 'Label', 'parent_id' => $pengaturan->id], ['icon' => 'Tag', 'route' => '/guest-label', 'order' => 6, 'permission_name' => 'guest-label']);
        Menu::firstOrCreate(['title' => 'Bahasa', 'parent_id' => $pengaturan->id], ['icon' => 'Languages', 'route' => '/guest-bahasa', 'order' => 7, 'permission_name' => 'guest-bahasa']);

        // Create permissions
        $perms = ['guest-settings', 'guest-skenario', 'guest-label', 'guest-bahasa', 'guest-checkin'];
        foreach ($perms as $name) {
            Permission::firstOrCreate(['name' => $name], ['group' => 'Guest']);
        }

        // Assign to admin
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $allGuestPerms = ['guest-view', 'guest-create', 'guest-edit', 'guest-delete', 'guest-checkin', 'guest-acara', 'guest-meja', 'guest-grup', 'guest-hadiah', 'guest-souvenir', 'guest-pertanyaan', 'guest-settings', 'guest-skenario', 'guest-label', 'guest-bahasa'];
            $admin->givePermissionTo($allGuestPerms);
        }

        $this->info('Main module setup completed!');
        $this->info('Menu Structure: USER, OVERVIEW, TAMU, PENGATURAN');
    }
}
