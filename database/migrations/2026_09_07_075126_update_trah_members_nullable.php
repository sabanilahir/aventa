<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("trah_members", function (Blueprint $table) {
            $table->string("nama_anda")->nullable()->default("")->change();
            $table->string("tempat_lahir")->nullable()->default("")->change();
            $table->string("tanggal_lahir")->nullable()->default("")->change();
            $table->string("alamat")->nullable()->default("")->change();
            $table->string("profesi_pekerjaan")->nullable()->default("")->change();
            $table->string("no_telphone")->nullable()->default("")->change();
            $table->string("email")->nullable()->default("")->change();
        });
    }

    public function down(): void
    {
        Schema::table("trah_members", function (Blueprint $table) {
            $table->string("nama_anda")->nullable(false)->change();
            $table->string("tempat_lahir")->nullable(false)->change();
            $table->string("tanggal_lahir")->nullable(false)->change();
            $table->string("alamat")->nullable(false)->change();
            $table->string("profesi_pekerjaan")->nullable(false)->change();
            $table->string("no_telphone")->nullable(false)->change();
            $table->string("email")->nullable(false)->change();
        });
    }
};
