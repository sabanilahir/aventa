<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SouvenirTamu extends Model
{
    protected $table = 'souvenir_tamu';

    protected $fillable = [
        'tamu_id',
        'nama_souvenir',
        'jumlah',
        'diberikan',
        'waktu_diberikan',
    ];

    protected $casts = [
        'diberikan' => 'boolean',
        'waktu_diberikan' => 'datetime',
    ];

    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class, 'tamu_id');
    }
}
