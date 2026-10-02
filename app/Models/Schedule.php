<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shift_id',
        'tanggal',
        'is_off',
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'is_off' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * Check if it's a day off
     */
    public function isDayOff(): bool
    {
        return $this->is_off;
    }

    /**
     * Scope for user's schedule
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for specific date
     */
    public function scopeOnDate($query, $date)
    {
        return $query->whereDate('tanggal', $date);
    }

    /**
     * Scope for date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('tanggal', [$startDate, $endDate]);
    }

    /**
     * Get today's schedule for a user
     */
    public static function getTodayForUser($userId): ?self
    {
        return self::forUser($userId)
            ->onDate(Carbon::today())
            ->with('shift')
            ->first();
    }

    /**
     * Get schedule for a specific date for a user
     */
    public static function getForUserOnDate($userId, Carbon $date): ?self
    {
        return self::forUser($userId)
            ->onDate($date)
            ->with('shift')
            ->first();
    }
}
