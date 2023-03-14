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
$mail->setFrom('test@test.com', 'name');
// Recipient, the name can also be stated
$mail->addAddress('test@test.com', 'name');
$mail->Subject = 'test';
// HTML content
$mail->Body = 'test';
$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';
$mail-> send();

mail($to,$subject,$txt,$headers);


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
