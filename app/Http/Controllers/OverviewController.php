<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OverviewController extends Controller
{
    public function tamu()
    {
        $acara = \App\Models\Acara::Default()->first();
        $stats = [
            'total_tamu' => $acara ? $acara->tamu()->count() : 0,
            'total_pax' => $acara ? $acara->tamu()->sum('jumlah_undangan') : 0,
            'tamu_hadir' => $acara ? $acara->tamu()->where('status_hadir', 'hadir')->count() : 0,
            'pax_hadir' => $acara ? $acara->tamu()->where('status_hadir', 'hadir')->sum('jumlah_undangan') : 0,
            'tamu_belum' => $acara ? $acara->tamu()->where('status_hadir', 'belum')->count() : 0,
        ];
        return \Inertia\Inertia::render('GuestOverview', ['type' => 'tamu', 'stats' => $stats]);
    }

    public function meja()
    {
        $acara = \App\Models\Acara::Default()->first();
        $stats = [
            'total_meja' => $acara ? $acara->meja()->count() : 0,
            'total_kapasitas' => $acara ? $acara->meja()->sum('kapasitas') : 0,
        ];
        return \Inertia\Inertia::render('GuestOverview', ['type' => 'meja', 'stats' => $stats]);
    }

    //
}


