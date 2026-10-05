<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('acara', function (Blueprint $table) {
            // Menambahkan kolom video_url setelah kolom gambar
            $table->string('video_url')->nullable()->after('gambar');
        });
    }

    public function down(): void
    {
        Schema::table('acara', function (Blueprint $table) {
            $table->dropColumn('video_url');
        });
    }
};
