<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tamu_qrcodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tamu_id')->constrained('tamus')->onDelete('cascade');
            $table->integer('qr_number');
            $table->string('unique_code', 64);
            $table->string('qr_content', 255);
            $table->boolean('is_used')->default(false);
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
            
            $table->unique(['tamu_id', 'qr_number']);
            $table->index('unique_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tamu_qrcodes');
    }
};
