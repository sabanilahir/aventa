<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Acara extends Model
{
    protected $table = "acara";

    protected $fillable = [
        "nama",
        "tanggal",
        "waktu_mulai",
        "waktu_selesai",
        "tempat",
        "alamat",
        "deskripsi",
        "gambar",
        "status",
        "qr_per_keluarga",
        "wa_template",
        "video_url", // 👉 Tambahkan baris ini agar video bisa disimpan
    ];

    protected $casts = [
        "tanggal" => "date",
    ];

    public function tamu(): HasMany
    {
        return $this->hasMany(Tamu::class, "acara_id");
    }

    public function meja(): HasMany
    {
        return $this->hasMany(Meja::class, "acara_id");
    }

    // Ambil event yang aktif (bukan archived)
    public function scopeNotArchived($query)
    {
        return $query->where("status", "!=", "archived");
    }

    // Ambil event default (paling awal atau sesuai kebutuhan)
    public function scopeDefault($query)
    {
        return $query->where("status", "!=", "archived")->orderBy("id", "desc")->limit(1);
    }
}
