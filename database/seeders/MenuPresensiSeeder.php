<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use Spatie\Permission\Models\Permission;

class MenuPresensiSeeder extends Seeder
{
    public function run(): void
    {
        // Presensi Menu
        $presensiMenu = Menu::firstOrCreate(
            ['route' => 'presensi.index'],
            [
                'title' => 'Presensi',
                'icon' => 'Clock',
                'parent_id' => null,
                'order' => 10,
                'permission_name' => 'view presensi',
            ]
        );

        // Child menus for presensi
        Menu::firstOrCreate(
            ['route' => 'presensi.index'],
            [
                'title' => 'Absen',
                'icon' => 'ClipboardCheck',
                'parent_id' => $presensiMenu->id,
                'order' => 1,
                'permission_name' => 'view presensi',
            ]
        );

        Menu::firstOrCreate(
            ['route' => 'izin.index'],
            [
                'title' => 'Izin & Cuti',
                'icon' => 'FileText',
                'parent_id' => $presensiMenu->id,
                'order' => 2,
                'permission_name' => 'view izin',
            ]
        );

        Menu::firstOrCreate(
            ['route' => 'schedule.index'],
            [
                'title' => 'Jadwal Shift',
                'icon' => 'Calendar',
                'parent_id' => $presensiMenu->id,
                'order' => 3,
                'permission_name' => 'view schedule',
            ]
        );

        // Admin Menu - Master Data
        $masterMenu = Menu::firstOrCreate(
            ['route' => 'shifts.index'],
            [
                'title' => 'Master Presensi',
                'icon' => 'Settings',
                'parent_id' => null,
                'order' => 20,
                'permission_name' => 'manage shifts',
            ]
        );

        Menu::firstOrCreate(
            ['route' => 'shifts.index'],
            [
                'title' => 'Shift Kerja',
                'icon' => 'Clock',
                'parent_id' => $masterMenu->id,
                'order' => 1,
                'permission_name' => 'manage shifts',
            ]
        );

        Menu::firstOrCreate(
            ['route' => 'locations.index'],
            [
                'title' => 'Lokasi Absen',
                'icon' => 'MapPin',
                'parent_id' => $masterMenu->id,
                'order' => 2,
                'permission_name' => 'manage locations',
            ]
        );

        // Admin Menu - Reports
        $reportsMenu = Menu::firstOrCreate(
            ['route' => 'presensi.admin.index'],
            [
                'title' => 'Laporan Presensi',
                'icon' => 'BarChart',
                'parent_id' => null,
                'order' => 25,
                'permission_name' => 'view reports',
            ]
        );

        Menu::firstOrCreate(
            ['route' => 'presensi.admin.index'],
            [
                'title' => 'Rekap Presensi',
                'icon' => 'List',
                'parent_id' => $reportsMenu->id,
                'order' => 1,
                'permission_name' => 'view reports',
            ]
        );

        Menu::firstOrCreate(
            ['route' => 'izin.admin.index'],
            [
                'title' => 'Approval Izin',
                'icon' => 'CheckCircle',
                'parent_id' => $reportsMenu->id,
                'order' => 2,
                'permission_name' => 'approve izin',
            ]
        );

        // Create permissions if not exists
        $permissions = [
            'view presensi',
            'view izin',
            'view schedule',
            'view reports',
            'manage shifts',
            'manage locations',
            'approve izin',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $this->command->info('Presensi menu seeders completed!');
    }
}
