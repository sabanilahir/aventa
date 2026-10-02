<?php

namespace Database\\Seeders;
use Illuminate\\Database\\Seeder;
use App\\Models\\Menu;
use Spatie\\Permission\\Models\\Role;
use Spatie\\Permission\\Models\\Permission;

class WeddingMenuSeeder extends Seeder
{
    public function run(): void
    {
        $menu = Menu::create([
            'title' => 'Wedding',
            'icon' => 'Heart',
            'route' => '/weddings',
            'order' => 10,
            'permission_name' => 'wedding-view',
        ]);

        Permission::firstOrCreate(['name' => 'wedding-view']);
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo('wedding-view');
        }

        $this->command->info('Wedding menu created successfully!');
    }
}
