<?php
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $inputValue = $data['data']['inputValue'];
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');

    $sqlInsert = "INSERT INTO UTILISATEUR(email, nom, prenom, numTel, genre, motDePasse, aUneVoiture, notificationParMail)
                VALUES (:email, :nom, :prenom, :numTel, :genre, :motDePasse, :aUneVoiture, :notificationParMail)";
    $statement = $pdo->prepare($sqlInsert);
    $statement->bindValue(':nom', $inputValue['lastName']);
    $statement->bindValue(':email', $inputValue['mail']);
    $statement->bindValue(':prenom', $inputValue['firstName']);
    $statement->bindValue(':numTel', $inputValue['phoneNumber']);
    $hash = password_hash($inputValue['password'], PASSWORD_DEFAULT);
    $statement->bindValue(':motDePasse', $hash);
    $statement->bindValue(':genre', $inputValue['gender']);
    if (strcmp($inputValue['car'], 'yes') == 0) {
        $statement->bindValue(':aUneVoiture', true);
    } else {
        $statement->bindValue(':aUneVoiture', false);
    }
    if (isset($inputValue['notification'])) {
        $statement->bindValue(':notificationParMail', true);
    } else {
        $statement->bindValue(':notificationParMail', false);
    }
    // $statement->bindValue(':photo', NULL);
    $statement->execute() or die(print_r($statement->errorInfo(), true));;
    echo $inputValue['lastName'];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');
    $statement = $pdo->prepare("SELECT email FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        $reponse = $data;
    }

    echo json_encode($reponse);
}
