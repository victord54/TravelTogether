<?php
include 'header.php';
include 'mailer_setup.php';

use PHPMailer/PHPMailer/PHPMailer;
use PHPMailer/PHPMailer/Exception;

require $exception;
require $mailer;
require $smtp;

$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare("SELECT * FROM NOTIFICATION WHERE notifie = :mail ORDER BY idfNotif DESC");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $statement = $pdo->prepare("DELETE FROM NOTIFICATION WHERE idfNotif=:idf");
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu supprimes " . $_GET["idf"]);
}
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET statutReponse=(:ref), etat=1 WHERE idfNotif=(:idf)");
    
    //https://stackoverflow.com/questions/44799589/php-post-array-empty-on-axios-post solution credit
    $body = file_get_contents('php://input');

    // Parse json body and notify when error occurs
    $data = json_decode($body, true);
    
    //print_r($data);
    $statement->bindValue(":idf", $data["idf"]);
    $statement->bindValue(":ref", $data["ref"]);
    $statement->execute();
    //echo json_encode("j'ai bien reçu que tu as change le statut de la notification " . $data["ref"]);
    $statement = $pdo->prepare("SELECT * FROM NOTIFICATION WHERE idfNotif=(:idf)");
    $statement->bindValue(":idf", $data["idf"]);
    $statement->execute();
    $data2 = $statement->fetchAll();
    //echo json_encode($data2[0]["interesse"]);

    if (strcmp($data["ref"], "accepte")) {
        $statement = $pdo->prepare("SELECT numTel FROM UTILISATEUR WHERE email=:mail");
        $statement->bindValue(":mail", $data['email']);
        $statement->execute();
        $numTel = $statement->fetch();
        echo json_encode($numTel['numTel']);
    }

    $statement = $pdo->prepare("INSERT INTO NOTIFICATION (typeNotif, dateNotif, notifie, etat, informations, statutReponse) 
    VALUES (:typeNotif, :dateNotif, :notifie, :etat, :info, :statut)");
    $statement->bindValue(":typeNotif", "Resultat");
    $statement->bindValue(":dateNotif", date('y-m-d'));
    $statement->bindValue(":notifie", $data2[0]["interesse"]);
    $statement->bindValue(":etat", 0);

    $info = "";

    
    
    $statement2 = $pdo->prepare("SELECT notificationParMail FROM UTILISATEUR WHERE email=:mail");
    $statement2->bindValue(":mail", $data['email']);
    $statement2->execute();
    $notif= $statement2->fetch();

    json_encode($notif["notificationParMail"]);
    
    echo $data["ref"];

    if (strcmp($data["ref"], "accepter") == 0){
        echo "herer";
        $info = "Votre demande de participation a été acceptée. Voici le numéro du conducteur : " . $numTel['numTel'];
        $statement->bindValue(":info", $info);
        $statement->bindValue(":statut", "accepter");

        if($notif["notificationParMail"] == 1){
        $mail = instanciateMailer();
        $mail->setFrom('trialling027@outlook.fr', 'Notification de voyage TravelTogether');
        // Recipient, the name can also be stated
        $mail->addAddress($data2[0]["interesse"], "Utilisateur TravelTogether");
        $mail->Subject = ("Votre demande de voyage TravelTogether"); //save temporary code in localstorage to compare against
        // HTML content
        $mail->Body = $info;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->send();
        json_encode("sending");
    }

    } else {
        $info = "Votre demande de participation a été refusée";
        $statement->bindValue(":info", $info);
        $statement->bindValue(":statut", "refuser");

        if($notif["notificationParMail"] == 1){
        $mail = instanciateMailer();
        $mail->setFrom('trialling027@outlook.fr', 'Notification de voyage TravelTogether');
        // Recipient, the name can also be stated
        $mail->addAddress($data2[0]["interesse"], "Utilisateur TravelTogether");
        $mail->Subject = ("Votre demande de voyage TravelTogether"); //save temporary code in localstorage to compare against
        // HTML content
        $mail->Body = $info;
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->send();
        json_encode("sending");
    }

    }

    $statement->execute();

    

}
