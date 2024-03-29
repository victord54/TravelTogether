<?php
include 'header.php';
include 'mailer_setup.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require $exception;
require $mailer;
require $smtp;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    /*$data = json_decode(file_get_contents('php://input'), true);
    $inputValue = $data['data']['inputValue'];*/
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);


    if (!empty($_POST['password'])) { //mot de passe à changer
        $sqlInsert = "UPDATE UTILISATEUR
                    SET nom = :nom, prenom = :prenom, numTel = :numTel, genre = :genre, motDePasse = :motDePasse, aUneVoiture = :aUneVoiture, notificationParMail = :notificationParMail, photo = :photo
                    WHERE email = :email";
        $statement = $pdo->prepare($sqlInsert);
        $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $statement->bindValue(':motDePasse', $hash);
    } else { //pas de mot de passe à changer
        $sqlInsert = "UPDATE UTILISATEUR
                    SET nom = :nom, prenom = :prenom, numTel = :numTel, genre = :genre, aUneVoiture = :aUneVoiture, notificationParMail = :notificationParMail, photo = :photo
                    WHERE email = :email";
        $statement = $pdo->prepare($sqlInsert);
    }
    $statement->bindValue(':nom', $_POST['lastName']);
    $statement->bindValue(':email', $_POST['mail']);
    $statement->bindValue(':prenom', $_POST['firstName']);
    $statement->bindValue(':numTel', $_POST['phoneNumber']);
    $statement->bindValue(':genre', $_POST['gender']);
    if (strcmp($_POST['car'], '1') == 0) {
        $statement->bindValue(':aUneVoiture', 1);
    } else {
        $statement->bindValue(':aUneVoiture', 0);
    }
    if (strcmp($_POST['notification'], '1') == 0) {
        $statement->bindValue(':notificationParMail', 1);
    } else {
        $statement->bindValue(':notificationParMail', 0);
    }

    if (isset($_FILES['file'])) {
        $uploaddir = dirname(__FILE__, 2) . '/pictures';
        $ext = explode('/', $_FILES['file']['type']);
        $file_dir_save = $uploaddir . '/' . $_POST['mail'] . '.' . $ext[1];

        if (move_uploaded_file($_FILES['file']['tmp_name'], $file_dir_save)) {
            $file_name = $url . '/pictures/' . $_POST['mail'] . '.' . $ext[1];
            $statement->bindValue(':photo', $file_name);
            echo $file_name;
        } else {
            echo "There was an error uploading the file";
        }
    } else {
        $statement->bindValue(':photo', $_POST['link_picture']);

    }

    //email send



    $mail = instanciateMailer();
    $mail->setFrom('trialling028@outlook.fr', 'Modification de compte TravelTogether');
        // Recipient, the name can also be stated
    $mail->addAddress($_POST['mail'], "Utilisateur TravelTogether");
    $mail->Subject = ("Une modification de votre compte a eu lieu"); //save temporary code in localstorage to compare against
        // HTML content
    $mail->Body = 'Votre compte a ete modifie. Si vous n\'etes pas a l\'origine de ce changement, veuillez modifier votre mot de passe.';
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail-> send();

    //end email send

    $statement->execute() or die(print_r($statement->errorInfo(), true));;
    
}



//Ca coute pas cher alors on met ça ici au cas où
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
