<?php

if(file_exists('../dbconnect/dbinfos.php')) include '../dbconnect/dbinfos.php';
else {
    $login = 'root';
    $password = 'mysql';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);

    $statement = $pdo->prepare("INSERT INTO groupe(idfGroupe, nomDeGroupe, dirigeant) values(:idf, :nom, :dig)");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":idf", $_GET["mail"]); //change rien
    $statement->bindValue(":nom", $_POST["nom"]);
    $statement->bindValue(":dig", $_POST["mail"]);
    if(!$statement->execute()){
        echo "died";
    }

}


?>