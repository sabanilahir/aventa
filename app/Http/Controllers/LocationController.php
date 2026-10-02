<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display list of locations
     */
    public function index()
    {
        $locations = Location::orderBy('nama')->paginate(10);

        return Inertia::render('locations/index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Store new location
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:10|max:1000',
            'is_active' => 'boolean',
        ]);

        Location::create($validated);

        return redirect()->back()->with('success', 'Lokasi berhasil ditambahkan');
    }

    /**
     * Update location
     */
    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:10|max:1000',
            'is_active' => 'boolean',
        ]);

        $location->update($validated);

        return redirect()->back()->with('success', 'Lokasi berhasil diperbarui');
    }

    /**
     * Delete location
     */
    public function destroy(Location $location)
    {
        // Check if location is in use
        if ($location->presensis()->exists()) {
            return redirect()->back()->with('error', 'Lokasi tidak dapat dihapus karena sudah digunakan');
        }

        $location->delete();

        return redirect()->back()->with('success', 'Lokasi berhasil dihapus');
    }
}

