<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $inputValue = $data['data']['inputValue'];

    $login = "root";
    $password = "";
    $dbname = 'travel_together';
    try {
        // Connexion à la bdd.
        $pdo = new PDO("mysql:host=localhost;dbname=$dbname;charset=utf8", $login, $password);
    } catch (Exception $e) {
        die('Erreur connexion à MySQL : ' . $e->getMessage());
    }

    $sqlInsert = "INSERT INTO utilisateur(email, nom, prenom, numTel, genre, motDePasse, aUneVoiture, notificationParMail, photo)
                VALUES (:email, :nom, :prenom, :numTel, :genre, :motDePasse, :aUneVoiture, :notificationParMail, :photo);";
    $statement = $pdo->prepare($sqlInsert);
    $statement->bindValue(':nom', $inputValue['lastName']);
    $statement->bindValue(':email', $inputValue['mail']);
    $statement->bindValue(':prenom', $inputValue['firstName']);
    $statement->bindValue(':numTel', $inputValue['phoneNumber']);
    $statement->bindValue(':motDePasse', $inputValue['password']);
    $statement->bindValue(':genre', $inputValue['gender']);
    $statement->bindValue(':aUneVoiture', false);
    $statement->bindValue(':notificationParMail', false);
    $statement->bindValue(':photo', NULL);
    $statement->execute();
    echo $inputValue['lastName'];
}