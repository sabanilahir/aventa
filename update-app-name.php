<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// Update all related settings
DB::table('settings')->where('key', 'app_name')->update(['value' => 'Sistem Presensi']);
DB::table('settings')->where('key', 'company_name')->update(['value' => 'Sistem Presensi']);
DB::table('settings')->where('key', 'app_title')->update(['value' => 'Sistem Presensi']);
DB::table('settings')->where('key', 'site_title')->update(['value' => 'Sistem Presensi']);
DB::table('settings')->where('key', 'title')->update(['value' => 'Sistem Presensi']);

// Insert if not exists
$keys = ['app_name', 'company_name', 'app_title', 'site_title', 'title'];
foreach ($keys as $key) {
    DB::table('settings')->updateOrInsert(
        ['key' => $key],
        ['value' => 'Sistem Presensi', 'created_at' => now(), 'updated_at' => now()]
    );
}

echo "All app name settings updated to 'Sistem Presensi'!\n";
