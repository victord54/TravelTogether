<?php
include 'header.php';

if($_SERVER['REQUEST_METHOD'] === 'GET')
{
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    if($_GET["type"] == "users") {
        $statement = $pdo->prepare("SELECT email, nom, prenom, photo FROM UTILISATEUR WHERE estSupprime = 0 ORDER BY nom LIMIT 10 OFFSET :offs");
        $statement->bindValue(":offs", $_GET['offset'], PDO::PARAM_INT);
        $statement->execute();
        $data = $statement->fetchAll();

        foreach($data as $key=>$mail) {
            $statement = $pdo->prepare("SELECT email FROM SUPERUTILISATEUR WHERE email = :mail");
            $statement->bindValue(":mail", $mail["email"]);
            $statement->execute();
            $res = $statement->fetchAll();

            $data[$key]["estAdmin"] = count($res) == 0 ? "0" : "1";
        }

        $reponse = $data;
    } else if ($_GET["type"] == "size") {
        $statement = $pdo->prepare("SELECT count(email) as size FROM UTILISATEUR WHERE estSupprime = 0");
        $statement->execute();
        $data = $statement->fetch();
        $reponse = $data["size"];
    }

    echo json_encode($reponse);
}

?>