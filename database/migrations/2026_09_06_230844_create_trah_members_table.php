<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trah_members', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            
            // No Registrasi
            $table->string('no_registrasi')->nullable();
            
            // Field Silsilah
            $table->string('trah_tumerah')->nullable();
            $table->string('menya_menya')->nullable();
            $table->string('menyaman')->nullable();
            $table->string('ampleng')->nullable();
            $table->string('cumpleng')->nullable();
            $table->string('giyeng')->nullable();
            $table->string('cendheng')->nullable();
            $table->string('gropak_waton')->nullable();
            $table->string('galih_asem')->nullable();
            $table->string('debok_bosok')->nullable();
            $table->string('gropak_senthe')->nullable();
            $table->string('gantung_siwur')->nullable();
            $table->string('udheg_udheg')->nullable();
            $table->string('wareng')->nullable();
            $table->string('canggah')->nullable();
            $table->string('buyut')->nullable();
            $table->string('simbah_eyang')->nullable();
            $table->string('bapak_ibu')->nullable();
            
            // Field Identitas
            $table->string('nama_anda')->required();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->text('alamat')->nullable();
            $table->string('profesi_pekerjaan')->nullable();
            $table->string('no_telphone')->nullable();
            $table->string('email')->nullable();
            
            // Field File
            $table->string('foto_pas')->nullable();
            $table->string('file_dokumen')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trah_members');
    }
};
