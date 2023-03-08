<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    /*$data = json_decode(file_get_contents('php://input'), true);
    $inputValue = $data['data']['inputValue'];*/
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

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
        $statement->bindValue(':aUneVoiture', 1);
    } else {
        $statement->bindValue(':aUneVoiture', 0);
    }
    if (isset($_POST['notification'])) {
        $statement->bindValue(':notificationParMail', 1);
    } else {
        $statement->bindValue(':notificationParMail', 0);
    }

    if (isset($_FILES['file'])) {
        $uploaddir = dirname(__FILE__, 2) . '/pictures';
        $ext = explode('/', $_FILES['file']['type']);
        $file_dir_save = $uploaddir . '/' . $_POST['mail'] . '.' . $ext[1];

        if (move_uploaded_file($_FILES['file']['tmp_name'], $file_dir_save)) {
            $serv = $url . "/pictures";
            $file_name = $serv . '/' . $_POST['mail'] . '.' . $ext[1];
            $statement->bindValue(':photo', $file_name);
        } else {
            echo "There was an error uploading the file";
        }
    } else {
        $file_name = $url . "/pictures/default.png";
        $statement->bindValue(':photo', $file_name);
    }

    $statement->execute() or die(print_r($statement->errorInfo(), true));;
    echo "ok";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
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
