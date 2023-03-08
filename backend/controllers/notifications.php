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
}
