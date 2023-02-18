<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');

    $statement = $pdo->prepare("SELECT * FROM UTILISATEUR");
    $statement->execute();

    $data = $statement->fetchAll();

    echo json_encode($data);
}
