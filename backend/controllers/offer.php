<?php 
include 'header.php';

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

function getMoyenne($pdo, $mail) {
    $statement = $pdo->prepare("SELECT avg(valeur) as moyenne FROM NOTE WHERE email = :mail");
    $statement->bindValue(":mail", $mail);
    $statement->execute();
    $data = $statement->fetch();

    if(count($data) > 0) {
        return $data["moyenne"];
    }
    return -1;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Offre page Offre
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    if(isset($_GET["idfOffre"]) && !(isset($_GET["type"]) && $_GET["type"] == "sizeInformation")) {
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE idfOffre = :idfOffre AND annule = 0");
        $statement->bindValue(":idfOffre", $_GET['idfOffre']);
        $statement->execute();
        $data = $statement->fetch();
    
        $statement = $pdo->prepare("SELECT ville FROM PASSE_PAR JOIN OFFRE USING(idfOffre)
        WHERE idfOffre = :idfOffre ORDER BY position");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":idfOffre", $_GET['idfOffre']);
        $statement->execute();
        $inter = $statement->fetchAll();

        foreach($inter as $indexVille=>$ville) {
            $test = getCity($ville["ville"]);
            $data["inter"][$indexVille] = $test;
        }

        $villeDep = getCity($data["villeDepart"]);
        $data["villeDepart"] = $villeDep;
        $villeArrivee = getCity($data["villeArrivee"]);
        $data["villeArrivee"] = $villeArrivee;

        $statement = $pdo->prepare("SELECT interesse, statutReponse FROM NOTIFICATION WHERE idfOffre = :idfOffre AND typeNotif = 'Reponse';");
        $statement->bindValue(":idfOffre", $_GET['idfOffre']);
        $statement->execute();
        $rep = $statement->fetchAll();
        $data["reponses"] = $rep;
        $data["note"] = getMoyenne($pdo, $data["email"]);
        $data["nbPlaceDisponible"] = getNbPlacesDispo($pdo, $data["idfOffre"], $data["nbPlaceDisponible"]);

        $reponse = $data;
    } else if ((isset($_GET["type"]) && $_GET["type"] == "nbOffer")) {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
        $statement =  $pdo->prepare("SELECT count(idfOffre) as nbOffre FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND (email = :email OR 
        idfOffre in (SELECT idfOffre FROM NOTIFICATION WHERE interesse = :email AND statutReponse != 'refuser'))");

        $statement->bindValue(":email", $_GET['email']);
        $statement->execute();
        $res = 0;
        $data = $statement->fetch();
        if(count($data) == 0) $data["nbOffre"] = $res;
        $reponse = $data;
    } else if (isset($_GET["type"]) && $_GET["type"] == "historique") {
        // Offre historique
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND (email = :email OR 
        idfOffre in (SELECT idfOffre FROM NOTIFICATION WHERE interesse = :email AND statutReponse not in ('refuser', 'annuler'))) ORDER BY DateDepart LIMIT 5 OFFSET :offs");
        $statement->bindValue(":email", $_GET['email']);
        $statement->bindValue(":offs", $_GET['offset'], PDO::PARAM_INT);
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
            $data[$index]["note"] = getMoyenne($pdo, $offer["email"]);
            $data[$index]["nbPlaceDisponible"] = getNbPlacesDispo($pdo, $data[$index]["idfOffre"], $data[$index]["nbPlaceDisponible"]);
        }
    
        $reponse = $data;
    } else if ((isset($_GET["type"]) && $_GET["type"] == "adminNbOffer")) {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
        $statement =  $pdo->prepare("SELECT count(idfOffre) as nbOffre FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND email = :email");

        $statement->bindValue(":email", $_GET['email']);
        $statement->execute();
        $res = 0;
        $data = $statement->fetch();
        if(count($data) == 0) $data["nbOffre"] = $res;
        $reponse = $data;
    } else if (isset($_GET["type"]) && $_GET["type"] == "sizeInformation") {
        // Offre form modifOffre
        $statement = $pdo->prepare("SELECT idfOffre, dateDepart, heureDepart, prix, nbPlaceDisponible, precisions, infos, sum(nbPlaceSouhaitees) as nbPlacesReserves FROM OFFRE JOIN NOTIFICATION USING (idfOffre) where typeNotif = 'reponse' AND statutReponse = 'accepter' AND idfOffre = :idfOffre GROUP BY idfOffre;");
        $statement->bindValue(":idfOffre", $_GET['idfOffre']);
        $statement->execute();
        $data = $statement->fetchAll();
        
        if(count($data) <= 0) {
            $statement = $pdo->prepare("SELECT idfOffre, dateDepart, heureDepart, prix, nbPlaceDisponible, precisions, infos FROM OFFRE JOIN UTILISATEUR USING(email) WHERE idfOffre = :idfOffre");
            $statement->bindValue(":idfOffre", $_GET['idfOffre']);
            $statement->execute();
            $data = $statement->fetch();
            $data["nbPlacesReserves"] = 0;
        } else {
            $data = $data[0];
        }
    
        $reponse = $data;
    } else if (isset($_GET["type"]) && $_GET["type"] == "admin historique") {
        // Offre historique Admin
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND email = :email ORDER BY DateDepart LIMIT 5 OFFSET :offs");
        $statement->bindValue(":email", $_GET['email']);
        $statement->bindValue(":offs", $_GET['offset'], PDO::PARAM_INT);
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
            $data[$index]["note"] = getMoyenne($pdo, $offer["email"]);
            $data[$index]["nbPlaceDisponible"] = getNbPlacesDispo($pdo, $data[$index]["idfOffre"], $data[$index]["nbPlaceDisponible"]);
        }
    
        $reponse = $data; 
    } else {
        // Offres du main
        /*$statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND dateDepart > :dateDepart AND (email = :email OR 
        idfOffre in (SELECT idfOffre FROM NOTIFICATION WHERE interesse = :email AND statutReponse not in ('refuser', 'annuler'))) ORDER BY DateDepart LIMIT 10");*/
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND dateDepart > :dateDepart AND (email = :email OR 
        idfOffre in (SELECT idfOffre FROM OFFREPUBLIC) OR idfOffre in (SELECT idfOffre from OFFREPRIVEE where idfGroupe in (SELECT idfGroupe from APPARTIENT where email = :email))) ORDER BY DateDepart LIMIT 10");
        $statement->bindValue(":email", $_GET['email']);
        $statement->bindValue(":dateDepart", date('Y-m-d H:i:s'));
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
            $data[$index]["note"] = getMoyenne($pdo, $offer["email"]);
            $data[$index]["nbPlaceDisponible"] = getNbPlacesDispo($pdo, $data[$index]["idfOffre"], $data[$index]["nbPlaceDisponible"]);
        }
    
        $reponse = $data;
    }

    echo json_encode($reponse);
}


?>
