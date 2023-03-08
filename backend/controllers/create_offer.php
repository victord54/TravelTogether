<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $sqlInsert = "INSERT INTO OFFRE(email, dateDepart, heureDepart, prix, nbPlaceDisponible, precisions, infos, villeDepart, villeArrivee)
                    VALUES (:email, :dateDepart, :heureDepart, :prix, :nbPlaceDisponible, :precisions, :infos, :villeDepart, :villeArrivee)";
    $statement = $pdo->prepare($sqlInsert);
    $statement->bindValue(':email', $_POST['email']);
    $statement->bindValue(':dateDepart', $_POST['dateDepart'] . " 00:00:00");
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
    if ($idfOffre != false) {
        if (!isset($_POST['groupe'])) {
            $statement = $pdo->prepare("INSERT INTO OFFREPUBLIC(idfOffre) VALUES (:idfOffre)");
            $statement->bindValue(':idfOffre', $idfOffre);
            $statement->execute() or die(print_r($statement->errorInfo(), true));
        } else {
            $statement = $pdo->prepare("INSERT INTO OFFREPRIVEE(idfOffre, idfGroupe) VALUES (:idfOffre, :idfGroupe)");
            $statement->bindValue(':idfOffre', $idfOffre);
            $statement->bindValue(':idfGroupe', $_POST['groupe']);
            $statement->execute() or die(print_r($statement->errorInfo(), true));

            $statement = $pdo->prepare("SELECT email FROM APPARTIENT WHERE idfGroupe = :idfGroupe");
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $statement->bindValue(':idfGroupe', $_POST['groupe']);
            $statement->execute();
            $members = $statement->fetchAll();

            foreach($members as $member) {
                $statement = $pdo->prepare("INSERT INTO NOTIFICATION (typeNotif, dateNotif, informations, notifie, idfOffre) 
                VALUES (:typeNotif, :dateNotif, :informations, :notifie, :idfOffre)");
                $statement->bindValue(":typeNotif", "offre");
                $statement->bindValue(":dateNotif", date('y-m-d'));
                $statement->bindValue(":notifie", $member["email"]);
                $statement->bindValue(":idfOffre", $idfOffre);
                $statement->bindValue(":informations", "Cette offre est susceptible de vous intéresser !");

                $statement->execute() or die(print_r($statement->errorInfo(), true));
            }

        }
        if (strcmp($_POST['arretIntermediaire'], '') != 0) {
            $cpt = 0;
            foreach ($citiesInter as $city) {
                $statement = $pdo->prepare("INSERT INTO PASSE_PAR(idfOffre, ville, position) VALUES (:idfOffre, :ville, :position)");
                $statement->bindValue(':idfOffre', $idfOffre);
                $statement->bindValue(':ville', $city);
                $statement->bindValue(':position', $cpt);
                $statement->execute() or die(print_r($statement->errorInfo(), true));
                $cpt++;
            }
        }
    }

    echo $idfOffre;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT idfGroupe, nomDeGroupe FROM GROUPE WHERE dirigeant = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();

    $reponse = $data;

    echo json_encode($reponse);
}
