<?php
include 'header.php';

if($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['delete'])) {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM OFFRE WHERE (email = :mail OR idfOffre in (SELECT idfOffre FROM NOTIFICATION WHERE statutReponse IN ('attente', 'accepter') AND interesse = 0))
    AND (dateDepart > :dateDepart OR (dateDepart = :dateDepart AND heureDepart >= :heureDepart)) 
    AND annule = 0");
    $statement->bindValue(":mail", $_GET['email']);
    $statement->bindValue(":dateDepart", date('Y-m-d H:i:s'));
    $statement->bindValue(":heureDepart", date('H:i:s'));
    $statement->execute();
    $data = $statement->fetchAll();

    $reponse = empty($data);
    echo json_encode($reponse);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_POST['mail']);
    $statement->execute();
    $data = $statement->fetch();

    $reponse = null;
    if ($data) {
        if (password_verify($_POST['password'], $data['motDePasse'])) {
            $pdo->beginTransaction();

            try {
                    // Supprimer les notes associées à l'utilisateur
                    $statement = $pdo->prepare("DELETE FROM NOTE WHERE email = :mail");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    // Supprimer les appartenance des utilisateurs aux groupes avant suppression du groupe
                    $statement = $pdo->prepare("DELETE FROM APPARTIENT WHERE idfGroupe IN (SELECT idfGroupe FROM GROUPE WHERE dirigeant = :mail)");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    // Supprimer les appartenance de l'utilisateur aux groupes dans lesquels il est dirigeant
                    $statement = $pdo->prepare("DELETE FROM GROUPE WHERE dirigeant = :mail");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    // Supprimer les appartenance de l'utilisateur aux groupes
                    $statement = $pdo->prepare("DELETE FROM APPARTIENT WHERE email = :mail");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    // Supprimer les notifications associées à l'utilisateur
                    $statement = $pdo->prepare("DELETE FROM NOTIFICATION WHERE notifie = :mail OR interesse = :mail");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    // Supprimer l'utilisateur
                    $statement = $pdo->prepare("UPDATE UTILISATEUR SET nom = 'Utilisateur', prenom = 'Supprimé', notificationParMail = 0, estSupprime = 1, photo = :photo WHERE email = :mail");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->bindValue(":photo", $url . "/pictures/default.png");
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    $pdo->commit();
                    echo json_encode(1);
            } catch (PDOException $e) {
                $pdo->rollBack();
                echo json_encode(['error' => 'Une erreur est survenue lors de la suppression de l\'utilisateur : ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['error' => 'Identifiants invalides']);
        }
    } else {
        echo json_encode("Mot de passe ou email incorrect !");
    }
}
