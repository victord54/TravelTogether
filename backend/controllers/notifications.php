<?php
include 'header.php';
$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare("SELECT * FROM NOTIFICATION WHERE notifie = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetchAll();
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    echo json_encode("j'ai bien reçu que tu as lu " . $_GET["idf"]);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    echo json_encode("j'ai bien reçu que tu supprimes " . $_GET["idf"]);
}
