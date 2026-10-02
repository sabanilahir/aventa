<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use Illuminate\Http\Request;

class AcaraController extends Controller
{
    public function index()
    {
        $acara = Acara::orderBy('tanggal', 'desc')->paginate(20);
        
        return view('guest.acara.index', compact('acara'));
    }

    public function create()
    {
        return view('guest.acara.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:200',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'nullable',
            'tempat' => 'nullable|string|max:200',
            'alamat' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);
        
        $data['is_active'] = $request->has('is_active');
        
        if ($data['is_active']) {
            Acara::where('id', '!=', 0)->update(['is_active' => false]);
        }
        
        Acara::create($data);
        
        return redirect()->route('guest.acara.index')->with('success', 'Acara berhasil ditambahkan');
    }

    public function show(Acara $acara)
    {
        $acara->load(['tamu', 'meja']);
        
        return view('guest.acara.show', compact('acara'));
    }

    public function edit(Acara $acara)
    {
        return view('guest.acara.edit', compact('acara'));
    }

    public function update(Request $request, Acara $acara)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:200',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_selesai' => 'nullable',
            'tempat' => 'nullable|string|max:200',
            'alamat' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);
        
        $data['is_active'] = $request->has('is_active');
        
        if ($data['is_active']) {
            Acara::where('id', '!=', $acara->id)->update(['is_active' => false]);
        }
        
        $acara->update($data);
        
        return redirect()->route('guest.acara.show', $acara)->with('success', 'Acara berhasil diupdate');
    }

    public function destroy(Acara $acara)
    {
        $acara->delete();
        return redirect()->route('guest.acara.index')->with('success', 'Acara dihapus');
    }

    public function setActive(Acara $acara)
    {
        Acara::where('id', '!=', $acara->id)->update(['is_active' => false]);
        $acara->update(['is_active' => true]);
        
        return back()->with('success', 'Acara aktif diubah');
    }
}

