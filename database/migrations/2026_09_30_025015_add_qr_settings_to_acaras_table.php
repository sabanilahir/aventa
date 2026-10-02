<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('acara', function (Blueprint $table) {
            if (!Schema::hasColumn('acara', 'qr_per_keluarga')) {
                $table->integer('qr_per_keluarga')->default(4)->after('alamat');
            }
            if (!Schema::hasColumn('acara', 'wa_template')) {
                $table->text('wa_template')->nullable()->after('qr_per_keluarga');
            }
        });
    }

    public function down(): void
    {
        Schema::table('acara', function (Blueprint $table) {
            if (Schema::hasColumn('acara', 'qr_per_keluarga')) {
                $table->dropColumn('qr_per_keluarga');
            }
            if (Schema::hasColumn('acara', 'wa_template')) {
                $table->dropColumn('wa_template');
            }
        });
    }
};
