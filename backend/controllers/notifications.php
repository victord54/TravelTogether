<?php
include 'header.php';
$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare("SELECT * FROM NOTIFICATION WHERE notifie = :mail ORDER BY idfNotif DESC");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $statement = $pdo->prepare("DELETE FROM NOTIFICATION WHERE idfNotif=:idf");
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu supprimes " . $_GET["idf"]);
}
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET statutReponse=(:ref), etat=1 WHERE idfNotif=(:idf)");
    
    //https://stackoverflow.com/questions/44799589/php-post-array-empty-on-axios-post solution credit
    $body = file_get_contents('php://input');

    // Parse json body and notify when error occurs
    $data = json_decode($body, true);
    
    print_r($data);
    $statement->bindValue(":idf", $data["idf"]);
    $statement->bindValue(":ref", $data["ref"]);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu as change le statut de la notification " . $data["ref"]);
    $statement = $pdo->prepare("SELECT * FROM NOTIFICATION WHERE idfNotif=(:idf)");
    $statement->bindValue(":idf", $data["idf"]);
    $statement->execute();
    $data2 = $statement->fetchAll();
    echo json_encode($data2[0]["interesse"]);
    $statement = $pdo->prepare("INSERT INTO NOTIFICATION (typeNotif, dateNotif, notifie, etat, informations) 
    VALUES (:typeNotif, :dateNotif, :notifie, :etat, :info)");
    $statement->bindValue(":typeNotif", "Reponse");
    $statement->bindValue(":dateNotif", date('y-m-d'));
    $statement->bindValue(":notifie", $data2[0]["interesse"]);
    $statement->bindValue(":etat", 0);
    
    $statement->bindValue(":info", "Vous avez été ".substr($data["ref"], 0, -1)." pour votre voyage.");
    $statement->execute();
}
