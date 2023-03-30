<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET statutReponse = 'annuler' WHERE idfOffre = :idfOffre AND interesse = :mail");
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->bindValue(":mail", $_POST["mail"]);
    $statement->execute() or die(print_r($statement->errorInfo(), true));


    $statement = $pdo->prepare("SELECT nbPlaceSouhaitees FROM NOTIFICATION WHERE idOffre = :idOffre");
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->execute() or die(print_r($statement->errorInfo(), true));
    $data = $statement->fetch();


    $statement = $pdo->prepare("UPDATE OFFRE SET nbPlaceDisponible = nbPlaceDisponible + " + $data['nbPlaceSouhaitees'] + " WHERE idfOffre = :idfOffre");
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->execute() or die(print_r($statement->errorInfo(), true));

    echo "1";
}
