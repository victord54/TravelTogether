<?php
include 'header.php';
$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $statement = $pdo->prepare("SELECT email, nbPlaceDisponible from OFFRE WHERE idfOffre = :idfOffre");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->execute();
    $data = $statement->fetchAll()[0];
    $mail = $data["email"];
    $placeDisponible = ["placeDisponible"];

    $statement = $pdo->prepare("SELECT SUM(nbPlacesSouhaitees) FROM NOTIFICATION WHERE idfOffre = :idfOffre");
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->execute();
    $nbPlacesPrises = $statement->fetchAll()[0][0];

    if($placeDisponible - ($nbPlacesPrises + $_POST["nbPlaces"]) >= 0){
        $statement = $pdo->prepare("INSERT INTO NOTIFICATION (typeNotif, dateNotif, notifie, interesse, idfOffre,informations,etat,statutReponse, nbPlacesSouhaitees) 
        VALUES (:typeNotif, :dateNotif, :notifie, :interesse, :idfOffre, :informations, :etat, :statutReponse, :nbPlaces)");
        $statement->bindValue(":typeNotif", "reponse");
        $statement->bindValue(":dateNotif", date('y-m-d'));
        $statement->bindValue(":notifie", $mail);
        $statement->bindValue(":interesse", $_POST["interesse"]);
        $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
        $statement->bindValue(":informations", "reponse a votre offre");
        $statement->bindValue(":etat", 0);
        $statement->bindValue(":statutReponse", "attente");
        $statement->bindValue(":nbPlaces", $_POST["nbPlaces"]);

        $statement->execute();
    }
    
}