<?php
file_put_contents('app/Http/Controllers/GuestSettingController.php', '<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GuestSettingController extends Controller
{
    public function edit()
    {
        $setting = \App\Models\SettingApp::first();
        return \Inertia\Inertia::render("GuestSetting", ["setting" => $setting]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            "nama_app" => "required|string|max:255",
            "deskripsi" => "nullable|string",
            "logo" => "nullable|file|image|max:2048",
            "favicon" => "nullable|file|image|max:1024",
            "warna" => "nullable|string|max:20",
        ]);

        $setting = \App\Models\SettingApp::firstOrNew();

        if ($request->hasFile("logo")) {
            $data["logo"] = $request->file("logo")->store("logo", "public");
        } else {
            unset($data["logo"]);
        }

        if ($request->hasFile("favicon")) {
            $data["favicon"] = $request->file("favicon")->store("favicon", "public");
        } else {
            unset($data["favicon"]);
        }

        $setting->fill($data)->save();
        return redirect()->back()->with("success", "Pengaturan berhasil disimpan.");
    }
}
');
echo "Controller updated\n";
