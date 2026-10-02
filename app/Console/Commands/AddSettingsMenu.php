<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Illuminate\Console\Command;

class AddSettingsMenu extends Command
{
    protected $signature = 'menu:add-settings';
    protected $description = 'Add Settings menu to sidebar';

    public function handle()
    {
        // Find or create Pengaturan parent menu
        $pengaturan = Menu::firstOrCreate(
            ['title' => 'PENGATURAN'],
            ['icon' => 'Settings', 'route' => '#', 'order' => 100]
        );

        // Add Application Settings menu
        Menu::firstOrCreate(
            ['title' => 'Pengaturan Aplikasi', 'parent_id' => $pengaturan->id],
            ['icon' => 'AppWindow', 'route' => '/settingsapp', 'order' => 1]
        );

        $this->info('Settings menu added successfully!');
    }
}
