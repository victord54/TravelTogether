<?php
include 'header.php';

if($_SERVER['REQUEST_METHOD'] === 'POST')
{
  $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
  $statement = $pdo->prepare("INSERT INTO APPARTIENT(email, idfGroupe) values (:email, :idfGroupe)");
  $statement->setFetchMode(PDO::FETCH_ASSOC);

  $statement->bindValue(":idfGroupe", $_POST["idfGroupe"]);
  $statement->bindValue(":email", $_POST["email"]);

  $statement->execute() or die(print_r($statement->errorInfo(), true));
  echo "1";
}

if($_SERVER['REQUEST_METHOD'] === 'GET')
{
  $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
  $statement = $pdo->prepare("SELECT email FROM UTILISATEUR WHERE email = :email AND estSupprime = 0");
  $statement->setFetchMode(PDO::FETCH_ASSOC);
  $statement->bindValue(":email", $_GET['email']);
  $statement->execute() or die(print_r($statement->errorInfo(), true));
  $data = $statement->fetch();

  $reponse = '0';
  if($data)
  {
    $reponse = '1';
  }

  echo json_encode($reponse);
}
