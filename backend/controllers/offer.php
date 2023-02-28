<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
header("Content-type:application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (file_exists('./dbconnect/dbinfos.php')) include './dbconnect/dbinfos.php';
else {
    $login = 'root';
    $password = 'mysql';
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM offre");
    $statement->execute();
    $data = $statement->fetchAll();
    $reponse = $data;

    echo json_encode($reponse);
}


?>