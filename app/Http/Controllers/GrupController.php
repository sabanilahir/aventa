<?php

namespace App\Http\Controllers;

use App\Models\GrupTamu;
use Illuminate\Http\Request;

class GrupController extends Controller
{
    public function index()
    {
        $grup = GrupTamu::withCount('tamu')->orderBy('urutan')->get();
        
        return view('guest.grup.index', compact('grup'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:100',
            'warna' => 'nullable|string|max:20',
            'urutan' => 'nullable|integer',
        ]);
        
        GrupTamu::create($data);
        
        return back()->with('success', 'Grup berhasil ditambahkan');
    }

    public function update(Request $request, GrupTamu $grup)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:100',
            'warna' => 'nullable|string|max:20',
            'urutan' => 'nullable|integer',
        ]);
        
        $grup->update($data);
        
        return back()->with('success', 'Grup berhasil diupdate');
    }

    public function destroy(GrupTamu $grup)
    {
        if ($grup->tamu()->count() > 0) {
            return back()->with('error', 'Tidak bisa hapus grup yang sudah memiliki tamu');
        }
        
        $grup->delete();
        return back()->with('success', 'Grup dihapus');
    }
}

