<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {/*
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT idfNotif FROM NOTIFICATION WHERE notifie = :mail OR interesse = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute() or die(print_r($statement->errorInfo(), true));
    $data = $statement->fetchAll();

    foreach($data as $notif) {
        $statement = $pdo->prepare("DELETE NOTIFICATION WHERE idfNotif = :idf");
        $statement->bindValue(":idf", $notif["idfNotif"]);
        $statement->execute() or die(print_r($statement->errorInfo(), true));
    }

    $statement = $pdo->prepare("SELECT idfOffre FROM NOTIFICATION WHERE email = :mail AND ");*/

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

?>