<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



//setup liens vers fichiers phpmailer requis
$exception = 'PHPMailer-master/src/Exception.php';
$mailer = 'PHPMailer-master/src/PHPMailer.php';
$smtp = 'PHPMailer-master/src/SMTP.php';

include 'header.php';


function instanciateMailer(){
    global $var1, $var2;
    //setup as included function, prep backup methods if outlook dies
    $mail = new PHPMailer(TRUE);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    // Personal data
    $mail->Host = 'smtp-mail.outlook.com';
    $mail->Port = "587";
    $mail->Username = $var1;
    $mail->Password = $var2;
    $mail->SMTPSecure = "STARTTLS";

    return $mail;
}

function templateMail($email){
    $mail = instanciateMailer();
    $mail->setFrom('trialling028@outlook.fr', 'TravelTogether');
        // Recipient, the name can also be stated
    $mail->addAddress("randomynot02@gmail.com", "name");
    $mail->Subject = ("Code de recuperation de compte"); //save temporary code in localstorage to compare against
        // HTML content
    $mail->Body = 'email';
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
}
?>