<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Acara;
class AcaraSeeder extends Seeder
{
    public function run(): void
    {
        if (Acara::count() == 0) {
            Acara::create([
                'nama' => 'Undangan Pernikahan',
                'tanggal' => now()->addDays(30)->toDateString(),
                'waktu_mulai' => '10:00:00',
                'waktu_selesai' => '14:00:00',
                'tempat' => 'ÃƒÆ’Ã‚Â¥Ãƒâ€šÃ‚Â¾ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¥Ãƒâ€šÃ‚Â®Ãƒâ€¦Ã‚Â¡',
                'alamat' => 'ÃƒÆ’Ã‚Â¥Ãƒâ€šÃ‚Â¾ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¥Ãƒâ€šÃ‚Â®Ãƒâ€¦Ã‚Â¡',
            ]);
        }
    }
}
