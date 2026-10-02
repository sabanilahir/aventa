<?php

namespace App\Http\Controllers;

use App\Models\TrahSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TrahSettingsController extends Controller
{
    public function edit()
    {
        $settings = [
            'logo_organisasi' => TrahSetting::getValue('logo_organisasi'),
            'gambar_stempel' => TrahSetting::getValue('gambar_stempel'),
            'gambar_tanda_tangan' => TrahSetting::getValue('gambar_tanda_tangan'),
            'foto_panembahan' => TrahSetting::getValue('foto_panembahan'),
            'gambar_qr' => TrahSetting::getValue('gambar_qr'),
            'nama_tanda_tangan' => TrahSetting::getValue('nama_tanda_tangan'),
            'moto_organisasi' => TrahSetting::getValue('moto_organisasi'),
            'email_kontak' => TrahSetting::getValue('email_kontak'),
            'telepon_kontak' => TrahSetting::getValue('telepon_kontak'),
            'alamat_kantor' => TrahSetting::getValue('alamat_kantor'),
        ];
        return Inertia::render('trah/settings/Edit', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'logo_organisasi' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'gambar_stempel' => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'gambar_tanda_tangan' => 'nullable|image|mimes:png|max:1024',
            'foto_panembahan' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'gambar_qr' => 'nullable|image|mimes:png|max:512',
            'nama_tanda_tangan' => 'nullable|string|max:255',
            'moto_organisasi' => 'nullable|string|max:500',
            'email_kontak' => 'nullable|email|max:255',
            'telepon_kontak' => 'nullable|string|max:20',
            'alamat_kantor' => 'nullable|string|max:500',
        ]);

        $imageFields = ['logo_organisasi', 'gambar_stempel', 'gambar_tanda_tangan', 'foto_panembahan', 'gambar_qr'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $oldValue = TrahSetting::getValue($field);
                if ($oldValue) { Storage::disk('public')->delete($oldValue); }
                $file = $request->file($field);
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('trah-settings', $filename, 'public');
                TrahSetting::setValue($field, $path, 'image');
            }
        }

        $textFields = ['nama_tanda_tangan', 'moto_organisasi', 'email_kontak', 'telepon_kontak', 'alamat_kantor'];
        foreach ($textFields as $field) {
            if ($request->has($field)) { TrahSetting::setValue($field, $request->$field, 'text'); }
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan');
    }

    public function deleteImage(Request $request, $field)
    {
        $allowedFields = ['logo_organisasi', 'gambar_stempel', 'gambar_tanda_tangan', 'foto_panembahan', 'gambar_qr'];
        
        if (!in_array($field, $allowedFields)) {
            return response()->json(['success' => false, 'message' => 'Field tidak valid'], 400);
        }
        
        $value = TrahSetting::getValue($field);
        if ($value) {
            Storage::disk('public')->delete($value);
            TrahSetting::setValue($field, null, 'image');
        }
        
        return response()->json(['success' => true, 'message' => 'Gambar berhasil dihapus']);
    }
}