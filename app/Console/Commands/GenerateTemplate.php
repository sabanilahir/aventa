<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;

class GenerateTemplate extends Command
{
    protected $signature = "trah:template";
    protected $description = "Generate template Excel for Trah members";

    public function handle()
    {
        $s = new Spreadsheet();
        $sh = $s->getActiveSheet();
        $headers = ["No. Registrasi","Trah Tumerah","Menya-Menya","Menyaman","Ampleng","Cumpleng","Giyeng","Cendheng","Gropak Waton","Galih Asem","Debok Bosok","Gropak Senthe","Gantung Siwur","Udheg-Udheg","Wareng","Canggah","Buyut","Simbah/Eyang","Bapak/Ibu","Nama Anda","Tempat Lahir","Tanggal Lahir","Alamat","Profesi/Pekerjaan","No. Telepon","Email"];
        $col = "A";
        foreach ($headers as $v) { $sh->setCellValue($col . "1", $v); $col++; }
        foreach (range("A", "Z") as $c) { $sh->getColumnDimension($c)->setAutoSize(true); }
        $sh->getStyle("A1:Z1")->applyFromArray(["font" => ["bold" => true]]);
        $w = IOFactory::createWriter($s, "Xlsx");
        $w->save(public_path("template_import_anggota_trah.xlsx"));
        $this->info("Template created: " . filesize(public_path("template_import_anggota_trah.xlsx")) . " bytes");
    }
}
