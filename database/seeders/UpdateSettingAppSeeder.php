<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\SettingApp;
class UpdateSettingAppSeeder extends Seeder
{
    public function run(): void
    {
        $setting = SettingApp::first();
        if ($setting) {
            $setting->update([
                'nama_app' => 'Sistem Undangan',
                'deskripsi' => 'Sistem Manajemen Undangan Pernikahan',
                'warna' => '#0ea5e9',
            ]);
            echo "SettingApp updated to: " . $setting->nama_app . "\n";
        } else {
            echo "No SettingApp found\n";
        }
    }
}
