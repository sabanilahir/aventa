<?php

namespace App\Http\Controllers;

use App\Models\SouvenirTamu;
use App\Models\Tamu;
use Illuminate\Http\Request;

class SouvenirController extends Controller
{
    public function index(Request $request)
    {
        $query = SouvenirTamu::with('tamu');
        
        if ($request->status === 'diberikan') {
            $query->where('diberikan', true);
        } elseif ($request->status === 'belum') {
            $query->where('diberikan', false);
        }
        
        $souvenir = $query->orderBy('created_at', 'desc')->paginate(20);
        
        return view('guest.souvenir.index', compact('souvenir'));
    }

    public function store(Request $request, Tamu $tamu)
    {
        $data = $request->validate([
            'nama_souvenir' => 'required|string|max:255',
            'jumlah' => 'nullable|integer|min:1',
        ]);
        
        $data['tamu_id'] = $tamu->id;
        
        SouvenirTamu::create($data);
        
        return back()->with('success', 'Souvenir berhasil ditambahkan');
    }

    public function update(Request $request, SouvenirTamu $souvenir)
    {
        $souvenir->update([
            'diberikan' => !$souvenir->diberikan,
            'waktu_diberikan' => $souvenir->diberikan ? null : now(),
        ]);
        
        return back()->with('success', 'Status souvenir diupdate');
    }

    public function destroy(SouvenirTamu $souvenir)
    {
        $souvenir->delete();
        return back()->with('success', 'Souvenir dihapus');
    }
}

