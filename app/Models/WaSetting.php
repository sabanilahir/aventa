<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class WaSetting extends Model
{
    protected $fillable = [
        'api_token',
        'sender_number',
        'device_id',
        'webhook_url',
        'is_active',
        'is_test_mode',
        'rate_limit_per_second',
        'retry_attempts',
    ];

    protected $hidden = [
        'api_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_test_mode' => 'boolean',
        'rate_limit_per_second' => 'integer',
        'retry_attempts' => 'integer',
    ];

    const FONTE_API_URL = 'https://api.fonnte.com';

    public function isConfigured(): bool
    {
        return $this->is_active && !empty($this->api_token);
    }

    public function sendMessage(string $target, string $message): array
    {
        if (!$this->isConfigured()) {
            throw new \Exception('WhatsApp settings belum dikonfigurasi');
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->api_token,
                'Accept' => 'application/json',
            ])->timeout(30)->post(self::FONTE_API_URL . '/send', [
                'target' => $this->formatPhoneNumber($target),
                'message' => $message,
            ]);

            $result = $response->json();

            if (!$response->successful()) {
                throw new \Exception($result['reason'] ?? 'Gagal mengirim pesan');
            }

            return [
                'success' => true,
                'message_id' => $result['id'] ?? null,
                'response' => $result,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function checkBalance(): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Settings belum dikonfigurasi'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->api_token,
            ])->timeout(10)->get(self::FONTE_API_URL . '/balance');

            $result = $response->json();

            return [
                'success' => $response->successful(),
                'balance' => $result['balance'] ?? 0,
                'expired' => $result['expired'] ?? null,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function checkDevice(): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Settings belum dikonfigurasi'];
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->api_token,
            ])->timeout(10)->post(self::FONTE_API_URL . '/device');

            $result = $response->json();

            return [
                'success' => $response->successful(),
                'data' => $result,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    private function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }

        if (substr($phone, 0, 2) !== '62') {
            $phone = '62' . $phone;
        }

        return $phone;
    }

    public static function getActive()
    {
        return self::where('is_active', true)->first();
    }
}
