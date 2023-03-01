<?php 
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email)");
    $statement->execute();
    $data = $statement->fetchAll();
    $reponse = $data;

    echo json_encode($reponse);
}


?>