<?php

namespace App\Http\Controllers;

use App\Models\Tamu;
use App\Models\TamuQrcode;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class QrCodeController extends Controller
{
    public function index(Request $request)
    {
        $acaraId = $request->acara_id ?? Tamu::first()?->acara_id;
        
        $tamus = Tamu::where('acara_id', $acaraId)
            ->withCount('qrcodes')
            ->orderBy('nama')
            ->paginate(20);
        
        return inertia('guest/qr/Index', [
            'tamus' => $tamus,
            'acaraId' => $acaraId,
        ]);
    }

    public function generateForTamu(Tamu $tamu)
    {
        $qrcodes = TamuQrcode::generateFor($tamu);
        
        return back()->with('success', 'QR Codes berhasil di-generate untuk ' . $tamu->nama);
    }

    public function generateAll(Request $request)
    {
        $acaraId = $request->acara_id;
        
        $tamus = Tamu::where('acara_id', $acaraId)->get();
        $count = 0;
        
        foreach ($tamus as $tamu) {
            TamuQrcode::generateFor($tamu);
            $count++;
        }
        
        return back()->with('success', 'QR Codes berhasil di-generate untuk ' . $count . ' tamu');
    }

    public function getQrcodes(Tamu $tamu)
    {
        $qrcodes = TamuQrcode::where('tamu_id', $tamu->id)->get();
        
        if ($qrcodes->isEmpty()) {
            $qrcodes = TamuQrcode::generateFor($tamu);
        }
        
        $baseUrl = config('app.url');
        
        $qrcodesData = $qrcodes->map(function($qr) use ($baseUrl, $tamu) {
            // Generate QR as base64
            $qrImage = QrCode::format('png')
                ->size(300)
                ->margin(2)
                ->generate($qr->qr_content);
            
            $base64 = 'data:image/png;base64,' . base64_encode($qrImage);
            
            return [
                'id' => $qr->id,
                'qr_number' => $qr->qr_number,
                'qr_content' => $qr->qr_content,
                'qr_image' => $base64,
                'download_url' => $baseUrl . '/qr/download/' . $tamu->id . '?qr=' . $qr->qr_number,
                'is_used' => $qr->is_used,
            ];
        });
        
        return response()->json([
            'success' => true,
            'tamu' => $tamu,
            'qrcodes' => $qrcodesData,
        ]);
    }

    public function download(Tamu $tamu, Request $request)
    {
        $qrNumber = $request->qr;
        
        $qrcode = TamuQrcode::where('tamu_id', $tamu->id)
            ->when($qrNumber, function($q) use ($qrNumber) {
                return $q->where('qr_number', $qrNumber);
            })
            ->first();
        
        if (!$qrcode) {
            $qrcodes = TamuQrcode::generateFor($tamu);
            $qrcode = $qrcodes[0];
        }
        
        // Generate QR image
        $qrImage = QrCode::format('png')
            ->size(400)
            ->margin(3)
            ->generate($qrcode->qr_content);
        
        // Create image with name
        $img = Image::make($qrImage);
        
        // Add text below QR
        $img->text($tamu->nama, $img->width() / 2, $img->height() + 20, function($font) {
            $font->size(24);
            $font->color('#000000');
            $font->align('center');
        });
        
        return $img->response('png');
    }

    public function verify(Request $request)
    {
        $code = $request->code;
        
        $qrcode = TamuQrcode::where('qr_content', $code)
            ->orWhere('unique_code', $code)
            ->with('tamu.acara')
            ->first();
        
        if (!$qrcode) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code tidak valid',
            ], 404);
        }
        
        if ($qrcode->is_used) {
            return response()->json([
                'success' => false,
                'message' => 'QR Code sudah digunakan pada ' . $qrcode->used_at->format('d/m/Y H:i'),
                'tamu' => $qrcode->tamu,
            ], 400);
        }
        
        // Mark as used
        $qrcode->update([
            'is_used' => true,
            'used_at' => now(),
        ]);
        
        // Update status tamu
        $qrcode->tamu->update(['status_hadir' => 'hadir']);
        
        return response()->json([
            'success' => true,
            'message' => 'Check-in berhasil!',
            'tamu' => $qrcode->tamu,
            'qr_number' => $qrcode->qr_number,
        ]);
    }
}

