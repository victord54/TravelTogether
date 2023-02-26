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
    $statement = $pdo->prepare("SELECT idfGroupe, nomDeGroupe, nom, prenom FROM APPARTIENT JOIN UTILISATEUR USING(email) JOIN GROUPE USING(idfGroupe) WHERE email = :mail UNION SELECT idfGroupe, nomDeGroupe, nom, prenom FROM GROUPE, UTILISATEUR U  WHERE dirigeant = :mail AND U.email = dirigeant");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();

    foreach($data as $key=>$groupe) {
        $statement = $pdo->prepare("SELECT nom, prenom FROM APPARTIENT JOIN UTILISATEUR USING(email) WHERE idfGroupe = :idfGroupe");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":idfGroupe", $groupe['idfGroupe']);
        $statement->execute();
        $member = $statement->fetchAll();

        $memberText = "";
        $var = 0;
        foreach($member as $memberStr) {
            if($var < 2) {
                $memberText = $memberText.$memberStr["prenom"]." ".$memberStr["nom"].", ";
                $var += 1;
          } else {
            $var += 1;
          }
        } 
        if(strcmp($memberText, '') != 0) $memberText = mb_substr($memberText, 0, -2);
        if($var >= 2) $memberText = $memberText."...";
        $data[$key]['members'] = $memberText;
        $data[$key]['dirigeant'] = $groupe["prenom"]." ".$groupe["nom"];
    }

    $reponse = $data;

    echo json_encode($reponse);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && strcmp($_GET['type'], 'one') == 0) {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT idfGroupe, nomDeGroupe, nom, prenom FROM APPARTIENT A JOIN GROUPE USING(idfGroupe), UTILISATEUR u WHERE idfGroupe = :idfGroupe AND A.email = :mail AND U.email = :mail UNION SELECT idfGroupe, nomDeGroupe, nom, prenom FROM GROUPE, UTILISATEUR U WHERE idfGroupe = :idfGroupe AND dirigeant = :mail AND U.email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":idfGroupe", $_GET['idfGroupe']);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    if($data == false) {
        echo "";
    } else {
        $statement = $pdo->prepare("SELECT nom, prenom FROM APPARTIENT JOIN UTILISATEUR USING(email) WHERE idfGroupe = :idfGroupe");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":idfGroupe", $_GET['idfGroupe']);
        $statement->execute();
        $member = $statement->fetchAll();
    
        $memberText = "";
        foreach($member as $memberStr) $memberText = $memberText.$memberStr["prenom"]." ".$memberStr["nom"].", ";
        if(strcmp($memberText, '') != 0) $memberText = mb_substr($memberText, 0, -2);
        $data['members'] = $memberText;
        $data['dirigeant'] = $data["prenom"]." ".$data["nom"];
    
        $reponse = $data;
    
        echo json_encode($reponse);
    }
}


?>