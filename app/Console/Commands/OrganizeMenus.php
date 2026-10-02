<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Illuminate\Console\Command;

class OrganizeMenus extends Command
{
    protected $signature = 'menu:organize';
    protected $description = 'Organize menus properly';

    public function handle()
    {
        // Create PENGATURAN parent (for superadmin only)
        $pengaturan = Menu::firstOrCreate(
            ['title' => 'PENGATURAN'],
            ['icon' => 'Settings', 'route' => '#', 'order' => 100, 'permission_name' => 'settings-manage']
        );

        // Update System menu (for superadmin only)
        Menu::where('title', 'System')->update(['permission_name' => 'users-manage']);
        
        // Make sure Menu Management, User Management, Roles are under System
        Menu::where('title', 'Menu Management')->update(['permission_name' => 'menus-manage', 'parent_id' => null]);
        Menu::where('title', 'User Management')->update(['permission_name' => 'users-manage', 'parent_id' => null]);
        Menu::where('title', 'Roles')->update(['permission_name' => 'roles-manage', 'parent_id' => null]);

        // Add Pengaturan Aplikasi under PENGATURAN
        $pengaturanApp = Menu::firstOrCreate(
            ['title' => 'Pengaturan Aplikasi'],
            ['icon' => 'AppWindow', 'route' => '/guest-settings', 'order' => 1, 'permission_name' => 'settings-manage', 'parent_id' => $pengaturan->id]
        );

        $this->info('Menu organization completed!');
        $this->info('');
        $this->info('Menu Structure:');
        $this->info('- USER (guest-view) - Guest Management');
        $this->info('  - List Acara');
        $this->info('  - Dashboard');
        $this->info('- TAMU (guest-view) - Tamu Management');
        $this->info('  - Tamu, Hadiah, Souvenir, Grup, Pertanyaan RSVP');
        $this->info('- MEJA (guest-view) - Table Management');
        $this->info('- System (users-manage) - Superadmin Only');
        $this->info('  - Menu Management, User Management, Roles');
        $this->info('- PENGATURAN (settings-manage) - Superadmin Only');
        $this->info('  - Pengaturan Aplikasi');
    }
}
