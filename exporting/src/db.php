<?php

$DB_HOST = $_SERVER['DATABASE_HOST'] ?? 'localhost';
$DB_USER = $_SERVER['DATABASE_USERNAME'] ?? 'root';
$DB_PASS = $_SERVER['DATABASE_PASSWORD'] ?? '';
$DB_NAME = $_SERVER['DATABASE_NAME'] ?? 'systemdatatuban';

if ($argc == 2 && $argv[1] == 'debug') {
    print_r(compact('DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'));
}
$db = \ParagonIE\EasyDB\Factory::fromArray([
    "mysql:host=$DB_HOST;dbname=$DB_NAME",
    $DB_USER,
    $DB_PASS
]);
