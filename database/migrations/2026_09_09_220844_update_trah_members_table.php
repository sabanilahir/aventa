<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trah_members', function (Blueprint $table) {
            $table->dropColumn('tanggal_lahir');
            $table->renameColumn('tempat_lahir', 'tempat_tanggal_lahir');
        });
    }

    public function down(): void
    {
        Schema::table('trah_members', function (Blueprint $table) {
            $table->renameColumn('tempat_tanggal_lahir', 'tempat_lahir');
            $table->date('tanggal_lahir')->nullable();
        });
    }
};
