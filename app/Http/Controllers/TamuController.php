<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use App\Models\Pertanyaan;
use App\Models\JawabanTamu;
use App\Models\Tamu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TamuController extends Controller
{
    public function index(Request $request)
    {
        $acara = $request->acara_id ? Acara::find($request->acara_id) : (Acara::Default()->first() ?? Acara::first());
        $query = Tamu::with(["acara"])->whereNull("parent_id");
        if ($acara) { $query->where("acara_id", $acara->id); }
        if ($request->search) { $query->where("nama", "like", "%" . $request->search . "%"); }
        if ($request->status) { $query->where("status_hadir", $request->status); }
        $tamu = $query->orderBy("nama")->get();
        return Inertia::render("guest/tamu/Index", ["tamu" => $tamu, "acara" => $acara, "acaras" => \App\Models\Acara::orderBy("nama")->get()]);
    }

    public function create()
    {
        $acara = Acara::Default()->first() ?? Acara::first();
        $pertanyaans = Pertanyaan::orderBy("urutan")->get();
        return Inertia::render("guest/tamu/Create", ["acara" => $acara, "pertanyaans" => $pertanyaans]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "nama_depan" => "nullable|string|max:100",
            "nama_belakang" => "nullable|string|max:100",
            "nama_perusahaan" => "nullable|string|max:200",
            "email" => "nullable|email",
            "no_telepon" => "nullable|string|max:20",
            "jumlah_undangan" => "nullable|integer|min:1",
            "catatan" => "nullable|string",
            "jawaban" => "nullable|array",
        ]);
        
        $acara = $request->acara_id ? Acara::find($request->acara_id) : (Acara::Default()->first() ?? Acara::first());
        if (!$acara) {
            return back()->with("error", "Tidak ada acara yang dipilih");
        }
        
        // Gabung nama depan + belakang
        $namaDepan = trim($data["nama_depan"] ?? "");
        $namaBelakang = trim($data["nama_belakang"] ?? "");
        $data["nama"] = trim($namaDepan . " " . $namaBelakang);
        
        $data["acara_id"] = $acara->id;
        $data["token"] = Str::random(32);

        DB::beginTransaction();
        try {
            $tamu = Tamu::create($data);
            if (isset($data["jawaban"])) {
                foreach ($data["jawaban"] as $pertanyaanId => $jawaban) {
                    if ($jawaban) { JawabanTamu::create(["tamu_id" => $tamu->id, "pertanyaan_id" => $pertanyaanId, "jawaban" => $jawaban]); }
                }
            }
            DB::commit();
            return redirect()->route("guest.tamu.index")->with("success", "Tamu berhasil ditambahkan");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with("error", "Gagal menyimpan tamu: " . $e->getMessage());
        }
    }

    public function edit(Tamu $tamu)
    {
        $pertanyaans = Pertanyaan::orderBy("urutan")->get();
        $tamu->load("jawaban");
        return Inertia::render("guest/tamu/Edit", ["tamu" => $tamu, "pertanyaans" => $pertanyaans]);
    }

    public function update(Request $request, Tamu $tamu)
    {
        $data = $request->validate([
            "nama_depan" => "nullable|string|max:100",
            "nama_belakang" => "nullable|string|max:100",
            "nama_perusahaan" => "nullable|string|max:200",
            "email" => "nullable|email",
            "no_telepon" => "nullable|string|max:20",
            "jumlah_undangan" => "nullable|integer|min:1",
            "catatan" => "nullable|string",
            "jawaban" => "nullable|array",
        ]);

        // Gabung nama depan + belakang
        $namaDepan = trim($data["nama_depan"] ?? "");
        $namaBelakang = trim($data["nama_belakang"] ?? "");
        $data["nama"] = trim($namaDepan . " " . $namaBelakang);

        DB::beginTransaction();
        try {
            $tamu->update($data);
            $tamu->jawaban()->delete();
            if (isset($data["jawaban"])) {
                foreach ($data["jawaban"] as $pertanyaanId => $jawaban) {
                    if ($jawaban) { JawabanTamu::create(["tamu_id" => $tamu->id, "pertanyaan_id" => $pertanyaanId, "jawaban" => $jawaban]); }
                }
            }
            DB::commit();
            return redirect()->route("guest.tamu.index")->with("success", "Tamu berhasil diupdate");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with("error", "Gagal update tamu: " . $e->getMessage());
        }
    }

    public function destroy(Tamu $tamu)
    {
        $tamu->delete();
        return redirect()->route("guest.tamu.index")->with("success", "Tamu berhasil dihapus");
    }

    public function checkin(Request $request, Tamu $tamu)
    {
        $tamu->update(["status_hadir" => $request->status_hadir ?: "hadir"]);
        return response()->json(["success" => true]);
    }

    public function export()
    {
        return response()->download(storage_path("app/exports/tamu.xlsx"));
    }
}



