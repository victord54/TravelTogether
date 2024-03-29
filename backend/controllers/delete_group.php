<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("DELETE FROM APPARTIENT WHERE idfGroupe = :idfGroupe");
    $statement->bindValue(":idfGroupe", $_POST["idfGroupe"]);
    $statement->execute() or die(print_r($statement->errorInfo(), true));


    $statement = $pdo->prepare("DELETE FROM GROUPE WHERE idfGroupe = :idfGroupe AND dirigeant = :email");
    $statement->bindValue(":idfGroupe", $_POST["idfGroupe"]);
    $statement->bindValue(":email", $_POST["mail"]);
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
