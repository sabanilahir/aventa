<?php

namespace App\Http\Controllers;

use App\Models\Pertanyaan;
use Illuminate\Http\Request;

class PertanyaanController extends Controller
{
    public function index()
    {
        $pertanyaan = Pertanyaan::orderBy('urutan')->get();
        
        return view('guest.pertanyaan.index', compact('pertanyaan'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'pertanyaan' => 'required|string|max:500',
            'tipe' => 'required|in:text,radio,checkbox,select',
            'options' => 'nullable|string',
            'is_required' => 'nullable|boolean',
            'urutan' => 'nullable|integer',
        ]);
        
        $data['is_required'] = $request->has('is_required');
        
        Pertanyaan::create($data);
        
        return back()->with('success', 'Pertanyaan berhasil ditambahkan');
    }

    public function update(Request $request, Pertanyaan $pertanyaan)
    {
        $data = $request->validate([
            'pertanyaan' => 'required|string|max:500',
            'tipe' => 'required|in:text,radio,checkbox,select',
            'options' => 'nullable|string',
            'is_required' => 'nullable|boolean',
            'urutan' => 'nullable|integer',
        ]);
        
        $data['is_required'] = $request->has('is_required');
        
        $pertanyaan->update($data);
        
        return back()->with('success', 'Pertanyaan berhasil diupdate');
    }

    public function destroy(Pertanyaan $pertanyaan)
    {
        $pertanyaan->delete();
        return back()->with('success', 'Pertanyaan dihapus');
    }
}

