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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT idfGroupe, nomDeGroupe, dirigeant FROM APPARTIENT JOIN GROUPE USING(idfGroupe) WHERE email = :mail UNION SELECT idfGroupe, nomDeGroupe, dirigeant FROM GROUPE WHERE dirigeant = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();

    foreach($data as $key=>$groupe) {
        $statement = $pdo->prepare("SELECT email FROM APPARTIENT WHERE idfGroupe = :idfGroupe");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":idfGroupe", $groupe['idfGroupe']);
        $statement->execute();
        $member = $statement->fetchAll();

        $memberText = "";
        foreach($member as $memberStr) $memberText = $memberText.$memberStr["email"].", ";
        if(strcmp($memberText, '') != 0) $memberText = mb_substr($memberText, 0, -2);
        $data[$key]['members'] = $memberText;
    }

    $reponse = $data;

    echo json_encode($reponse);
}

?>