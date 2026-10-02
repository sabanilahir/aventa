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

        if (!$acara) {
            return Inertia::render('Dashboard', [
                'stats' => null,
                'acara' => null,
                'acaraList' => Acara::all(),
            ]);
        }

        $tamuQuery = Tamu::where('acara_id', $acara->id);

        // Total seluruh tamu & pax
        $totalTamu = (clone $tamuQuery)->count();
        $totalPax = (clone $tamuQuery)->sum('jumlah_undangan') ?: $totalTamu;

        // Sudah Hadir (Hanya yang status_hadir = 'hadir' / 'checked_in')
        $sudahHadirQuery = (clone $tamuQuery)->where('status_hadir', 'hadir');
        $sudahHadir = $sudahHadirQuery->count();
        $paxSudahHadir = $sudahHadirQuery->sum('jumlah_undangan') ?: $sudahHadir;

        // Belum Hadir (Total - Sudah Hadir)
        $belumHadir = $totalTamu - $sudahHadir;
        $paxBelumHadir = $totalPax - $paxSudahHadir;

        $stats = [
            'total_tamu'      => $totalTamu,
            'total_pax'       => $totalPax,
            'sudah_hadir'     => $sudahHadir,
            'pax_sudah_hadir' => $paxSudahHadir,
            'belum_hadir'     => max(0, $belumHadir),
            'pax_belum_hadir' => max(0, $paxBelumHadir),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'acara' => $acara,
            'acaraList' => Acara::orderBy('created_at', 'desc')->get(),
        ]);
    }
}
