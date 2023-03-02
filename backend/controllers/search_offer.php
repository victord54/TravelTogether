<?php
    include "header.php";

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email)
        WHERE dateDepart = :dateDepart AND nbPlaceDisponible >= :nbPlaceDisponible");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":dateDepart", $_GET['dateDepart']);
        $statement->bindValue(":nbPlaceDisponible", $_GET['nbPlaceDisponible']);
        $statement->execute();
        $data = $statement->fetchAll();

        $reponse = $data;

        echo json_encode($reponse);
    }

?>