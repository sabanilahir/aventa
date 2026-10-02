<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrupTamu extends Model
{
    protected $table = 'grup_tamu';

    protected $fillable = [
        'nama',
        'warna',
        'urutan',
    ];

    public function tamu(): HasMany
    {
        return $this->hasMany(Tamu::class, 'grup_id');
    }
}
