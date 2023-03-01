<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

    $statement = $pdo->prepare("INSERT INTO GROUPE(nomDeGroupe, dirigeant) VALUES(:nom, :dig)");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":nom", $_POST["nom"]);
    $statement->bindValue(":dig", $_POST["mail"]);
    if (!$statement->execute()) {
        echo "died";
    }

    echo $pdo->lastInsertId();
}
