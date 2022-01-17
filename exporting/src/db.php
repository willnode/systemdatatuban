<?php

$DB_HOST = $_ENV['DATABASE_HOST'] ?? 'localhost';
$DB_USER = $_ENV['DATABASE_USERNAME'] ?? 'root';
$DB_PASS = $_ENV['DATABASE_PASSWORD'] ?? '';
$DB_NAME = $_ENV['DATABASE_NAME'] ?? 'systemdatatuban';

$db = \ParagonIE\EasyDB\Factory::fromArray([
    "mysql:host=$DB_HOST;dbname=$DB_NAME",
    $DB_USER,
    $DB_PASS
]);
