<?php 
include 'header.php';

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
        $data["inter"] = $statement->fetchAll();
    
        $reponse = $data;
    } else {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
        $statement = $pdo->prepare("SELECT * FROM OFFRE JOIN UTILISATEUR USING(email)");
        $statement->execute();
        $data = $statement->fetchAll();
    
        foreach($data as $index=>$offer) {
            $statement = $pdo->prepare("SELECT ville FROM PASSE_PAR JOIN OFFRE USING(idfOffre)
            WHERE idfOffre = :idfOffre ORDER BY position");
            $statement->setFetchMode(PDO::FETCH_ASSOC);
            $statement->bindValue(":idfOffre", $offer['idfOffre']);
            $statement->execute();
            $data[$index]["inter"] = $statement->fetchAll();
        }
    
        $reponse = $data;
    }

    echo json_encode($reponse);
}


?>