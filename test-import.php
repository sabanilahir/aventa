<?php
require 'vendor/autoload.php';

$f = 'public/template/template_import_tamu.xlsx';
if (file_exists($f)) {
    $s = \PhpOffice\PhpSpreadsheet\IOFactory::load($f)->getActiveSheet();
    echo "A1: " . $s->getCell("A1")->getValue() . "\n";
    echo "B1: " . $s->getCell("B1")->getValue() . "\n";
    echo "C1: " . $s->getCell("C1")->getValue() . "\n";
    echo "Rows: " . $s->getHighestRow() . "\n";
} else {
    echo "File not found: $f\n";
}
