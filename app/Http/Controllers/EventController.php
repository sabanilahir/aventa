<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Acara::orderBy('created_at', 'desc')->get();
        return Inertia::render('events/Index', ['events' => $events]);
    }

    public function create()
    {
        return Inertia::render('events/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal' => 'nullable|date',
            'waktu_mulai' => 'nullable',
            'tempat' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'qr_per_keluarga' => 'nullable|integer|min:1',
            'wa_template' => 'nullable|string',
        ]);

        $validated['status'] = 'draft';
        Acara::create($validated);

        return redirect('/events')->with('success', 'Event berhasil dibuat!');
    }

    public function show($id)
    {
        $acara = Acara::findOrFail($id);

        // Query langsung Tamu model
        $query = \App\Models\Tamu::where('acara_id', $id)->whereNull('parent_id');

        // Total
        $totalTamu = (clone $query)->count();
        $totalPax = (clone $query)->sum('jumlah_undangan');

        // Hadir (status=hadir DAN waktu_hadir ADA)
        $hadir = (clone $query)->where('status_hadir', 'hadir')->whereNotNull('waktu_hadir')->count();

        // Konfirmasi (status=hadir DAN waktu_hadir NULL)
        $konfirmasi = (clone $query)->where('status_hadir', 'hadir')->whereNull('waktu_hadir')->count();

        // Belum Hadir
        $belum = (clone $query)->where('status_hadir', 'belum')->count();

        // Tidak Hadir
        $tidakHadir = (clone $query)->where('status_hadir', 'tidak_hadir')->count();

        $stats = [
            'total_tamu' => $totalTamu,
            'total_pax' => $totalPax,
            'hadir' => $hadir,
            'konfirmasi' => $konfirmasi,
            'belum' => $belum,
            'tidak_hadir' => $tidakHadir,
        ];

        return Inertia::render('events/Show', [
            'acara' => $acara,
            'stats' => $stats
        ]);
    }

    public function edit($id)
    {
        $acara = Acara::findOrFail($id);
        return Inertia::render('events/Edit', ['acara' => $acara]);
    }

    public function update(Request $request, $id)
    {
        $acara = Acara::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal' => 'nullable|date',
            'waktu_mulai' => 'nullable',
            'tempat' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'qr_per_keluarga' => 'nullable|integer|min:1',
            'wa_template' => 'nullable|string',
            'status' => 'required|in:draft,active,completed,archived',
        ]);

        $acara->update($validated);

        return redirect()->back()->with('success', 'Event berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $acara = Acara::findOrFail($id);
        $acara->delete();

        return redirect('/events')->with('success', 'Event berhasil dihapus!');
    }
}
