<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

    $statement = $pdo->prepare("SELECT nomDeGroupe from GROUPE WHERE (nomDeGroupe = :nom)");

    $statement->bindValue(":nom", $_POST["nom"]);
    $statement->execute();
    $data = $statement->fetchAll();
    if ($data){
        // Le groupe existe deja 
        echo json_encode(0);
        $exists = 1;
    }
    else{
        // Si le groupe n'existe pas 
        $statement = $pdo->prepare("UPDATE SET (nomDEGroupe =:nom) WHERE id = ");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":nom", $_POST["nom"]);
        if (!$statement->execute()) {
            echo "died";
        }

        echo $pdo->lastInsertId();
        }
}
