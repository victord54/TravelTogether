<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

    $statement = $pdo->prepare("SELECT * from UTILISATEUR JOIN notification WHERE idfOffre = :id AND statutReponse = 'accepter' AND (utilisateur.email = notification.interesse OR utilisateur.email = notification.notifie);");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":id", $_GET['id']);
    $statement->execute();
    $data = $statement->fetchAll();


    echo (json_encode($data));
}