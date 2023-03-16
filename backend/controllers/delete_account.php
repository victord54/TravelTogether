<?php
include 'header.php';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        if (password_verify($_GET['password'], $data['motDePasse'])) {
            $statement = $pdo->prepare("DELETE FROM UTILISATEUR WHERE email = :mail");
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();    
            $reponse = $data;
        }
    }

    echo json_encode($reponse);
}
