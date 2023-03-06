<?php
    include "header.php";

    function getCity($code) {
        $res = "";
        $fh = fopen("https://geo.api.gouv.fr/communes?code=".$code."&fields=nom,codesPostaux&format=json&geometry=centre", 'r');
        while(! feof($fh)) $res .= fread($fh, 1048576);
        $res = json_decode($res, true);
        try {
            return $res[0];
        } catch (Exception $e){
            $res["nom"] = $code;
            return $res;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');
        $statement = $pdo->prepare("SELECT * FROM OFFRE o JOIN UTILISATEUR USING(email)
        WHERE dateDepart = :dateDepart AND nbPlaceDisponible >= :nbPlaceDisponible AND
        (idfOffre in (
            SELECT idfOffre
            FROM Passe_par P1
            WHERE P1.ville = :villeDepart AND idfOffre in (
                SELECT idfOffre
                FROM Passe_par P2
                WHERE P2.ville = :villeArrivee AND P1.position < P2.position
            )
        )   OR (villeDepart = :villeDepart AND :villeArrivee in (SELECT ville FROM PASSE_PAR WHERE idfOffre = o.idfOffre))
            OR (villeArrivee = :villeArrivee AND :villeDepart in (SELECT ville FROM PASSE_PAR WHERE idfOffre = o.idfOffre)))
            OR(villeDepart = :villeDepart AND (villeArrivee = :villeArrivee))");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":dateDepart", $_GET['dateDepart']);
        $statement->bindValue(":nbPlaceDisponible", $_GET['nbPlaceDisponible']);
        $statement->bindValue(":villeDepart", $_GET['villeDepart']);
        $statement->bindValue(":villeArrivee", $_GET['villeArrivee']);
        $statement->execute();
        $data = $statement->fetchAll();

        foreach($data as $index=>$offer) {
            $villeDep = getCity($offer["villeDepart"]);
            $data[$index]["villeDepart"] = $villeDep["nom"];
            $villeArrivee = getCity($offer["villeArrivee"]);
            $data[$index]["villeArrivee"] = $villeArrivee["nom"];


            $statement = $pdo->prepare("SELECT ville FROM PASSE_PAR JOIN OFFRE USING(idfOffre)
            WHERE idfOffre = :idfOffre ORDER BY position");
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $statement->bindValue(":idfOffre", $offer['idfOffre']);
            $statement->execute();
            $villes = $statement->fetchAll();
            
            foreach($villes as $indexVille=>$ville) {
                $test = getCity($ville["ville"]);
                $data[$index]["inter"][$indexVille] = $test["nom"];
            }
        }
        
        $reponse = $data;

        echo json_encode($reponse);
    }

?>