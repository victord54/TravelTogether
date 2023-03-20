<?php
    include "header.php";

    function getCity($code) {
        $infos = file_get_contents("https://geo.api.gouv.fr/communes?code=".sprintf( '%05d', $code )."&fields=nom,codesPostaux&format=json&geometry=centre");
        $infos = json_decode($infos, true);
    
        $res = $infos[0]["nom"]." (";
        $res = $res.substr($infos[0]["codesPostaux"][0], 0, 2);
        $res .= ")";
        return $res;
    }

    function getNbPlacesDispo($pdo, $idfOffre, $nbPlace) {
        $statement = $pdo->prepare("SELECT sum(nbPlaceSouhaitees) as nbPlacesReserves FROM OFFRE JOIN NOTIFICATION USING (idfOffre) where typeNotif = 'reponse' AND statutReponse = 'accepter' AND idfOffre = :idfOffre GROUP BY idfOffre;");
        $statement->bindValue(":idfOffre", $idfOffre);
        $statement->execute();
        $data = $statement->fetchAll();
    
        $res = $nbPlace;
    
        if(count($data) > 0) $res = $nbPlace - $data[0]["nbPlacesReserves"];
        return $res;
    }  

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', 'travel_together', 'travel_together');
        $statement = $pdo->prepare("SELECT *, ABS(TIME_TO_SEC(o.heureDepart) - TIME_TO_SEC(:heure)) as diffTemps FROM OFFRE o JOIN UTILISATEUR USING(email)
        WHERE annule = 0 AND dateDepart = :dateDepart AND nbPlaceDisponible >= :nbPlaceDisponible AND
        (idfOffre in (SELECT idfOffre FROM OFFREPUBLIC)
        OR idfOffre in (SELECT idfOffre FROM OFFREPRIVEE JOIN GROUPE USING (idfGroupe) WHERE
        idfGroupe in (SELECT idfGroupe FROM APPARTIENT WHERE email = :email)))
        AND
        (idfOffre in (
            SELECT idfOffre
            FROM PASSE_PAR P1
            WHERE P1.ville = :villeDepart AND idfOffre in (
                SELECT idfOffre
                FROM PASSE_PAR P2
                WHERE P2.ville = :villeArrivee AND P1.position < P2.position
            )
        )   OR (villeDepart = :villeDepart AND :villeArrivee in (SELECT ville FROM PASSE_PAR WHERE idfOffre = o.idfOffre))
            OR (villeArrivee = :villeArrivee AND :villeDepart in (SELECT ville FROM PASSE_PAR WHERE idfOffre = o.idfOffre)))
            OR(villeDepart = :villeDepart AND (villeArrivee = :villeArrivee))
        ORDER BY diffTemps");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":dateDepart", $_GET['dateDepart']);
        $statement->bindValue(":nbPlaceDisponible", $_GET['nbPlaceDisponible']);
        $statement->bindValue(":villeDepart", $_GET['villeDepart']);
        $statement->bindValue(":villeArrivee", $_GET['villeArrivee']); 
        $statement->bindValue(":heure", $_GET['heure']);
        $statement->bindValue(":email", $_GET['email']);
        $statement->execute();
        $data = $statement->fetchAll();

        foreach($data as $index=>$offer) {
            $villeDep = getCity($offer["villeDepart"]);
            $data[$index]["villeDepart"] = $villeDep;
            $villeArrivee = getCity($offer["villeArrivee"]);
            $data[$index]["villeArrivee"] = $villeArrivee;


            $statement = $pdo->prepare("SELECT ville FROM PASSE_PAR JOIN OFFRE USING(idfOffre)
            WHERE idfOffre = :idfOffre ORDER BY position");
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $statement->bindValue(":idfOffre", $offer['idfOffre']);
            $statement->execute();
            $villes = $statement->fetchAll();
            
            foreach($villes as $indexVille=>$ville) {
                $test = getCity($ville["ville"]);
                $data[$index]["inter"][$indexVille] = $test;
            }
            $data[$index]["nbPlaceDisponible"] = getNbPlacesDispo($pdo, $data[$index]["idfOffre"], $data[$index]["nbPlaceDisponible"]);
        }
        
        $reponse = $data;

        echo json_encode($reponse);
    }

?>