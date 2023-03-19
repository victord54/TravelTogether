<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
include 'header.php';

/*Tester en local:
http://nilhcem.com/FakeSMTP/
https://github.com/PHPMailer/PHPMailer    
https://www.ionos.com/digitalguide/e-mail/technical-matters/phpmailer/

pour l'instant ne fonctionnera qu'en local
*/

require 'C:\phpmailer\PHPMailer-master\src\Exception.php';
require 'C:\phpmailer\PHPMailer-master\src\PHPMailer.php';
require 'C:\phpmailer\PHPMailer-master\src\SMTP.php';
$mail = new PHPMailer(TRUE);
$mail->isSMTP();
$mail->SMTPAuth = true;
// Personal data
$mail->Host = 'smtp-mail.outlook.com';
$mail->Port = "587";
$mail->Username = "trialling027@outlook.fr";
$mail->Password = "@!Password123";
$mail->SMTPSecure = "STARTTLS";

$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET["pass"] == null) {
   // $statement = $pdo->prepare("SELECT email FROM utilisateurs  WHERE email = :mail");
    //$statement->bindValue(":mail", $_GET["mail"]);
    //$statement->execute();
    //$data = $statement->fetch();
    //if($data){
    $mail->setFrom('trialling027@outlook.fr', 'Recuperation de compte TravelTogether');
    // Recipient, the name can also be stated
    $mail->addAddress($_GET["mail"], "name");
    $mail->Subject = ("Code de recuperation de compte"); //save temporary code in localstorage to compare against
    // HTML content
    $mail->Body = 'test';
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail-> send();
    echo json_encode("ok");
//}else{
   //     echo "lied";
   // }
}
if($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET["pass"] != null){
    $statement = $pdo->prepare("UPDATE utilisateurs set motDePasse = :pass WHERE email = :mail");
    $statement->bindValue(":pass", $_GET["pass"]);
    $statement->bindValue(":mail", $_GET["mail"]);
    $statement->execute();
    echo "ok";
}

    ?>
