<?php
    include 'header.php';

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $sqlInsert = "UPDATE OFFRE SET dateDepart = :dateDepart, heureDepart = :heureDepart, prix = :prix, nbPlaceDisponible = :nbPlaceDisponible, precisions := precisions, infos = :infos WHERE idfOffre = :idfOffre;";
        $statement = $pdo->prepare($sqlInsert);
        $statement->bindValue(':dateDepart', $_POST['dateDepart'] . " 00:00:00");
        $statement->bindValue(':heureDepart', $_POST['heureDepart']);
        $statement->bindValue(':prix', $_POST['prix']);
        $statement->bindValue(':nbPlaceDisponible', $_POST['nbPlaceDisponible']);
        $statement->bindValue(':precisions', $_POST['precisions']);
        $statement->bindValue(':infos', $_POST['infos']);
        $statement->bindValue(':idfOffre', $_POST['idfOffre']);
        $statement->execute() or die(print_r($statement->errorInfo(), true));

        $statement = $pdo->prepare("SELECT interesse FROM NOTIFICATION WHERE typeNotif = 'Reponse' AND idfOffre = :idfOffre AND (statutReponse = 'accepter' OR staturReponse = 'attente')");
        $statement->bindValue(':idfOffre', $_POST['idfOffre']);
        $statement->execute() or die(print_r($statement->errorInfo(), true));
        $members = $statement->fetchAll();

        foreach($members as $member) {
            $statement = $pdo->prepare("INSERT INTO NOTIFICATION(typeNotif, dateNotif, notifie, idfOffre, informations) VALUES('Offre', :dateNotif, :notifie, :idfOffre, :informations)");
            $statement->bindValue(':idfOffre', $_POST['idfOffre']);
            $statement->bindValue(':dateNotif', date());
            $statement->bindValue(':notifie', $member);
            $statement->bindValue(':informations', 'Une offre à la quelle vous participez/comptez parcticiper a était modifée !');
            $statement->execute() or die(print_r($statement->errorInfo(), true));
        }
        
        echo 1;
    }

?>