<?php
include 'header.php';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_GET['mail']);
    $statement->execute();
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        if (password_verify($_GET['password'], $data['motDePasse'])) {
            $pdo->beginTransaction();

        try {

            // Supprimer les notes associées à l'utilisateur
            $statement = $pdo->prepare("DELETE FROM NOTE WHERE email = :mail");
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();

            // Supprimer les appartenance des utilisateurs aux groupes avant suppression du groupe
            $statement = $pdo->prepare("DELETE FROM APPARTIENT WHERE idfGroupe IN (SELECT idfGroupe FROM GROUPE WHERE dirigeant = :mail)");
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();

            // Supprimer les appartenance de l'utilisateur aux groupes dans lesquels il est dirigeant
            $statement = $pdo->prepare("DELETE FROM GROUPE WHERE dirigeant = :mail");
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();

            // Supprimer les appartenance de l'utilisateur aux groupes
            $statement = $pdo->prepare("DELETE FROM APPARTIENT WHERE email = :mail");
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();

            // Supprimer les notifications associées à l'utilisateur
            $statement = $pdo->prepare("DELETE FROM notification WHERE notifie = :mail OR interesse = :mail");
            $statement->bindValue(":mail", $_GET['mail']);
            $statement->execute();

            // Supprimer l'utilisateur
            $statement = $pdo->prepare("DELETE FROM UTILISATEUR WHERE email = :mail");
            $statement->bindValue(":mail", $_GET['mail']);
            $result = $statement->execute();

            $pdo->commit();
            echo json_encode($user);
        } catch (PDOException $e) {
            $pdo->rollBack();
            echo json_encode(['error' => 'Une erreur est survenue lors de la suppression de l\'utilisateur : ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Identifiants invalides']);
    }
        }
    }

    echo json_encode($reponse);

