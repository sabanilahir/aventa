<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$s = App\Models\WaSetting::first();
if ($s) {
    $s->api_token = 'b17UyHhYNrBYz92TWGYm';
    $s->is_active = 1;
    $s->save();
    echo "Token updated to: " . $s->api_token . "\n";
    echo "Active: " . ($s->is_active ? "Yes" : "No") . "\n";
} else {
    echo "No WaSetting found\n";
}
