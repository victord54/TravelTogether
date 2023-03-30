<?php
include 'header.php';
include 'mailer_setup.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require $exception;
require $mailer;
require $smtp;


$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $statement = $pdo->prepare("SELECT idfNotif from  NOTIFICATION WHERE idfOffre = :idfOffre AND interesse = :interesse");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
    $statement->bindValue(":interesse", $_POST["interesse"]);
    $statement->execute() or die(print_r($statement->errorInfo(), true));

    if($statement->rowCount() > 0){
        echo "user already replied";
    }else{
        $statement = $pdo->prepare("SELECT email, nbPlaceDisponible from OFFRE WHERE idfOffre = :idfOffre");
        $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
        $statement->execute();
        $data = $statement->fetchAll()[0];
        $mail = $data["email"];
        $placeDisponible = $data["nbPlaceDisponible"];

        if($placeDisponible - $_POST["nbPlaces"] >= 0){

            $message = $_POST["interesse"]." a répondu à l'une de vos offres. Il souhaite réserver " . $_POST["nbPlaces"] . " place(s)";
            echo $_POST["message"] != "";
            if($_POST["message"] != ""){
                $message = $message." et a laissé le message : \"". $_POST["message"] ."\"";
            }else{
                $message = $message.".";
            }


            $statement = $pdo->prepare("INSERT INTO NOTIFICATION (typeNotif, dateNotif, notifie, interesse, idfOffre,informations,etat,statutReponse, nbPlaceSouhaitees) 
            VALUES (:typeNotif, :dateNotif, :notifie, :interesse, :idfOffre, :informations, :etat, :statutReponse, :nbPlaces)");
            $statement->bindValue(":typeNotif", "reponse");
            $statement->bindValue(":dateNotif", date('y-m-d'));
            $statement->bindValue(":notifie", $mail);
            $statement->bindValue(":interesse", $_POST["interesse"]);
            $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
            $statement->bindValue(":informations", $message);
            $statement->bindValue(":etat", 0);
            $statement->bindValue(":statutReponse", "attente");
            $statement->bindValue(":nbPlaces", $_POST["nbPlaces"]);

            $statement->execute();

            $statement = $pdo->prepare("SELECT notificationParMail FROM UTILISATEUR WHERE email=:mail");
            $statement->bindValue(":mail", $mail);
            $statement->execute();
            $notif= $statement->fetch();

            json_encode($notif["notificationParMail"]);

            if($notif["notificationParMail"] == 1){
                $mail = instanciateMailer();
                $mail->setFrom('trialling027@outlook.fr', 'Recuperation de compte TravelTogether');
                // Recipient, the name can also be stated
                $mail->addAddress("randomynot02@gmail.com", "name");
                $mail->Subject = ("Code de recuperation de compte"); //save temporary code in localstorage to compare against
                // HTML content
                $mail->Body = 'email';
                $mail->CharSet = 'UTF-8';
                $mail->Encoding = 'base64';
        
                $mail->send();
                json_encode("sending");
            }
        

            echo "ok";
        }else{
            echo "not enough places available";
        }
    }
    
}