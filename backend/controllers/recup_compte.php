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

$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET["pass"] == "0") {
    $statement = $pdo->prepare("SELECT email FROM utilisateur  WHERE email = :mail");
    $statement->bindValue(":mail", $_GET["mail"]);
    $statement->execute();
    $data = $statement->fetch();
    if($data){
        $mail->setFrom('trialling027@outlook.fr', 'Recuperation de compte TravelTogether');
        // Recipient, the name can also be stated
        $mail->addAddress($_GET["mail"], "name");
        $mail->Subject = ("Code de recuperation de compte"); //save temporary code in localstorage to compare against
        // HTML content
        $mail->Body = 'Votre code de recuperation de compte TravelTogether est '.$_GET["code"];
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail-> send();
        echo json_encode("ok");
    }else{
        echo json_encode("lied");
   }
}
if($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET["pass"] != "0"){
    $statement = $pdo->prepare("UPDATE utilisateur set motDePasse = :pass WHERE email = :mail");
    $hash = password_hash($_GET["pass"], PASSWORD_DEFAULT);
    $statement->bindValue(":pass", $hash);
    $statement->bindValue(":mail", $_GET["mail"]);
    $statement->execute();
    echo json_encode("ok");
}


/**currently broken:
   - if wrong email, state changes anyway
        - set to display error
   - not checking password conformity
   **/ 
    ?>


