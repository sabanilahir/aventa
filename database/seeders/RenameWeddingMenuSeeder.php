<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Menu;
class RenameWeddingMenuSeeder extends Seeder
{
    public function run(): void
    {
        $menu = Menu::where("title", "Wedding")->first();
        if ($menu) {
            $menu->update(["title" => "Events", "route" => "events.index"]);
            echo "Menu Wedding renamed to Events\n";
        } else {
            Menu::firstOrCreate(
                ["route" => "events.index"],
                ["title" => "Events", "icon" => "Calendar", "order" => 10]
            );
            echo "Menu Events created\n";
        }
    }
}
