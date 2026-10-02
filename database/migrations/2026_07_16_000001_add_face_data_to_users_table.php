<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('face_descriptor')->nullable()->after('email');
            $table->string('face_photo')->nullable()->after('face_descriptor');
            $table->boolean('face_registered')->default(false)->after('face_photo');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['face_descriptor', 'face_photo', 'face_registered']);
        });
    }
};
