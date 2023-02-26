<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Disposition, Content-Type, Content-Length, Accept-Encoding");
    header("Content-type:application/json");

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    if(file_exists('../dbconnect/dbinfos.php')) include '../dbconnect/dbinfos.php';
    else {
        $login = 'root';
        $password = 'mysql';
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
       $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
      $statement = $pdo->prepare("DELETE FROM GROUPE WHERE idfGroupe = :idfGroupe AND dirigeant = :email");
      $statement->setFetchMode(PDO::FETCH_ASSOC);

      $statement->bindValue(":idfGroupe", $_POST["idfGroupe"]);
      $statement->bindValue(":email", $_POST["mail"]);

      $statement->execute() or die(print_r($statement->errorInfo(), true));
      echo "1";
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
        $statement = $pdo->prepare("SELECT motDePasse FROM UTILISATEUR WHERE email = :mail");
        $statement->setFetchMode(PDO::FETCH_ASSOC);
        $statement->bindValue(":mail", $_GET['mail']);
        $statement->execute() or die(print_r($statement->errorInfo(), true));
        $data = $statement->fetch();
    
        $reponse = null;
        if ($data) {
            if (password_verify($_GET['password'], $data['motDePasse'])) {
                $reponse = '1';
            } else {
                $reponse = '0';
            }
        }
    
        echo json_encode($reponse);
    }
?>