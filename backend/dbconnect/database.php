<?php

function dbConnect()
{
    $login = trim(readline('login'));
    $password = trim(readline('password'));
    try {
        $database = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

        return $database;
    } catch (Exception $e) {
        die('Erreur : ' . $e->getMessage());
    }
}
?>