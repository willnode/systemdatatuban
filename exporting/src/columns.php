<?php

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
        "width" => 20,
        "key" => "kelompok", // 3
    ],
    [
        "header" => "Skala/Status",
        "width" => 20,
        "key" => "skala_status", // 4
    ],
    [
        "header" => "Nama Alias",
        "width" => 20,
        "key" => "nama_alias", // 5
    ],
    [
        "header" => "Nama Lengkap",
        "width" => 20,
        "key" => "nama", // 6
    ],
    [
        "header" => "No Handphone",
        "width" => 20,
        "key" => "no_handphone", // 7
    ],
    [
        "header" => "Tempat Lahir",
        "width" => 20,
        "key" => "tempat_lahir", // 8
    ],
    [
        "width" => 20,
        "header" => "Tanggal Lahir",
        "key" => "tanggal_lahir", // 9
    ],
    [
        "header" => "Jenis Kelamin",
        "width" => 20,
        "key" => "jenis_kelamin", // 10
    ],
    [
        "header" => "Jenis Pekerjaan",
        "width" => 20,
        "key" => "jenis_pekerjaan", // 11
    ],
    [
        "header" => "Status Kawin",
        "width" => 20,
        "key" => "status_kawin", // 12
    ],
    [
        "header" => "Pendidikan Terakhir",
        "width" => 20,
        "key" => "pendidikan_terakhir", // 13
    ],
    [
        "header" => "Alamat",
        "width" => 20,
        "key" => "alamat", // 14
    ],
    [
        "header" => "RT/RW",
        "width" => 20,
        "key" => "rt_rw", // 15
    ],
    [
        "header" => "Kelurahan",
        "width" => 20,
        "key" => "kelurahan", // 16
    ],
    [
        "header" => "Kecamatan",
        "width" => 20,
        "key" => "kecamatan", // 17
    ],
    [
        "header" => "Kabupaten",
        "width" => 20,
        "key" => "kabupaten", // 18
    ],
    [
        "header" => "Propinsi",
        "width" => 20,
        "key" => "propinsi", // 19
    ],
    [
        "header" => "Nama Ayah",
        "width" => 20,
        "key" => "nama_ayah", // 20
    ],
    [
        "header" => "Nama Ibu",
        "width" => 20,
        "key" => "nama_ibu", // 21
    ],
    [
        "header" => "NIK Ayah",
        "width" => 20,
        "key" => "nik_ayah", // 22
    ],
    [
        "header" => "NIK Ibu",
        "width" => 20,
        "key" => "nik_ibu", // 23
    ],
    [
        "header" => "Peran",
        "width" => 30,
        "key" => "peran", // 24
    ],
    [
        "header" => "BAP",
        "width" => 30,
        "key" => "bap", // 25
    ],
    [
        "header" => "Passport",
        "width" => 30,
        "key" => "passport", // 26
    ],
    [
        "header" => "Pendanaan",
        "width" => 30,
        "key" => "pendanaan", // 27
    ],
    [
        "header" => "Informasi Teknis",
        "width" => 30,
        "key" => "informasi_teknis", // 28
    ],
    [
        "header" => "Lapangan",
        "width" => 30,
        "key" => "lapangan", // 29
    ]
];

$matriks = json_decode(file_get_contents(realpath(__DIR__ . '/../../src/api/matrik/content-types/matrik/schema.json')), true);
$enumasies = ['jenisKelamin', 'jenisPekerjaan', 'statusKawin', 'pendidikanTerakhir'];
$enumasiesIndex = [9, 10, 11, 12];
$alphabet = range('A', 'Z');