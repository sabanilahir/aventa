<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tamus', function (Blueprint $table) {
            // Tambah kolom baru
            $table->string('nama_depan', 100)->nullable()->after('nama');
            $table->string('nama_belakang', 100)->nullable()->after('nama_depan');
            $table->string('nama_perusahaan', 200)->nullable()->after('nama_belakang');
            
            // Hapus kolom lama
            $table->dropColumn(['label', 'grup_id']);
        });
    }

    public function down(): void
    {
        Schema::table('tamus', function (Blueprint $table) {
            $table->dropColumn(['nama_depan', 'nama_belakang', 'nama_perusahaan']);
            $table->string('label', 100)->nullable();
            $table->foreignId('grup_id')->nullable()->constrained('grup_tamu');
        });
    }
};
