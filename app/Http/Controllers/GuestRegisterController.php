<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tamu;
use App\Models\WaSetting;
use App\Models\Acara;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\ShortLink;
use Illuminate\Support\Str;
class GuestRegisterController extends Controller
{
    public function show($token)
    {
        $tamu = Tamu::with('acara')->where("token", $token)->first();

        if (!$tamu) {
            return Inertia::render("register/Index", [
                "error" => "Link tidak valid",
                "event" => null,
                "tamu" => null,
                "token" => $token,
                "sudahKonfirmasi" => false
            ]);
        }

        // Tentukan apakah tamu sudah konfirmasi (status_hadir terisi dan bukan 'belum')
        $sudahKonfirmasi = !empty($tamu->status_hadir) && $tamu->status_hadir !== 'belum';

        return Inertia::render("register/Index", [
            "error" => null,
            "event" => $tamu->acara,
            "tamu" => $tamu,
            "token" => $token,
            "sudahKonfirmasi" => $sudahKonfirmasi
        ]);
    }
    public function store(Request $request)
    {
        $token = $request->input("token");
        $tamu = Tamu::with('acara')->where("token", $token)->first();
        if (!$tamu) {
            return response()->json(["success" => false, "message" => "Tamu tidak ditemukan"], 404);
        }
        $request->validate([
            'status_hadir' => 'required|in:hadir,tidak_hadir',
        ]);
        $tamu->update(['status_hadir' => $request->input('status_hadir')]);

        if ($tamu->status_hadir === 'hadir' && !empty($tamu->no_telepon)) {
            $this->sendWhatsApp($tamu);
        }

        return response()->json(["success" => true, "message" => "Konfirmasi berhasil", "tamu" => $tamu]);
    }

