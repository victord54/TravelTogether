<?php
include 'header.php';
$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare("SELECT * FROM NOTIFICATION WHERE notifie = :mail ORDER BY idfNotification DESC");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET etat=1 WHERE idfNotification=:idf");
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu as lu " . $_GET["idf"]);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $statement = $pdo->prepare("DELETE FROM NOTIFICATION WHERE idfNotification=:idf");
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu supprimes " . $_GET["idf"]);
}
else if ($_SERVER['REQUEST_METHOD'] === 'RESPONSE') {
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET status='accepter' WHERE idfNotification=:idf"); //temporairement on considere accepte en tant que valeur unique 
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu supprimes " . $_GET["idf"]);
    //todo to finish: get interested user and send a notification of approval or disapproval
    //reminder set idNotification to idfNotif to align back with new script
}
