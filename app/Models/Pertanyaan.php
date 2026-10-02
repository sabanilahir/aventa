<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pertanyaan extends Model
{
    protected $fillable = [
        'pertanyaan',
        'tipe',
        'options',
        'is_required',
        'urutan',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function jawaban(): HasMany
    {
        return $this->hasMany(JawabanTamu::class, 'pertanyaan_id');
    }

    public function getOptionsArrayAttribute()
    {
        return $this->options ? json_decode($this->options, true) : [];
    }
}