    private function sendWhatsApp($tamuUtama)
    {
        $setting = WaSetting::where('is_active', true)->first();
        if (!$setting) {
            return;
        }

        $acara = $tamuUtama->acara ?? Acara::find($tamuUtama->acara_id);
        $target = $this->formatPhone($tamuUtama->no_telepon ?? '');
        if (empty($target)) {
            return;
        }

        $formatTanggal = $acara && $acara->tanggal ? date('F d, Y', strtotime($acara->tanggal)) : 'October 30, 2026';
        $waktu = $acara ? $acara->waktu_mulai : '16:00';
        $lokasiNama = $acara ? ($acara->tempat ?? 'Jakarta') : 'Jakarta';

        // Nama penyelenggara acara
        $namaPenyelenggara = ($acara && !empty($acara->nama_perusahaan)) ? $acara->nama_perusahaan : "PAI";

        // Link Utama Website Event
        $mainWebsiteUrl = "https://event.paidesign.com";
        $mapsUrl = "https://bit.ly/4dhZHw3";

        // --- GENERATE LINK GOOGLE CALENDAR ---
        // 1. Ambil tanggal bersih (hanya ambil 10 karakter pertama: YYYY-MM-DD)
        $rawTanggal = ($acara && !empty($acara->tanggal)) ? $acara->tanggal : '2026-11-01';
        $tanggalAcara = substr($rawTanggal, 0, 10); // Hasil dijamin '2026-11-01'

        // 2. Ambil waktu mulai yang bersih (format HH:MM atau HH:MM:SS)
        $rawWaktu = ($acara && !empty($acara->waktu_mulai)) ? $acara->waktu_mulai : '10:16:00';
        $waktuMulai = strlen($rawWaktu) >= 5 ? substr($rawWaktu, 0, 8) : '10:16:00';

        // 3. Buat timestamp mulai dan selesai dengan aman
        $startTimestamp = strtotime("$tanggalAcara $waktuMulai");
        $endTimestamp = $startTimestamp + (3 * 3600); // Ditambah 3 jam (dalam detik)

        $startDateTime = date('Ymd\THis', $startTimestamp);
        $endDateTime = date('Ymd\THis', $endTimestamp);

        $eventTitle = urlencode(($namaPenyelenggara ?? 'Event') . "'s 40th Anniversary");
        $eventLocation = urlencode($lokasiNama ?? 'Jakarta');
        $eventDetails = urlencode("E-Ticket Token: " . $tamuUtama->token . "\nKunjungi website event: " . ($mainWebsiteUrl ?? '#'));

        // $calendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text={$eventTitle}&dates={$startDateTime}/{$endDateTime}&details={$eventDetails}&location={$eventLocation}";

        $calendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text={$eventTitle}&dates={$startDateTime}/{$endDateTime}&details={$eventDetails}&location={$eventLocation}";

        // Buat Short Link untuk Calendar agar pesan WhatsApp tidak terlalu panjang
        $shortCalendarCode = Str::random(6);
        ShortLink::create([
            'code' => $shortCalendarCode,
            'url_asli' => $calendarUrl,
        ]);
        $shortCalendarUrl = url('/s/' . $shortCalendarCode);
        // 1. Buat folder penyimpanan sementara secara fisik di public/qrcodes
        $destinationDir = public_path('qrcodes');
        if (!file_exists($destinationDir)) {
            mkdir($destinationDir, 0755, true);
        }

        $fileName = 'eticket_' . $tamuUtama->token . '.png';
        $filePath = $destinationDir . '/' . $fileName;

        // Ambil gambar dari API QR generator lalu simpan sebagai file fisik `.png` di server
        $qrExternalUrl = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" . urlencode($tamuUtama->token) . "&format=png";

        try {
            $imageContent = @file_get_contents($qrExternalUrl);
            if ($imageContent) {
                file_put_contents($filePath, $imageContent);
            }
        } catch (\Exception $e) {
            Log::error("Gagal mendownload QR image: " . $e->getMessage());
        }

        // ==========================================
        // 2. SUSUN PESAN LENGKAP BESERTA LINK UTAMA WEBSITE
        // ==========================================
        $waktuBersih = substr($waktu, 0, 5);

        $captionFull = "Thank you, *" . $tamuUtama->nama . "*!\n";
        $captionFull .= "Your RSVP has been confirmed.\n\n";
        $captionFull .= "🎫 *E-TICKET QR CODE*\n";
        $captionFull .= "Please show the barcode above when checking in at the event venue.\n\n";
        $captionFull .= "Name : " . $tamuUtama->nama . "\n";
        $captionFull .= "Token : " . $tamuUtama->token . "\n\n";
        $captionFull .= "📅 " . $formatTanggal . "\n";
        $captionFull .= "🕒 " . $waktuBersih . " - 18:00 WIB\n\n";
        $captionFull .= "We look forward to welcoming you at " . $namaPenyelenggara . "'s 40th Anniversary Celebration!\n\n";
        // $captionFull .= "🌐 Website Event: " . $mainWebsiteUrl . "\n";
        // $captionFull .= "📍 Location: " . $lokasiNama . "\n";
        $captionFull .= "🔗 Open Map: " . $mapsUrl . "\n";
        $captionFull .= "📆 Add to Calendar: " . $shortCalendarUrl;

        // ==========================================
        // 3. KIRIM SEKALIGUS (GAMBAR + KAPTION) VIA CURLFILE
        // ==========================================
        try {
            if (file_exists($filePath)) {
                $ch = curl_init();
                curl_setopt_array($ch, [
                    CURLOPT_URL => 'https://api.fonnte.com/send',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => [
                        'target' => $target,
                        'message' => $captionFull,
                        'file' => new \CURLFile($filePath, 'image/png', $fileName)
                    ],
                    CURLOPT_HTTPHEADER => ['Authorization: ' . $setting->api_token],
                    CURLOPT_TIMEOUT => 60,
                ]);
                $response = curl_exec($ch);
                curl_close($ch);
                Log::info("Fonnte Send Response: " . $response);

                // Hapus file fisik setelah berhasil terkirim
                @unlink($filePath);
            } else {
                Log::error("File QR fisik tidak ditemukan di path: " . $filePath);
            }
        } catch (\Exception $e) {
            Log::error("WA Send Error: " . $e->getMessage());
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }
    }

    private function formatPhone($phone)
    {
        if (empty($phone))
            return '';
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        } elseif (substr($phone, 0, 2) !== '62') {
            $phone = '62' . $phone;
        }
        return $phone;
    }
}
