<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if(file_exists('../dbconnect/dbinfos.php')) include '../dbconnect/dbinfos.php';
else {
    $login = 'root';
    $password = 'mysql';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    /*$data = json_decode(file_get_contents('php://input'), true);
    $inputValue = $data['data']['inputValue'];*/
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);


    if(!empty($_POST['password'])){ //mot de passe à changer
        $sqlInsert = "UPDATE UTILISATEUR
                    SET nom = :nom, prenom = :prenom, numTel = :numTel, genre = :genre, motDePasse = :motDePasse, aUneVoiture = :aUneVoiture, notificationParMail = :notificationParMail, photo = :photo
                    WHERE email = :email";
        $statement = $pdo->prepare($sqlInsert);
        $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $statement->bindValue(':motDePasse', $hash);
    }else{ //pas de mot de passe à changer
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
    if (strcmp($_POST['car'], 'yes') == 0) {
        $statement->bindValue(':aUneVoiture', 1);
    } else {
        $statement->bindValue(':aUneVoiture', 0);
    }
    if (strcmp($_POST['notification'], 'yes') == 0) {
        $statement->bindValue(':notificationParMail', 1);
    } else {
        $statement->bindValue(':notificationParMail', 0);
    }

    if (isset($_FILES['file'])) {
        $uploaddir = dirname(__FILE__, 2) . '/pictures';
        $ext = explode('/', $_FILES['file']['type']);
        $file_name = $uploaddir . '/' . $_POST['mail'] . '.' . $ext[1];
        echo $file_name;

        if (move_uploaded_file($_FILES['file']['tmp_name'], $file_name)) {
            $statement->bindValue(':photo', $file_name);
        } else {
            echo "There was an error uploading the file";
        }
    } else {
        $statement->bindValue(':photo', NULL);
    }

    $statement->execute() or die(print_r($statement->errorInfo(), true));;
    echo "Changements sauvegardés.";
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
?>