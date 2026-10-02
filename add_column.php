<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
Illuminate\Support\Facades\Schema::table('tamus', function (Illuminate\Database\Schema\Blueprint $table) {
    $table->string('token', 64)->nullable();
});
echo "Done - column added";
