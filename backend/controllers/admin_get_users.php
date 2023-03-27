<?php
include 'header.php';

if($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    if($_GET["type"] == "users") {
        $statement = $pdo->prepare("SELECT email, nom, prenom, photo FROM UTILISATEUR LIMIT 10 OFFSET :offs");
        $statement->bindValue(":offs", $_GET['offset'], PDO::PARAM_INT);
        $statement->execute();
        $data = $statement->fetchAll();
        $reponse = $data;
    } else if ($_GET["type"] == "size") {
        $statement = $pdo->prepare("SELECT count(email) as size FROM UTILISATEUR");
        $statement->execute();
        $data = $statement->fetch();
        $reponse = $data["size"];
    }

    echo json_encode($reponse);
}

?>