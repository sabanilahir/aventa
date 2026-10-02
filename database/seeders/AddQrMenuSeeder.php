<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Menu;
class AddQrMenuSeeder extends Seeder
{
    public function run(): void
    {
        Menu::firstOrCreate(
            ["route" => "qr.index"],
            [
                "title" => "QR Codes",
                "icon" => "QrCode",
                "order" => 15,
            ]
        );
        echo "Menu QR Codes ditambahkan\n";
    }
}
