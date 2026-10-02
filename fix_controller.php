<?php
file_put_contents('app/Http/Controllers/GuestDashboardPageController.php', '<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use Inertia\Inertia;

class GuestDashboardPageController extends Controller
{
    public function index()
    {
        $acara = Acara::active()->first();
        $stats = [
            "total_tamu" => $acara ? $acara->tamu()->count() : 0,
            "tamu_hadir" => $acara ? $acara->tamu()->where("status_hadir", "hadir")->count() : 0,
            "tamu_belum" => $acara ? $acara->tamu()->where("status_hadir", "belum")->count() : 0,
            "total_meja" => $acara ? $acara->meja()->count() : 0,
            "total_hadiah" => 0,
            "total_souvenir" => 0,
        ];
        $recentTamu = [];
        return Inertia::render("GuestDashboard", ["acara" => null, "stats" => $stats, "recentTamu" => $recentTamu]);
    }
}
');
echo "Controller fixed\n";
