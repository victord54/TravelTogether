<?php
include 'header.php';
$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $statement = $pdo->prepare("SELECT email from OFFRE WHERE idfOffre = :idfOffre");
    $statement->setFetchMode(PDO::FETCH_ASSOC);

    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->execute();
    $mail = $statement->fetchAll()[0]["email"];

    $statement = $pdo->prepare("INSERT INTO NOTIFICATION (typeNotif, dateNotif, notifie, interesse, idfOffre,informations,etat,statutReponse) VALUES (:typeNotif, :dateNotif, :notifie, :interesse, :idfOffre, :informations, :etat, :statutReponse)");
    $statement->setFetchMode(PDO::FETCH_ASSOC);    
    
    $statement->bindValue(":typeNotif", "reponse");
    $statement->bindValue(":dateNotif", date('y-m-d'));
    $statement->bindValue(":notifie", $mail);
    $statement->bindValue(":interesse", $_POST["interesse"]);
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->bindValue(":informations", "reponse a votre offre");
    $statement->bindValue(":etat", 0);
    $statement->bindValue(":statutReponse", "attente");

    $statement->execute();
}