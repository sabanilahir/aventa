<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    /**
     * Display list of shifts
     */
    public function index()
    {
        $shifts = Shift::orderBy('jam_masuk')->get();

        return Inertia::render('presensi/shifts/index', [
            'shifts' => $shifts,
        ]);
    }

    /**
     * Store new shift
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_pulang' => 'required|date_format:H:i|after:jam_masuk',
            'jam_masuk_break' => 'nullable|date_format:H:i',
            'jam_selesai_break' => 'nullable|date_format:H:i|after:jam_masuk_break',
            'warna' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        Shift::create($validated);

        return redirect()->back()->with('success', 'Shift berhasil ditambahkan');
    }

    /**
     * Update shift
     */
    public function update(Request $request, Shift $shift)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jam_masuk' => 'required|date_format:H:i',
            'jam_pulang' => 'required|date_format:H:i|after:jam_masuk',
            'jam_masuk_break' => 'nullable|date_format:H:i',
            'jam_selesai_break' => 'nullable|date_format:H:i|after:jam_masuk_break',
            'warna' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $shift->update($validated);

        return redirect()->back()->with('success', 'Shift berhasil diperbarui');
    }

    /**
     * Delete shift
     */
    public function destroy(Shift $shift)
    {
        // Check if shift is in use
        if ($shift->schedules()->exists() || $shift->presensis()->exists()) {
            return redirect()->back()->with('error', 'Shift tidak dapat dihapus karena sudah digunakan');
        }

        $shift->delete();

        return redirect()->back()->with('success', 'Shift berhasil dihapus');
    }
}

