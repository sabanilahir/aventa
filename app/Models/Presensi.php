<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Presensi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'jam_masuk',
        'jam_pulang',
        'status',
        'shift_id',
        'location_id',
        'latitude_masuk',
        'longitude_masuk',
        'latitude_pulang',
        'longitude_pulang',
        'foto_masuk',
        'foto_pulang',
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam_masuk' => 'datetime:H:i',
        'jam_pulang' => 'datetime:H:i',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Check if user is late based on shift schedule
     */
    public function isLate(): bool
    {
        if (!$this->shift || !$this->jam_masuk) {
            return false;
        }

        $shiftMasuk = Carbon::parse($this->shift->jam_masuk);
        $actualMasuk = Carbon::parse($this->jam_masuk);

        return $actualMasuk->gt($shiftMasuk);
    }

    /**
     * Calculate late duration in minutes
     */
    public function getLateMinutesAttribute(): int
    {
        if (!$this->isLate() || !$this->shift) {
            return 0;
        }

        $shiftMasuk = Carbon::parse($this->shift->jam_masuk);
        $actualMasuk = Carbon::parse($this->jam_masuk);

        return $shiftMasuk->diffInMinutes($actualMasuk);
    }

    /**
     * Calculate early leave duration in minutes
     */
    public function getEarlyLeaveMinutesAttribute(): int
    {
        if (!$this->shift || !$this->jam_pulang) {
            return 0;
        }

        $shiftPulang = Carbon::parse($this->shift->jam_pulang);
        $actualPulang = Carbon::parse($this->jam_pulang);

        if ($actualPulang->lt($shiftPulang)) {
            return $shiftPulang->diffInMinutes($actualPulang);
        }

        return 0;
    }

    /**
     * Calculate total work duration in hours
     */
    public function getWorkHoursAttribute(): float
    {
        if (!$this->jam_masuk || !$this->jam_pulang) {
            return 0;
        }

        $masuk = Carbon::parse($this->jam_masuk);
        $pulang = Carbon::parse($this->jam_pulang);

        // Handle overnight shifts
        if ($pulang->lt($masuk)) {
            $pulang->addDay();
        }

        $minutes = $masuk->diffInMinutes($pulang);

        // Subtract break time if exists
        if ($this->shift && $this->shift->jam_masuk_break && $this->shift->jam_selesai_break) {
            $breakMasuk = Carbon::parse($this->shift->jam_masuk_break);
            $breakSelesai = Carbon::parse($this->shift->jam_selesai_break);
            $breakMinutes = $breakMasuk->diffInMinutes($breakSelesai);
            $minutes -= $breakMinutes;
        }

        return round($minutes / 60, 2);
    }

    /**
     * Check if user has checked in
     */
    public function hasCheckIn(): bool
    {
        return !empty($this->jam_masuk);
    }

    /**
     * Check if user has checked out
     */
    public function hasCheckOut(): bool
    {
        return !empty($this->jam_pulang);
    }

    /**
     * Scope for today's attendance
     */
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', Carbon::today());
    }

    /**
     * Scope for attendance in date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('tanggal', [$startDate, $endDate]);
    }

    /**
     * Scope for specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
