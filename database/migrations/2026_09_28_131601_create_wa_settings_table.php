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
        Schema::create('wa_settings', function (Blueprint $table) {
            $table->id();
            $table->string('api_token', 255);
            $table->string('sender_number', 20);
            $table->string('device_id', 100)->nullable();
            $table->string('webhook_url', 255)->nullable();
            $table->boolean('is_active')->default(false);
            $table->boolean('is_test_mode')->default(true);
            $table->integer('rate_limit_per_second')->default(1);
            $table->integer('retry_attempts')->default(3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wa_settings');
    }
};