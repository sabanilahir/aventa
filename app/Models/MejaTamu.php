<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MejaTamu extends Model
{
    protected $table = 'meja_tamu';

    protected $fillable = [
        'tamu_id',
        'meja_id',
        'nomor_kursi',
    ];

    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class, 'tamu_id');
    }

    public function meja(): BelongsTo
    {
        return $this->belongsTo(Meja::class, 'meja_id');
    }
}
