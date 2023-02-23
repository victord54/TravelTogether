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
    $sqlInsert = "INSERT INTO OFFRE(email, dateDepart, heureDepart, prix, nbPlaceDisponible, precisions, infos, villeDepart, villeArrivee)
                    VALUES (:email, :dateDepart, :heureDepart, :prix, :nbPlaceDisponible, :precisions, :infos, :villeDepart, :villeArrivee)";
    $statement = $pdo->prepare($sqlInsert);
    $statement->bindValue(':email', $_POST['email']);
    $statement->bindValue(':dateDepart', $_POST['dateDepart']." 00:00:00");
    $statement->bindValue(':heureDepart', $_POST['heureDepart']);
    $statement->bindValue(':prix', $_POST['prix']);
    $statement->bindValue(':nbPlaceDisponible', $_POST['nbPlaceDisponible']);
    $statement->bindValue(':precisions', $_POST['precisions']);
    $statement->bindValue(':infos', $_POST['infos']);
    $statement->bindValue(':villeDepart', $_POST['villeDepart']);
    $statement->bindValue(':villeArrivee', $_POST['villeArrivee']);
    $citiesInter = explode(",", $_POST['arretIntermediaire']);

    $statement->execute() or die(print_r($statement->errorInfo(), true));

    $idfOffre = $pdo->lastInsertId();
    echo $_POST['arretIntermediaire'];
    if($idfOffre != false) {
        if(!isset($_POST['groupe'])) {
            $statement = $pdo->prepare("INSERT INTO OFFREPUBLIC(idfOffre) VALUES (:idfOffre)");
            $statement->bindValue(':idfOffre', $idfOffre);
            $statement->execute() or die(print_r($statement->errorInfo(), true));
        } else {
            $statement = $pdo->prepare("INSERT INTO OFFREPRIVEE(idfOffre, idfGroupe) VALUES (:idfOffre, :idfGroupe)");
            $statement->bindValue(':idfOffre', $idfOffre);
            $statement->bindValue(':idfGroupe', $_POST['groupe']);
            $statement->execute() or die(print_r($statement->errorInfo(), true));
        } 
        if(strcmp($_POST['arretIntermediaire'], '') != 0) {
            foreach($citiesInter as $city) {
                $statement = $pdo->prepare("INSERT INTO PASSE_PAR(idfOffre, ville) VALUES (:idfOffre, :ville)");
                $statement->bindValue(':idfOffre', $idfOffre);
                $statement->bindValue(':ville', $city);
                $statement->execute() or die(print_r($statement->errorInfo(), true));
            }
        }
    }
}

?>