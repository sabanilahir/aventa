<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meja extends Model
{
    protected $fillable = [
        'acara_id',
        'nama',
        'kapasitas',
        'lokasi',
    ];

    public function acara(): BelongsTo
    {
        return $this->belongsTo(Acara::class, 'acara_id');
    }

    public function mejaTamu(): HasMany
    {
        return $this->hasMany(MejaTamu::class, 'meja_id');
    }
}
