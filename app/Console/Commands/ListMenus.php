<?php

namespace App\Console\Commands;

use App\Models\Menu;
use Illuminate\Console\Command;

class ListMenus extends Command
{
    protected $signature = 'menu:list';
    protected $description = 'List all menus';

    public function handle()
    {
        $menus = Menu::with('parent')->get();
        $this->info("Total Menus: " . $menus->count());
        $this->info("\nMenu List:");
        
        foreach ($menus as $menu) {
            $parent = $menu->parent ? $menu->parent->title : '-';
            $this->line("{$menu->title} | Parent: {$parent} | Permission: {$menu->permission_name}");
        }
    }
}
