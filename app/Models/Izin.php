<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Izin extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tipe',
        'tanggal_mulai',
        'tanggal_selesai',
        'alasan',
        'status',
        'approved_by',
        'approved_at',
        'catatan_approval',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'approved_at' => 'datetime',
    ];

    public const TIPE_IZIN = 'izin';
    public const TIPE_CUTI = 'cuti';
    public const TIPE_SAKIT = 'sakit';
    public const TIPE_DINAS = 'dinas';

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get total days of leave
     */
    public function getTotalDaysAttribute(): int
    {
        return $this->tanggal_mulai->diffInDays($this->tanggal_selesai) + 1;
    }

    /**
     * Check if leave overlaps with given date
     */
    public function overlapsWithDate(Carbon $date): bool
    {
        return $date->between($this->tanggal_mulai, $this->tanggal_selesai);
    }

    /**
     * Check if leave is still valid
     */
    public function isValid(): bool
    {
        return $this->status === self::STATUS_APPROVED &&
               $this->tanggal_selesai->gte(Carbon::today());
    }

    /**
     * Scope for pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for approved requests
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope for user's requests
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for active in date range
     */
    public function scopeActiveInRange($query, $startDate, $endDate)
    {
        return $query->where(function ($q) use ($startDate, $endDate) {
            $q->whereBetween('tanggal_mulai', [$startDate, $endDate])
              ->orWhereBetween('tanggal_selesai', [$startDate, $endDate])
              ->orWhere(function ($q2) use ($startDate, $endDate) {
                  $q2->where('tanggal_mulai', '<=', $startDate)
                     ->where('tanggal_selesai', '>=', $endDate);
              });
        });
    }

    /**
     * Get array of dates covered by this leave
     */
    public function getDateRange(): array
    {
        $dates = [];
        $current = $this->tanggal_mulai->copy();

        while ($current->lte($this->tanggal_selesai)) {
            $dates[] = $current->copy();
            $current->addDay();
        }

        return $dates;
    }

    /**
     * Check if specific date is covered by this leave
     */
    public function coversDate(Carbon $date): bool
    {
        return $date->betweenIncluded($this->tanggal_mulai, $this->tanggal_selesai);
    }
}
