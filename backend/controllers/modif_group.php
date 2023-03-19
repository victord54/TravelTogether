<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

    $statement = $pdo->prepare("SELECT nomDeGroupe from GROUPE WHERE (:dig = dirigeant) and (nomDeGroupe = :nom)");
    $statement->bindValue(":dig", $_POST["mail"]);
    $statement->bindValue(":nom", $_POST["nom"]);
    $statement->execute();
    $data = $statement->fetchAll();

    if (!empty($data)){
        echo json_encode(0);
        $exists = 1;
    }else{
        $statement = $pdo->prepare("UPDATE GROUPE SET nomDeGroupe = :nom WHERE (dirigeant = :dig) AND (idfGroupe = :idfGroupe)");

        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":idfGroupe", $_POST["idfGroupe"]);
        $statement->bindValue(":nom", $_POST["nom"]);
        $statement->bindValue(":dig", $_POST["mail"]);
        if (!$statement->execute()) {
            echo "died";
        }else{
            echo 1;
        } 
    }
}
