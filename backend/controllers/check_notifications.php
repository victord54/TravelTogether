<?php
    include 'header.php';
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
       
        $statement = $pdo->prepare("SELECT * FROM notification WHERE etat='0' AND notifie=:notifie");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":notifie", $_GET['notifie']);
        $statement->execute();
        $data = $statement->fetchAll();
        

        echo json_encode($data);
    }