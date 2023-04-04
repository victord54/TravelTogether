<?php
include 'header.php';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE email = :mail AND estSupprime = 0");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        if (password_verify($_GET['password'], $data['motDePasse'])) {
            $reponse = $data;
            $statement = $pdo->prepare("SELECT email FROM SUPERUTILISATEUR WHERE email = :mail");
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();
            $res = $statement->fetch();
            $reponse['estAdmin'] = '0';
            if($res) $reponse['estAdmin'] = $res['email'] == $_GET['mail'] ? '1' : '0';
        }
    }

    echo json_encode($reponse);
}
