<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HadiahTamu extends Model
{
    protected $table = 'hadiah_tamu';

    protected $fillable = [
        'tamu_id',
        'nama_hadiah',
        'jumlah',
        'keterangan',
        'status',
        'waktu_diterima',
    ];

    protected $casts = [
        'status' => 'boolean',
        'waktu_diterima' => 'datetime',
    ];

    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class, 'tamu_id');
    }
}
