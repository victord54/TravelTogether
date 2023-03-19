<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("UPDATE OFFRE SET annule = 1 WHERE idfOffre = :idfOffre");

    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);

    $statement->execute() or die(print_r($statement->errorInfo(), true));

    $statement = $pdo->prepare("SELECT interesse FROM NOTIFICATION WHERE typeNotif = 'Reponse' AND idfOffre = :idfOffre AND (statutReponse = 'accepter' OR statutReponse = 'attente')");
        $statement->bindValue(':idfOffre', $_POST['idfOffre']);
        $statement->execute() or die(print_r($statement->errorInfo(), true));
        $members = $statement->fetchAll();

        foreach($members as $member) {
            $statement = $pdo->prepare("INSERT INTO NOTIFICATION(typeNotif, dateNotif, notifie, idfOffre, informations) VALUES('Offre', :dateNotif, :notifie, :idfOffre, :informations)");
            $statement->bindValue(':idfOffre', $_POST['idfOffre']);
            $statement->bindValue(':dateNotif', date('y-m-d'));
            $statement->bindValue(':notifie', $member["interesse"]);
            $statement->bindValue(':informations', 'Une offre à la quelle vous participez/comptez parcticiper a était supprimée !');
            $statement->execute() or die(print_r($statement->errorInfo(), true));
        }

    $statement = $pdo->prepare("UPDATE NOTIFICATION SET statutReponse = 'refuser', etat = 1 WHERE typeNotif = 'Reponse' AND idfOffre = :idfOffre");
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);

    $statement->execute() or die(print_r($statement->errorInfo(), true));

    echo "1";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT motDePasse FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute() or die(print_r($statement->errorInfo(), true));
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        if (password_verify($_GET['password'], $data['motDePasse'])) {
            $reponse = '1';
        } else {
            $reponse = '0';
        }
    }

    echo json_encode($reponse);
}
