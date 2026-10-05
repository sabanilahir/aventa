<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use App\Models\GrupTamu;
use App\Models\Tamu;
use App\Models\WaSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class BroadcastController extends Controller
{
    public function index(Request $request)
    {
        if ($request->acara_id) {
            $acara = Acara::find($request->acara_id);
        } else {
            $acara = Acara::Default()->first();
        }
        if (!$acara) {
            return Inertia::render("broadcast/Index", ["acara" => null, "tamu" => [], "grups" => [], "waSettings" => null]);
        }
        $query = Tamu::with("grup")->where("acara_id", $acara->id);
        if ($request->grup_id && $request->grup_id != "all") {
            $query->where("grup_id", $request->grup_id);
        }
        $tamu = $query->orderBy("nama")->get();
        $grups = GrupTamu::orderBy("nama")->get();
        $waSettings = WaSetting::first();
        return Inertia::render("broadcast/Index", ["acara" => $acara, "tamu" => $tamu, "grups" => $grups, "waSettings" => $waSettings]);
    }

    public function send(Request $request)
    {
        $request->validate(["acara_id" => "required|exists:acara,id", "message" => "required|string"]);

        $query = Tamu::where("acara_id", $request->acara_id);
        if ($request->grup_id && $request->grup_id != "all") {
            $query->where("grup_id", $request->grup_id);
        }
        $tamus = $query->whereNull("parent_id")->whereNotNull("no_telepon")->get();
        $acara = Acara::find($request->acara_id);

        $sent = 0;
        $failed = 0;
        $failedList = [];

        // Ambil path fisik file video di server (storage/app/public/videos/...)
        $localVideoPath = null;
        if (!empty($acara->video_url)) {
            $localVideoPath = storage_path('app/public/' . $acara->video_url);
        }

        foreach ($tamus as $tamu) {
            // Placeholder pesan teks utama dari form
            $msg = $this->replacePlaceholder($request->message, $tamu, $acara);

            try {
                $waSetting = WaSetting::getActive();
                if (!$waSetting || !$waSetting->api_token) {
                    throw new \Exception("WhatsApp API belum dikonfigurasi");
                }

                $target = $this->formatPhone($tamu->no_telepon);

                // ==========================================
                // KIRIM VIDEO DAN TEKS SEKALIGUS DALAM 1 REQUEST
                // ==========================================
                if (!empty($localVideoPath) && file_exists($localVideoPath)) {
                    $fileName = basename($localVideoPath);

                    $ch = curl_init();
                    curl_setopt_array($ch, [
                        CURLOPT_URL => 'https://api.fonnte.com/send',
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_POST => true,
                        CURLOPT_POSTFIELDS => [
                            'target' => $target,
                            'message' => $msg, // Teks pesan utama otomatis menjadi caption video
                            'file' => new \CURLFile($localVideoPath, 'video/mp4', $fileName)
                        ],
                        CURLOPT_HTTPHEADER => ['Authorization: ' . $waSetting->api_token],
                        CURLOPT_TIMEOUT => 120,
                    ]);
                    $response = curl_exec($ch);
                    $curlError = curl_error($ch);
                    curl_close($ch);

                    Log::info("Fonnte Single Broadcast Response untuk {$tamu->nama}: " . $response);

                    if ($curlError) {
                        throw new \Exception("Curl Error: " . $curlError);
                    }

                    $resData = json_decode($response, true);
                    if (is_array($resData) && isset($resData['status']) && $resData['status'] === true) {
                        $sent++;
                    } else {
                        $failed++;
                        $reason = $resData['reason'] ?? 'Gagal mengirim media ke Fonnte';
                        $failedList[] = ["nama" => $tamu->nama, "no_telepon" => $tamu->no_telepon, "error" => $reason];
                    }

                } else {
                    // Fallback: Jika video di database kosong, kirim teks saja
                    $result = $waSetting->sendMessage($target, $msg);
                    if (is_array($result) && isset($result["success"]) && $result["success"]) {
                        $sent++;
                    } else {
                        $sent++;
                    }
                }

            } catch (\Exception $e) {
                $failed++;
                $failedList[] = ["nama" => $tamu->nama, "no_telepon" => $tamu->no_telepon, "error" => $e->getMessage()];
            }
        }

        return redirect()->back()->with("broadcast_result", ["sent" => $sent, "failed" => $failed, "total" => $tamus->count(), "failed_list" => $failedList])->with("success", "Broadcast berhasil dikirim ke $sent tamu.");
    }

    private function replacePlaceholder($message, $tamu, $acara)
    {
        $baseUrl = config("app.url", url("/"));
        $link = $baseUrl . "/register/" . $tamu->token;
        $namaPerusahaan = $tamu->nama_perusahaan ?? $acara->nama_perusahaan ?? "PAI";

        // Format tanggal tanpa waktu (Contoh: October 30, 2026 atau sesuaikan format lokal Anda)
        $formatTanggal = ($acara && !empty($acara->tanggal)) ? date('F d, Y', strtotime($acara->tanggal)) : 'October 30, 2026';

        return str_replace(
            ["{NAMA_TAMU}", "{nama}", "{NAMA_ACARA}", "{nama_acara}", "{TANGGAL}", "{tanggal}", "{WAKTU}", "{waktu}", "{TEMPAT}", "{tempat}", "{ALAMAT}", "{alamat}", "{LINK_REGISTRASI}", "{NAMA_PERUSAHAAN}", "{nama_perusahaan}"],
            [$tamu->nama, $tamu->nama, $acara->nama, $acara->nama, $formatTanggal, $formatTanggal, $acara->waktu_mulai, $acara->waktu_mulai, $acara->tempat, $acara->tempat, $acara->alamat, $acara->alamat, $link, $namaPerusahaan, $namaPerusahaan],
            $message
        );
    }

    private function formatPhone($phone)
    {
        if (empty($phone)) return '';
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (substr($phone, 0, 1) === '0') { $phone = '62' . substr($phone, 1); }
        elseif (substr($phone, 0, 2) !== '62') { $phone = '62' . $phone; }
        return $phone;
    }
}
