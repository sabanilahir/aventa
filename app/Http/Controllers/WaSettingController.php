<?php

namespace App\Http\Controllers;

use App\Models\WaSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WaSettingController extends Controller
{
    public function index()
    {
        $setting = WaSetting::first();
        return inertia('wa-settings/Index', [
            'waSetting' => $setting ? [
                'id' => $setting->id,
                'api_token' => $setting->api_token ? '***' . substr($setting->api_token, -4) : '',
                'sender_number' => $setting->sender_number,
                'device_id' => $setting->device_id,
                'webhook_url' => $setting->webhook_url,
                'is_active' => $setting->is_active,
                'is_test_mode' => $setting->is_test_mode,
                'rate_limit_per_second' => $setting->rate_limit_per_second,
                'retry_attempts' => $setting->retry_attempts,
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'api_token' => 'required|string|max:255',
            'sender_number' => 'required|string|max:20',
            'device_id' => 'nullable|string|max:100',
            'webhook_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'is_test_mode' => 'boolean',
            'rate_limit_per_second' => 'integer|min:1|max:10',
            'retry_attempts' => 'integer|min:1|max:5',
        ]);

        $setting = WaSetting::first();
        
        // Jika token di-masker (dimulai ***), jangan update token
        $apiTokenInput = $validated['api_token'] ?? '';
        if (strpos($apiTokenInput, '***') === 0) {
            unset($validated['api_token']);
        }
        
        // Jika diaktifkan, nonaktifkan yang lain
        $isActive = $validated['is_active'] ?? false;
        if ($isActive) {
            WaSetting::where('id', '!=', $setting->id ?? 0)->update(['is_active' => false]);
        }

        if ($setting) { 
            $setting->update($validated); 
        } else { 
            WaSetting::create($validated); 
        }

        return redirect()->back()->with('success', 'Pengaturan WhatsApp berhasil disimpan');
    }

    public function testConnection(Request $request)
    {
        $request->validate(['api_token' => 'required|string']);
        $apiToken = $request->api_token;

        if (strpos($apiToken, '***') === 0) {
            $setting = WaSetting::first();
            if (!$setting || !$setting->api_token) {
                return response()->json(['success' => false, 'message' => 'API Token tidak ditemukan'], 400);
            }
            $apiToken = $setting->api_token;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $apiToken,
                'Accept' => 'application/json',
            ])->timeout(15)->post('https://api.fonnte.com/device');

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => 'Koneksi Fonnte Berhasil! Device: ' . ($data['device'] ?? 'Unknown'),
                    'data' => $data,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $data['reason'] ?? 'API Token tidak valid',
            ], 401);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function testSend(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string|max:1000',
        ]);

        $setting = WaSetting::getActive();

        if (!$setting || !$setting->api_token) {
            return response()->json(['success' => false, 'message' => 'Pengaturan WA belum lengkap'], 400);
        }

        try {
            $phone = preg_replace('/[^0-9]/', '', $request->phone);
            if (substr($phone, 0, 1) === '0') { $phone = '62' . substr($phone, 1); }
            if (substr($phone, 0, 2) !== '62') { $phone = '62' . $phone; }

            $response = Http::withHeaders([
                'Authorization' => $setting->api_token,
                'Accept' => 'application/json',
            ])->timeout(30)->post('https://api.fonnte.com/send', [
                'target' => $phone,
                'message' => $request->message,
            ]);

            $data = $response->json();

            if ($response->successful() && isset($data['status']) && $data['status'] === true) {
                return response()->json([
                    'success' => true,
                    'message' => 'Pesan berhasil dikirim!',
                    'data' => $data,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $data['reason'] ?? 'Gagal mengirim pesan',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal: ' . $e->getMessage(),
            ]);
        }
    }
}
