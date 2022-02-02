<?php

require_once "db.php";

$columns = [
    [
        "header" => "ID KASUS",
        "width" => 10,
        "key" => "id", // 1
    ],
    [
        "header" => "NIK",
        "width" => 20,
        "key" => "nik", // 2
    ],
    [
        "header" => "Kelompok",
        "width" => 15,
        "key" => "kelompok", // 3
    ],
    [
        "header" => "Skala/Status",
        "width" => 15,
        "key" => "skala_status", // 4
    ],
    [
        "header" => "Pantauan",
        "width" => 15,
        "key" => "pantauan", // 5
    ],
    [
        "header" => "Nama Alias",
        "width" => 15,
        "key" => "nama_alias", // 6
    ],
    [
        "header" => "Nama Lengkap",
        "width" => 20,
        "key" => "nama", // 7
    ],
    [
        "header" => "No Handphone",
        "width" => 15,
        "key" => "no_handphone", // 8
    ],
    [
        "header" => "No KK",
        "width" => 20,
        "key" => "no_kartu_keluarga", // 9
    ],
    [
        "header" => "Tempat Lahir",
        "width" => 15,
        "key" => "tempat_lahir", // 10
    ],
    [
        "header" => "Tanggal Lahir",
        "width" => 15,
        "key" => "tanggal_lahir", // 11
    ],
    [
        "header" => "Jenis Kelamin",
        "width" => 15,
        "key" => "jenis_kelamin", // 12
    ],
    [
        "header" => "Jenis Pekerjaan",
        "width" => 20,
        "key" => "jenis_pekerjaan", // 13
    ],
    [
        "header" => "Status Kawin",
        "width" => 20,
        "key" => "status_kawin", // 14
    ],
    [
        "header" => "Pendidikan Terakhir",
        "width" => 20,
        "key" => "pendidikan_terakhir", // 15
    ],
    [
        "header" => "Alamat",
        "width" => 20,
        "key" => "alamat", // 16
    ],
    [
        "header" => "RT/RW",
        "width" => 15,
        "key" => "rt_rw", // 17
    ],
    [
        "header" => "Kelurahan",
        "width" => 15,
        "key" => "kelurahan", // 18
    ],
    [
        "header" => "Kecamatan",
        "width" => 15,
        "key" => "kecamatan", // 19
    ],
    [
        "header" => "Kabupaten",
        "width" => 15,
        "key" => "kabupaten", // 20
    ],
    [
        "header" => "Propinsi",
        "width" => 15,
        "key" => "propinsi", // 21
    ],
    [
        "header" => "Nama Ayah",
        "width" => 20,
        "key" => "nama_ayah", // 22
    ],
    [
        "header" => "Nama Ibu",
        "width" => 20,
        "key" => "nama_ibu", // 23
    ],
    [
        "header" => "NIK Ayah",
        "width" => 20,
        "key" => "nik_ayah", // 24
    ],
    [
        "header" => "NIK Ibu",
        "width" => 20,
        "key" => "nik_ibu", // 25
    ],
    [
        "header" => "Keluarga",
        "width" => 50,
        "key" => "keluarga", // 26
    ],
    [
        "header" => "Peran",
        "width" => 50,
        "key" => "peran", // 27
    ],
    [
        "header" => "BAP",
        "width" => 50,
        "key" => "bap", // 28
    ],
    [
        "header" => "Interogasi",
        "width" => 50,
        "key" => "interogasi", // 29
    ],
    [
        "header" => "Passport",
        "width" => 50,
        "key" => "passport", // 30
    ],
    [
        "header" => "Informasi Teknis",
        "width" => 50,
        "key" => "informasi_teknis", // 31
    ],
    [
        "header" => "Pendanaan",
        "width" => 50,
        "key" => "pendanaan", // 32
    ],
    [
        "header" => "Pendanaan Keterangan",
        "width" => 50,
        "key" => "pendanaan_keterangan", // 33
    ],
    [
        "header" => "Lapangan",
        "width" => 50,
        "key" => "lapangan", // 34
    ],
    [
        "header" => "Lapangan Keterangan",
        "width" => 50,
        "key" => "lapangan_keterangan", // 35
    ],
    [
        "header" => "Media Sosial",
        "width" => 50,
        "key" => "media_sosial", // 36
    ],
    [
        "header" => "Media Sosial Keterangan",
        "width" => 50,
        "key" => "media_sosial_keterangan", // 37
    ],
];

$matriks = json_decode(file_get_contents(realpath(__DIR__ . '/../../src/api/matrik/content-types/matrik/schema.json')), true);
$enumasies = ['jenisKelamin', 'jenisPekerjaan', 'statusKawin', 'pendidikanTerakhir'];
$enumasiesIndex = [12, 13, 14, 15];
$alphabet = range('A', 'Z');

function build_cache_component($fieldName, $tableName)
{
    global $db;
    $res = $db->run(
        "SELECT matriks_components.entity_id, $tableName.*
        FROM  $tableName, matriks_components
        WHERE matriks_components.field = '$fieldName'
        AND matriks_components.component_id =  $tableName.id
        ORDER BY matriks_components.entity_id, matriks_components.`order`"
    );
    $cache = [];
    foreach ($res as $row) {
        if (empty($cache[$row['entity_id']]))
            $cache[$row['entity_id']] = [];
        $cache[$row['entity_id']][] = $row;
    }
    return $cache;
}

function write_value($q, $key, &$cache)
{
    switch ($key) {
        case 'media_sosial_dokumentasi':
        case 'lapangan_dokumentasi':
        case 'pendanaan_dokumentasi':
            return implode("\n", array_map(function ($item) {
                return substr($item['url'], strlen('/uploads/'));
            }, $q[$key] ?? []));
        case 'keluarga':
            if (empty($cache['keluarga']))
                $cache['keluarga'] = build_cache_component('keluarga', 'components_itemized_anggota_keluargas');
            return implode("\n", array_map(function ($item) {
                return $item['nik'] . ';' . $item['nama'] . ';' . $item['nomor'];
            }, $cache['keluarga'][$q['id']] ?? []));
        case 'media_sosial':
            if (empty($cache['media_sosial']))
                $cache['media_sosial'] = build_cache_component('mediaSosial', 'components_itemized_item_sosmeds');
            return implode("\n", array_map(function ($item) {
                return $item['tipe'] . ';' . $item['value'];
            }, $cache['media_sosial'][$q['id']] ?? []));
        default:
            return "" . ($q[$key] ?? '');
    }
}
