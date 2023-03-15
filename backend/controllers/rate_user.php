<?php
include 'header.php';

$pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare("SELECT email, valeur FROM NOTE WHERE idfOffre = :idf");
    $statement->bindValue(":idf", $_GET["id"]);
    $ok = $statement->execute();
    $data = $statement->fetchAll();
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $size = count($_POST);
    $rater = $_POST["rater"];
    $offer = $_POST["offer"];
    $ok = true;
    foreach ($_POST as $k => $v) {
        if ($k == "rater" || $k == "offer") {
            continue;
        } else {
            $mail = str_replace('_', '.', $k);
            $statement = $pdo->prepare("INSERT INTO NOTE(email, noteur, idfOffre, valeur) VALUES (:mail, :noteur, :idf, :val)");
            $statement->bindValue(":mail", $mail);
            $statement->bindValue(":noteur", $rater);
            $statement->bindValue(":idf", $offer);
            $statement->bindValue(":val", $v);
            $ok = $statement->execute();
        }
    }
    if ($ok)
        echo json_encode("OK");
}
