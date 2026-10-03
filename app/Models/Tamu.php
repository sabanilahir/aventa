<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tamu extends Model
{
    protected $fillable = [
        "acara_id",
        "nama",
        "nama_depan",
        "nama_belakang",
        "nama_perusahaan",
        "email",\n        "grup_id",
        "parent_id",
        "token",
        "no_telepon",
        "status_hadir",
        "waktu_hadir",
        "jumlah_undangan",
        "jumlah_hadir",
        "catatan",
    ];

    protected $casts = [
        "waktu_hadir" => "datetime",
    ];

    public function acara(): BelongsTo
    {
        return $this->belongsTo(Acara::class, "acara_id");
    }

    public function grup(): BelongsTo
    {
        return $this->belongsTo(GrupTamu::class, "grup_id");
    }

    public function jawaban(): HasMany
    {
        return $this->hasMany(JawabanTamu::class, "tamu_id");
    }
}
