<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
  $statement = $pdo->prepare("UPDATE NOTIFICATION SET statutReponse = 'annuler' WHERE idfOffre = :idfOffre AND interesse = :mail");

  $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
  $statement->bindValue(":mail", $_POST["mail"]);

  $statement->execute() or die(print_r($statement->errorInfo(), true));


  $statement = $pdo->prepare("SELECT notifie, interesse FROM NOTIFICATION WHERE idfOffre = :idfOffre");
  $statement->bindValue(":idfOffre", $_POST["idfOffre"]);
  $statement->execute() or die(print_r($statement->errorInfo(), true));
  $data = $statement->fetch();


  $information = $data["interesse"].' a annulé sa participation à votre trajet';
  $statement = $pdo->prepare("INSERT INTO NOTIFICATION(typeNotif, dateNotif, notifie, interesse, informations) VALUES('AnnulationParticipation', :dateNotif, :notifie, :interesse, :informations)");
  $statement->bindValue(':dateNotif', date('y-m-d'));
  $statement->bindValue(':notifie', $data["notifie"]);
  $statement->bindValue(':interesse', $data["interesse"]);
  $statement->bindValue(':informations', $information);
  $statement->execute() or die(print_r($statement->errorInfo(), true));

  echo 1;
}
