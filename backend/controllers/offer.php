<?php 
include 'header.php';

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
    if(isset($_GET["idfOffre"])) {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email) WHERE idfOffre = :idfOffre");
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
            $data["inter"][$indexVille] = $test["nom"];
        }

        $villeDep = getCity($data["villeDepart"]);
        $data["villeDepart"] = $villeDep["nom"];
        $villeArrivee = getCity($data["villeArrivee"]);
        $data["villeArrivee"] = $villeArrivee["nom"];
    
        $reponse = $data;
    } else {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email)");
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
    }

    echo json_encode($reponse);
}


?>