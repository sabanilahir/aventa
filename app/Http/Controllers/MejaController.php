<?php

namespace App\Http\Controllers;

use App\Models\Meja;
use App\Models\MejaTamu;
use App\Models\Acara;
use App\Models\Tamu;
use Illuminate\Http\Request;

class MejaController extends Controller
{
    public function index(Request $request)
    {
        $acara = Acara::Default()->first();
        
        $query = Meja::with('mejaTamu.tamu');
        
        if ($acara) {
            $query->where('acara_id', $acara->id);
        }
        
        $meja = $query->orderBy('nama')->paginate(20);
        
        return view('guest.meja.index', compact('meja', 'acara'));
    }

    public function create()
    {
        $acara = Acara::Default()->first();
        
        return view('guest.meja.create', compact('acara'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'acara_id' => 'required|exists:acara,id',
            'nama' => 'required|string|max:100',
            'kapasitas' => 'nullable|integer|min:1',
            'lokasi' => 'nullable|string',
        ]);
        
        Meja::create($data);
        
        return redirect()->route('guest.meja.index')->with('success', 'Meja berhasil ditambahkan');
    }

    public function show(Meja $meja)
    {
        $meja->load(['mejaTamu.tamu', 'acara']);
        
        return view('guest.meja.show', compact('meja'));
    }

    public function edit(Meja $meja)
    {
        return view('guest.meja.edit', compact('meja'));
    }

    public function update(Request $request, Meja $meja)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:100',
            'kapasitas' => 'nullable|integer|min:1',
            'lokasi' => 'nullable|string',
        ]);
        
        $meja->update($data);
        
        return redirect()->route('guest.meja.show', $meja)->with('success', 'Meja berhasil diupdate');
    }

    public function destroy(Meja $meja)
    {
        $meja->delete();
        return redirect()->route('guest.meja.index')->with('success', 'Meja dihapus');
    }

    public function assignTamu(Request $request, Meja $meja)
    {
        $request->validate([
            'tamu_id' => 'required|exists:tamu,id',
            'nomor_kursi' => 'nullable|integer',
        ]);
        
        MejaTamu::create([
            'meja_id' => $meja->id,
            'tamu_id' => $request->tamu_id,
            'nomor_kursi' => $request->nomor_kursi,
        ]);
        
        return back()->with('success', 'Tamu ditambahkan ke meja');
    }

    public function removeTamu(MejaTamu $mejaTamu)
    {
        $mejaTamu->delete();
        return back()->with('success', 'Tamu dihapus dari meja');
    }
}

