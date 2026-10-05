<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use App\Models\Tamu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $acaraId = $request->acara_id;
        $acara = $acaraId ? Acara::find($acaraId) : (Acara::where('is_active', true)->first() ?? Acara::first());

        $acaraList = Acara::orderBy('created_at', 'desc')->get();

        if (!$acara) {
            return Inertia::render('Dashboard', [
                'stats' => null,
                'acara' => null,
                'acaraList' => $acaraList,
            ]);
        }

        // Gunakan query dasar khusus Tamu Utama (parent_id NULL) agar konsisten
        $query = $acara->tamus()->whereNull('parent_id');

        // Total seluruh tamu & pax
        $totalTamu = (clone $query)->count();
        $totalPax = (clone $query)->sum('jumlah_undangan') ?: $totalTamu;

        // 1. Sudah Hadir (Scan QR): status_hadir = 'hadir' DAN waktu_hadir NOT NULL
        $hadirQuery = (clone $query)->where('status_hadir', 'hadir')->whereNotNull('waktu_hadir');
        $hadir = $hadirQuery->count();
        $paxHadir = $hadirQuery->sum('jumlah_undangan') ?: $hadir;

        // 2. Konfirmasi Hadir (RSVP Web, Belum Scan): status_hadir = 'hadir' DAN waktu_hadir NULL
        $konfirmasiQuery = (clone $query)->where('status_hadir', 'hadir')
    ->where(function($q) {
        $q->whereNull('waktu_hadir')->orWhere('waktu_hadir', '');
    });
        $konfirmasi = $konfirmasiQuery->count();
        $paxKonfirmasi = $konfirmasiQuery->sum('jumlah_undangan') ?: $konfirmasi;

        // 3. Belum Konfirmasi: status_hadir = 'belum' atau NULL
        $belumQuery = (clone $query)->where(function($q) {
            $q->where('status_hadir', 'belum')->orWhereNull('status_hadir');
        });
        $belum = $belumQuery->count();
        $paxBelum = $belumQuery->sum('jumlah_undangan') ?: $belum;

        // 4. Tidak Hadir: status_hadir = 'tidak_hadir'
        $tidakHadirQuery = (clone $query)->where('status_hadir', 'tidak_hadir');
        $tidakHadir = $tidakHadirQuery->count();
        $paxTidakHadir = $tidakHadirQuery->sum('jumlah_undangan') ?: $tidakHadir;

        $stats = [
            'total_tamu'      => $totalTamu,
            'total_pax'       => $totalPax,
            'hadir'           => $hadir,
            'pax_hadir'       => $paxHadir,
            'konfirmasi'      => $konfirmasi,
            'pax_konfirmasi'  => $paxKonfirmasi,
            'belum'           => $belum,
            'pax_belum'       => $paxBelum,
            'tidak_hadir'     => $tidakHadir,
            'pax_tidak_hadir' => $paxTidakHadir,
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'acara' => $acara,
            'acaraList' => $acaraList,
        ]);
    }
}
