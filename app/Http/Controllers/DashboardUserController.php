<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use Inertia\Inertia;

class DashboardUserController extends Controller
{
    public function index()
    {
        $acaraList = Acara::orderBy('created_at', 'desc')->get(['id', 'nama', 'tanggal']);
        
        $acaraId = request('acara_id');
        $acara = $acaraId ? Acara::find($acaraId) : Acara::first();
        
        if (!$acara) {
            return Inertia::render('dashboard', [
                'stats' => [
                    'total_tamu' => 0,
                    'total_pax' => 0,
                    'akan_datang' => 0,
                    'pax_akan_datang' => 0,
                    'tidak_hadir' => 0,
                    'pax_tidak_hadir' => 0,
                    'checked_in' => 0,
                    'pax_checked_in' => 0,
                ],
                'acara' => null,
                'acaraList' => $acaraList,
            ]);
        }
        
        $stats = [
            'total_tamu' => $acara->tamu()->count(),
            'total_pax' => $acara->tamu()->sum('jumlah_undangan'),
            'akan_datang' => $acara->tamu()->where('status_hadir', 'belum')->count(),
            'pax_akan_datang' => $acara->tamu()->where('status_hadir', 'belum')->sum('jumlah_undangan'),
            'tidak_hadir' => $acara->tamu()->where('status_hadir', 'tidak_hadir')->count(),
            'pax_tidak_hadir' => $acara->tamu()->where('status_hadir', 'tidak_hadir')->sum('jumlah_undangan'),
            'checked_in' => $acara->tamu()->where('status_hadir', 'hadir')->count(),
            'pax_checked_in' => $acara->tamu()->where('status_hadir', 'hadir')->sum('jumlah_undangan'),
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

