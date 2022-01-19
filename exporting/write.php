<?php

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

require "vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(realpath(__DIR__ . '/../'));
$dotenv->load();

require "src/db.php";
require "src/columns.php";

if (php_sapi_name() !== 'cli') {
    echo 'Only support call from CLI';
    exit;
}

// Create new Spreadsheet object
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->setActiveSheetIndex(0);
$datas = new Worksheet($spreadsheet, 'Opsi');

/* header */
$sheet->setTitle('Data');
foreach ($columns as $key => $value) {
    $sheet->getCellByColumnAndRow($key + 1, 1)->setValue($value["header"]);
    $sheet->getColumnDimensionByColumn($key + 1)->setWidth($value["width"]);
    //$spreadsheet->getActiveSheet()->getColumnDimensionByColumn($key + 1)->setAutoSize(true);
}
/** @var Question $q */
$ii = 1;
foreach ($db->run("SELECT * FROM matriks") as $i => $q) {
    $ii++;
    foreach ($columns as $j => $col) {
        $cell = $sheet->getCellByColumnAndRow($j + 1, $ii);
        $cell->setValueExplicit("" . ($q[$col['key']] ?? ''), DataType::TYPE_STRING);
        $cell->getStyle()->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_TEXT);
    }
}

foreach ($enumasies as $i => $enum) {
    $datas->getcellByColumnAndRow($i + 1, 1)->setValue($enum);
    foreach ($matriks['attributes'][$enum]['enum'] as $j => $item) {
        $datas->getcellByColumnAndRow($i + 1, $j + 2)->setValue($item);
    }
    $sheet->setDataValidation(
        $datas->getcellByColumnAndRow($enumasiesIndex[$i] + 1, 1)->getCoordinate() . ':' .
            $datas->getcellByColumnAndRow($enumasiesIndex[$i] + 1, $j + 2)->getCoordinate(),
        (new DataValidation())
            ->setType(DataValidation::TYPE_LIST)
            ->setErrorStyle(DataValidation::STYLE_INFORMATION)
            ->setAllowBlank(false)
            ->setShowInputMessage(true)
            ->setShowErrorMessage(true)
            ->setShowDropDown(true)
            ->setErrorTitle('Input error')
            ->setError('Value is not in list')
            ->setPromptTitle('Pick from list')
            ->setPrompt('Please pick a value from the drop-down list.')
            ->setFormula1('Opsi!$'.$alphabet[$i].'$2:$'.$alphabet[$i].'$' . ($j + 2))
    );
}
$spreadsheet->addSheet($datas);

$dir = implode(DIRECTORY_SEPARATOR, [__DIR__, '..', 'public', 'exports']);
if (!file_exists($dir)) {
    mkdir($dir, 0777, true);
} else {
    $files = glob($dir . DIRECTORY_SEPARATOR . '*.xlsx');
    foreach ($files as $file) {
        unlink($file);
    }
}
$filename = 'data-' . date('YmdHis') . '.xlsx';
(new Xlsx($spreadsheet))->save($dir . DIRECTORY_SEPARATOR . $filename);
echo '/exports/' . $filename;
