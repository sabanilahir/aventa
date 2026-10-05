<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardUserController extends Controller
{
    public function index(Request $request)
    {
        $acaraList = Acara::orderBy('created_at', 'desc')->get(['id', 'nama', 'tanggal']);

        $acaraId = $request->input('acara_id');
        $acara = $acaraId ? Acara::find($acaraId) : Acara::first();

        if (!$acara) {
            return Inertia::render('dashboard', [
                'stats' => [
                    'total_tamu'       => 0,
                    'total_pax'        => 0,
                    'konfirmasi'       => 0,
                    'pax_konfirmasi'   => 0,
                    'belum'            => 0,
                    'pax_belum'        => 0,
                    'tidak_hadir'      => 0,
                    'pax_tidak_hadir'  => 0,
                    'hadir'            => 0,
                    'pax_hadir'        => 0,
                ],
                'acara' => null,
                'acaraList' => $acaraList,
            ]);
        }

        // Query dasar khusus Tamu Utama (parent_id NULL) agar konsisten
        $query = $acara->tamu()->whereNull('parent_id');

        $totalTamu = (clone $query)->count();
        $totalPax  = (clone $query)->sum('jumlah_undangan') ?: $totalTamu;

        // 1. Konfirmasi Hadir (status_hadir = 'hadir' & waktu_hadir NULL)
        $konfirmasiQuery = (clone $query)->where('status_hadir', 'hadir')->whereNull('waktu_hadir');
        $konfirmasi = $konfirmasiQuery->count();
        $paxKonfirmasi = $konfirmasiQuery->sum('jumlah_undangan') ?: $konfirmasi;

        // 2. Belum Konfirmasi (status_hadir = 'belum' atau NULL)
        $belumQuery = (clone $query)->where(function($q) {
            $q->where('status_hadir', 'belum')->orWhereNull('status_hadir');
        });
        $belum = $belumQuery->count();
        $paxBelum = $belumQuery->sum('jumlah_undangan') ?: $belum;

        // 3. Tidak Hadir (status_hadir = 'tidak_hadir')
        $tidakHadirQuery = (clone $query)->where('status_hadir', 'tidak_hadir');
        $tidakHadir = $tidakHadirQuery->count();
        $paxTidakHadir = $tidakHadirQuery->sum('jumlah_undangan') ?: $tidakHadir;

        // 4. Sudah Hadir / Scan (status_hadir = 'hadir' & waktu_hadir NOT NULL)
        $hadirQuery = (clone $query)->where('status_hadir', 'hadir')->whereNotNull('waktu_hadir');
        $hadir = $hadirQuery->count();
        $paxHadir = $hadirQuery->sum('jumlah_undangan') ?: $hadir;

        $stats = [
            'total_tamu'       => $totalTamu,
            'total_pax'        => $totalPax,
            'konfirmasi'       => $konfirmasi,
            'pax_konfirmasi'   => $paxKonfirmasi,
            'belum'            => $belum,
            'pax_belum'        => $paxBelum,
            'tidak_hadir'      => $tidakHadir,
            'pax_tidak_hadir'  => $paxTidakHadir,
            'hadir'            => $hadir,
            'pax_hadir'        => $paxHadir,
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'acara' => [
                'id' => $acara->id,
                'nama' => $acara->nama,
                'tanggal' => $acara->tanggal,
            ],
            'acaraList' => $acaraList,
        ]);
    }
}
