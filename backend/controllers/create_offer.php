<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');
    $sqlInsert = "INSERT INTO OFFRE(dateDepart, heureDepart, prix, nbPlaceDisponible, precisions, infos, villeDepart, villeArrivee)
                    VALUES (:dateDepart, :heureDepart, :prix, :nbPlaceDisponible, :precisions, :infos, :villeDepart, :villeArrivee)";
    $statement = $pdo->prepare($sqlInsert);
    $statement->bindValue(':dateDepart', $_POST['dateDepart']." 00:00:00");
    $statement->bindValue(':heureDepart', $_POST['heureDepart']);
    $statement->bindValue(':prix', $_POST['prix']);
    $statement->bindValue(':nbPlaceDisponible', $_POST['nbPlaceDisponible']);
    $statement->bindValue(':precisions', $_POST['precisions']);
    $statement->bindValue(':infos', $_POST['infos']);
    $statement->bindValue(':villeDepart', 54274);
    $statement->bindValue(':villeArrivee', 54274);

    $statement->execute() or die(print_r($statement->errorInfo(), true));
}

?>