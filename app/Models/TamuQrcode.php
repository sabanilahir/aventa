<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TamuQrcode extends Model
{
    protected $fillable = [
        'tamu_id',
        'qr_number',
        'unique_code',
        'qr_content',
        'is_used',
        'used_at',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'used_at' => 'datetime',
    ];

    public function tamu(): BelongsTo
    {
        return $this->belongsTo(Tamu::class);
    }

    public static function generateFor(Tamu $tamu): array
    {
        $acara = $tamu->acara;
        $qrCount = $acara->qr_per_keluarga ?? 4;
        $eventCode = strtoupper(substr(md5($acara->id), 0, 6));
        $token = strtoupper(substr(md5($tamu->id . time()), 0, 8));
        
        // Generate unique token untuk tamu ini
        if (!$tamu->token_unique) {
            $tamu->update(['token_unique' => $token]);
        }
        $token = $tamu->token_unique;
        
        $qrcodes = [];
        
        for ($i = 1; $i <= $qrCount; $i++) {
            $qrContent = $eventCode . '-' . $tamu->id . '-' . $token . '-' . $i;
            
            $qrcodes[] = self::updateOrCreate(
                [
                    'tamu_id' => $tamu->id,
                    'qr_number' => $i,
                ],
                [
                    'unique_code' => $token,
                    'qr_content' => $qrContent,
                ]
            );
        }
        
        return $qrcodes;
    }
}
