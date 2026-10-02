<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Tamu;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GuestRegisterController extends Controller
{
    public function show($token)
    {
        $tamu = Tamu::where("token", $token)->first();
        if (!$tamu) {
            return Inertia::render("register/Index", [
                "error" => "Link tidak valid",
                "event" => null,
                "tamu" => null,
                "token" => $token
            ]);
        }
        $tamuTambahanExisting = Tamu::where("parent_id", $tamu->id)->get();
        $sisaSlot = max(0, 3 - $tamuTambahanExisting->count());
        return Inertia::render("register/Index", [
            "error" => null,
            "event" => $tamu->acara,
            "tamu" => $tamu,
            "tamuTambahanExisting" => $tamuTambahanExisting,
            "token" => $token,
            "sisaSlot" => $sisaSlot
        ]);
    }

    public function store(Request $request)
    {
        try {
            $token = $request->input("token");
            $tamu = Tamu::where("token", $token)->first();
            if (!$tamu) {
                return response()->json(["success" => false, "message" => "Data tamu utama tidak ditemukan"], 404);
            }

            $tamuList = $request->input("tamu_tambahan", []);
            if (empty($tamuList)) {
                return response()->json(["success" => false, "message" => "Data kosong"], 400);
            }

            $sisa = 3 - Tamu::where("parent_id", $tamu->id)->count();
            if (count($tamuList) > $sisa) {
                return response()->json(["success" => false, "message" => "Maksimal 3 tamu tambahan"], 400);
            }

            $barus = [];
            foreach ($tamuList as $d) {
                $namaDepan = trim($d["nama_depan"] ?? "");
                $namaBelakang = trim($d["nama_belakang"] ?? "");
                $nama = trim($namaDepan . " " . $namaBelakang);
                
                $barus[] = Tamu::create([
                    "acara_id" => $tamu->acara_id,
                    "parent_id" => $tamu->id,
                    "nama" => $nama,
                    "nama_depan" => $namaDepan,
                    "nama_belakang" => $namaBelakang,
                    "nama_perusahaan" => $tamu->nama_perusahaan,
                    "no_telepon" => $d["no_telepon"] ?? null,
                    "jumlah_undangan" => 1,
                    "status_hadir" => "hadir",
                    "token" => Str::random(32)
                ]);
            }

            return response()->json([
                "success" => true,
                "message" => "Berhasil",
                "tamu_tambahan" => $barus
            ]);
        } catch (\Exception $e) {
            return response()->json(["success" => false, "message" => "Error: " . $e->getMessage()], 500);
        }
    }
}
