<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use App\Models\GrupTamu;
use App\Models\Tamu;
use App\Models\WaSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        foreach ($tamus as $tamu) {
            $msg = $this->replacePlaceholder($request->message, $tamu, $acara);
            try {
                $waSetting = WaSetting::getActive();
                if (!$waSetting || !$waSetting->api_token) {
                    throw new \Exception("WhatsApp API belum dikonfigurasi");
                }
                $result = $waSetting->sendMessage($tamu->no_telepon, $msg);
                if ($result["success"]) { $sent++; } else {
                    $failed++;
                    $failedList[] = ["nama" => $tamu->nama, "no_telepon" => $tamu->no_telepon, "error" => $result["error"] ?? "Unknown error"];
                }
            } catch (\Exception $e) {
                $failed++;
                $failedList[] = ["nama" => $tamu->nama, "no_telepon" => $tamu->no_telepon, "error" => $e->getMessage()];
            }
        }
        return redirect()->back()->with("broadcast_result", ["sent" => $sent, "failed" => $failed, "total" => $tamus->count(), "failed_list" => $failedList])->with("success", "Pesan berhasil dikirim ke $sent tamu.");
    }

    private function replacePlaceholder($message, $tamu, $acara)
    {
        $baseUrl = config("app.url", url("/"));
        $link = $baseUrl . "/register/" . $tamu->token;
        return str_replace(
            ["{NAMA_TAMU}", "{nama}", "{NAMA_ACARA}", "{nama_acara}", "{TANGGAL}", "{tanggal}", "{WAKTU}", "{waktu}", "{TEMPAT}", "{tempat}", "{ALAMAT}", "{alamat}", "{LINK_REGISTRASI}"],
            [$tamu->nama, $tamu->nama, $acara->nama, $acara->nama, $acara->tanggal, $acara->tanggal, $acara->waktu_mulai, $acara->waktu_mulai, $acara->tempat, $acara->tempat, $acara->alamat, $acara->alamat, $link],
            $message
        );
    }
}


