<?php
$data = [
    'title' => 'Cassoulet',
    'recipe' => 'Etape 1 : des flageolets, Etape 2 : ...',
    'author' => 'john.doe@exemple.com',
    'enabled' => true,
];
header('Content-Type: application/json; charset=utf-8; Access-Control-Allow-Origin: *');
echo json_encode($data);
