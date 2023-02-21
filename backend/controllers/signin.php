<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    /*$data = json_decode(file_get_contents('php://input'), true);
    $inputValue = $data['data']['inputValue'];*/
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');

    $sqlInsert = "INSERT INTO UTILISATEUR(email, nom, prenom, numTel, genre, motDePasse, aUneVoiture, notificationParMail, photo)
                    VALUES (:email, :nom, :prenom, :numTel, :genre, :motDePasse, :aUneVoiture, :notificationParMail, :photo)";
    $statement = $pdo->prepare($sqlInsert);
    $statement->bindValue(':nom', $_POST['lastName']);
    $statement->bindValue(':email', $_POST['mail']);
    $statement->bindValue(':prenom', $_POST['firstName']);
    $statement->bindValue(':numTel', $_POST['phoneNumber']);
    $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $statement->bindValue(':motDePasse', $hash);
    $statement->bindValue(':genre', $_POST['gender']);
    if (strcmp($_POST['car'], 'yes') == 0) {
        $statement->bindValue(':aUneVoiture', true);
    } else {
        $statement->bindValue(':aUneVoiture', false);
    }
    if (isset($_POST['notification'])) {
        $statement->bindValue(':notificationParMail', true);
    } else {
        $statement->bindValue(':notificationParMail', false);
    }

    if (isset($_FILES['file'])){
        $uploaddir = dirname(__FILE__, 2) . '/pictures';
        $ext = explode('/',$_FILES['file']['type']);
        $file_name = $uploaddir . '/' . $_POST['mail'] . '.' . $ext[1];
        echo $file_name;

        if(move_uploaded_file($_FILES['file']['tmp_name'], $file_name))
        {
          echo "The file has been uploaded successfully";
          $statement->bindValue(':photo', $file_name);
        }
        else
        {
          echo "There was an error uploading the file";
        } 
    } else {
        $statement->bindValue(':photo', NULL);
    }

    $statement->execute() or die(print_r($statement->errorInfo(), true));;
    echo "c'est bon";
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
