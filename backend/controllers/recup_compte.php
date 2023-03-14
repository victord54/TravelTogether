<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
$mail->host = 'localhost';
$mail->Port = "25";
$mail->username = "";
$mail->password = "";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

$mail->setFrom('recup@traveltogether.fr', 'Recuperation de compte TravelTogether');
// Recipient, the name can also be stated
$mail->addAddress($_GET["mail"], "name");
$mail->Subject = ($_GET["code"]); //save temporary code in localstorage to compare against
// HTML content
$mail->Body = 'test';
$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';
$mail-> send();
echo json_encode("ok");
}





    /*$statement = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        if (password_verify($_GET['password'], $data['motDePasse'])) {
            $reponse = $data;
        }
    }

    echo json_encode($reponse);*/
    ?>
