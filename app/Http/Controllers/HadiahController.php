<?php

namespace App\Http\Controllers;

use App\Models\HadiahTamu;
use App\Models\Tamu;
use Illuminate\Http\Request;

class HadiahController extends Controller
{
    public function index(Request $request)
    {
        $query = HadiahTamu::with('tamu');
        
        if ($request->status === 'diterima') {
            $query->where('status', true);
        } elseif ($request->status === 'belum') {
            $query->where('status', false);
        }
        
        $hadiah = $query->orderBy('created_at', 'desc')->paginate(20);
        
        return view('guest.hadiah.index', compact('hadiah'));
    }

    public function store(Request $request, Tamu $tamu)
    {
        $data = $request->validate([
            'nama_hadiah' => 'required|string|max:255',
            'jumlah' => 'nullable|integer|min:1',
            'keterangan' => 'nullable|string',
        ]);
        
        $data['tamu_id'] = $tamu->id;
        
        HadiahTamu::create($data);
        
        return back()->with('success', 'Hadiah berhasil ditambahkan');
    }

    public function update(Request $request, HadiahTamu $hadiah)
    {
        $hadiah->update([
            'status' => !$hadiah->status,
            'waktu_diterima' => $hadiah->status ? null : now(),
        ]);
        
        return back()->with('success', 'Status hadiah diupdate');
    }

    public function destroy(HadiahTamu $hadiah)
    {
        $hadiah->delete();
        return back()->with('success', 'Hadiah dihapus');
    }
}

