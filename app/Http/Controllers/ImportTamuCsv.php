<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tamu;
use App\Models\Acara;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ImportTamuCsv extends Controller
{
    public function showForm(Request $request)
    {
        $acaras = Acara::where("status", "!=", "archived")->orderBy("id", "desc")->get();
        return Inertia::render("guest/tamu/Import", [
            "acaras" => $acaras,
            "acaraId" => $request->query("acara_id", "")
        ]);
    }

    public function processCsv(Request $request)
    {
        $request->validate([
            "acara_id" => "required|exists:acara,id",
            "file" => "required|mimes:csv,txt|max:10240",
        ]);

        try {
            $acaraId = $request->acara_id;
            $file = $request->file("file");
            $created = 0;
            $rowNum = 0;

            $handle = fopen($file->getRealPath(), "r");

            while (($data = fgetcsv($handle)) !== false) {
                $rowNum++;
                if ($rowNum == 1) continue; // Lewati header

                // Pastikan baris tidak kosong total
                if (empty(array_filter($data))) continue;

                $nama       = trim($data[0] ?? "");
                $perusahaan = trim($data[1] ?? "");
                $rawPhone   = trim($data[2] ?? "");

                if (empty($nama)) {
                    throw new \Exception("Baris ke-$rowNum: Kolom 'nama_tamu' kosong.");
                }

                $phone = preg_replace("/[^0-9]/", "", $rawPhone);
                if (empty($phone) || strlen($phone) < 8) {
                    throw new \Exception("Baris ke-$rowNum (Tamu: $nama): Nomor WhatsApp/Telepon tidak valid ('$rawPhone'). Minimal 8 angka.");
                }

                $nameParts = explode(" ", $nama, 2);
                $namaDepan = $nameParts[0];
                $namaBelakang = $nameParts[1] ?? "";

                $token = Str::random(32);

                Tamu::create([
                    "acara_id" => $acaraId,
                    "nama" => $nama,
                    "nama_depan" => $namaDepan,
                    "nama_belakang" => $namaBelakang,
                    "nama_perusahaan" => $perusahaan,
                    "no_telepon" => $phone,
                    "jumlah_undangan" => 1,
                    "status_hadir" => "belum",
                    "token" => $token,
                ]);
                $created++;
            }
            fclose($handle);

            if ($created === 0) {
                return back()->withErrors(["file" => "File CSV kosong atau tidak ada data valid yang terbaca."]);
            }

            return back()->with([
                "message" => "Import berhasil! $created tamu ditambahkan.",
                "imported_count" => $created
            ]);

        } catch (\Exception $e) {
            // Catat log detail ke storage/logs/laravel.log
            Log::error("Gagal Import CSV Detail: " . $e->getMessage());

            // Kembalikan pesan error spesifik ke frontend
            return back()->withErrors(["file" => "Error Debug: " . $e->getMessage()]);
        }
    }
}
