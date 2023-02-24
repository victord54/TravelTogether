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

if ($_SERVER['REQUEST_METHOD'] === 'GET' && strcmp($_GET['type'], 'list') == 0) {

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
        $var = 0;
        foreach($member as $memberStr) {
            if($var < 2) {
                $memberText = $memberText.$memberStr["email"].", ";
                $var += 1;
          } else {
            $var += 1;
          }
        } 
        if(strcmp($memberText, '') != 0) $memberText = mb_substr($memberText, 0, -2);
        if($var >= 2) $memberText = $memberText."...";
        $data[$key]['members'] = $memberText;
    }

    $reponse = $data;

    echo json_encode($reponse);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && strcmp($_GET['type'], 'one') == 0) {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT idfGroupe, nomDeGroupe, dirigeant FROM APPARTIENT JOIN GROUPE USING(idfGroupe) WHERE idfGroupe = :idfGroupe AND email = :mail UNION SELECT idfGroupe, nomDeGroupe, dirigeant FROM GROUPE WHERE idfGroupe = :idfGroupe AND dirigeant = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":idfGroupe", $_GET['idfGroupe']);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    if($data == false) {
        echo "";
    } else {
        $statement = $pdo->prepare("SELECT email FROM APPARTIENT WHERE idfGroupe = :idfGroupe");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":idfGroupe", $_GET['idfGroupe']);
        $statement->execute();
        $member = $statement->fetchAll();
    
        $memberText = "";
        foreach($member as $memberStr) $memberText = $memberText.$memberStr["email"].", ";
        if(strcmp($memberText, '') != 0) $memberText = mb_substr($memberText, 0, -2);
        $data['members'] = $memberText;
    
        $reponse = $data;
    
        echo json_encode($reponse);
    }
}


?>