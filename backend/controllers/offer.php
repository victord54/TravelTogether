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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
    
        $reponse = $data;
    } else if (isset($_GET["type"]) && $_GET["type"] == "historique") {
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND (email = :email OR 
        idfOffre in (SELECT idfOffre FROM NOTIFICATION WHERE interesse = :email AND statutReponse != 'refuser')) ORDER BY DateDepart");
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
        }
    
        $reponse = $data;
    } else if (isset($_GET["type"]) && $_GET["type"] == "sizeInformation") {
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
    } else {
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE annule = 0 AND dateDepart > :dateDepart AND
        idfOffre in (SELECT idfOffre from OFFREPUBLIC) OR idfOffre in (SELECT idfOffre FROM OFFREPRIVEE WHERE dateDepart > :dateDepart AND idfGroupe in (SELECT idfGroupe FROM APPARTIENT WHERE email = :email)) ORDER BY dateDepart LIMIT 10");
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
        }
    
        $reponse = $data;
    }

    echo json_encode($reponse);
}


?>
