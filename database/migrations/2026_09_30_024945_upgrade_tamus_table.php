<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tamus', function (Blueprint $table) {
            if (!Schema::hasColumn('tamus', 'token_unique')) {
                $table->string('token_unique', 32)->nullable()->unique()->after('jumlah_hadir');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tamus', function (Blueprint $table) {
            if (Schema::hasColumn('tamus', 'token_unique')) {
                $table->dropColumn('token_unique');
            }
        });
    }
};
