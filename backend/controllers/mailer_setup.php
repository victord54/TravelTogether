<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


//setup liens vers fichiers phpmailer requis
$exception = 'PHPMailer-master/src/Exception.php';
$mailer = 'PHPMailer-master/src/PHPMailer.php';
$smtp = 'PHPMailer-master/src/SMTP.php';

function instanciateMailer(){
    //setup as included function, prep backup methods if outlook dies
    $mail = new PHPMailer(TRUE);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    // Personal data
    $mail->Host = 'smtp-mail.outlook.com';
    $mail->Port = "587";
    $mail->Username = "trialling027@outlook.fr";
    $mail->Password = "@!Password123";
    $mail->SMTPSecure = "STARTTLS";

    return $mail;
}

function templateMail($email){
    $mail = instanciateMailer();
    $mail->setFrom('trialling027@outlook.fr', 'Recuperation de compte TravelTogether');
        // Recipient, the name can also be stated
    $mail->addAddress("randomynot02@gmail.com", "name");
    $mail->Subject = ("Code de recuperation de compte"); //save temporary code in localstorage to compare against
        // HTML content
    $mail->Body = 'email';
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
}
?>