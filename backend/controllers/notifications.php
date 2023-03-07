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
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET etat=1 WHERE idfNotif=:idf");
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu as lu " . $_GET["idf"]);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $statement = $pdo->prepare("DELETE FROM NOTIFICATION WHERE idfNotif=:idf");
    $statement->bindValue(":idf", $_GET['idf']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu supprimes " . $_GET["idf"]);
}
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $statement = $pdo->prepare("UPDATE NOTIFICATION SET statutReponse=(:ref) AND etat='1' WHERE idfNotif=(:idf)"); //temporairement on considere accepte en tant que valeur unique 
    $statement->bindValue(":idf", $_POST['idf']);
    $statement->bindValue(":ref", $_POST['ref']);
    $statement->execute();
    echo json_encode("j'ai bien reçu que tu as change le statut de la notification " . $_POST["idf"]);
    //todo to finish: get interested user and send a notification of approval or disapproval
    //reminder set idNotification to idfNotif to align back with new script
}
