<?php

$columns = [
    [
        "header" => "ID KASUS",
        "width" => 10,
        "key" => "id",
    ],
    [
        "header" => "NIK",
        "width" => 20,
        "key" => "nik",
    ],
    [
        "header" => "Kelompok",
        "width" => 20,
        "key" => "kelompok",
    ],
    [
        "header" => "Skala/Status",
        "key" => "skalaStatus",
        "width" => 20,
    ],
    [
        "header" => "Nama Alias",
        "width" => 20,
        "key" => "namaAlias",
    ],
    [
        "header" => "Nama Lengkap",
        "width" => 20,
        "key" => "nama",
    ],
    [
        "header" => "No Handphone",
        "width" => 20,
        "key" => "noHandphone",
    ],
    [
        "header" => "Tempat Lahir",
        "width" => 20,
        "key" => "tempatLahir",
    ],
    [
        "width" => 20,
        "header" => "Tanggal Lahir",
        "key" => "tanggalLahir",
    ],
    [
        "header" => "Jenis Kelamin",
        "width" => 20,
        "key" => "jenisKelamin",
    ],
    [
        "header" => "Jenis Pekerjaan",
        "width" => 20,
        "key" => "jenisPekerjaan",
    ],
    [
        "header" => "Status Kawin",
        "width" => 20,
        "key" => "statusKawin",
    ],
    [
        "header" => "Pendidikan Terakhir",
        "width" => 20,
        "key" => "pendidikanTerakhir",
    ],
    [
        "header" => "Alamat",
        "width" => 20,
        "key" => "alamat",
    ],
    [
        "header" => "RT/RW",
        "width" => 20,
        "key" => "rtRw",
    ],
    [
        "header" => "Kelurahan",
        "width" => 20,
        "key" => "kelurahan",
    ],
    [
        "header" => "Kecamatan",
        "width" => 20,
        "key" => "kecamatan",
    ],
    [
        "header" => "Kabupaten",
        "width" => 20,
        "key" => "kabupaten",
    ],
    [
        "header" => "Propinsi",
        "width" => 20,
        "key" => "propinsi",
    ],
    [
        "header" => "Nama Ayah",
        "width" => 20,
        "key" => "namaAyah",
    ],
    [
        "header" => "Nama Ibu",
        "width" => 20,
        "key" => "namaIbu",
    ],
    [
        "header" => "NIK Ayah",
        "width" => 20,
        "key" => "nikAyah",
    ],
    [
        "header" => "NIK Ibu",
        "width" => 20,
        "key" => "nikIbu",
    ],
    [
        "header" => "Peran",
        "width" => 30,
        "key" => "peran",
    ],
    [
        "header" => "BAP",
        "width" => 30,
        "key" => "bap",
    ],
    [
        "header" => "Passport",
        "width" => 30,
        "key" => "passport",
    ],
    [
        "header" => "Pendanaan",
        "width" => 30,
        "key" => "pendanaan",
    ],
    [
        "header" => "Informasi Teknis",
        "width" => 30,
        "key" => "informasiTeknis",
    ],
    [
        "header" => "Lapangan",
        "width" => 30,
        "key" => "lapangan",
    ]
];

$matriks = json_decode(file_get_contents(realpath(__DIR__ . '/../../src/api/matrik/content-types/matrik/schema.json')), true);

$enumasies = ['jenisKelamin', 'jenisPekerjaan', 'statusKawin', 'pendidikanTerakhir'];
$enumasiesIndex = [9, 10, 11, 12];
$alphabet = range('A', 'Z');