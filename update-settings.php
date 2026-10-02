<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

// Update settings directly in database
DB::table('settings')->updateOrInsert(
    ['key' => 'app_name'],
    ['value' => 'Sistem Presensi', 'created_at' => now(), 'updated_at' => now()]
);

DB::table('settings')->updateOrInsert(
    ['key' => 'app_description'],
    ['value' => 'Aplikasi Presensi Karyawan', 'created_at' => now(), 'updated_at' => now()]
);

echo "App settings updated!\n";
echo "App Name: Sistem Presensi\n";
echo "Description: Aplikasi Presensi Karyawan\n";
