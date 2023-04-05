<?php
include 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = new PDO('mysql:host=localhost;dbname=travel_together;charset=utf8', $login, $password);
    $statement = $pdo->prepare("SELECT * FROM UTILISATEUR WHERE email = :mail");
    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $statement->bindValue(":mail", $_POST['mailAdmin']);
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

                    $statement = $pdo->prepare("SELECT idfOffre FROM OFFRE WHERE email = :email AND dateDepart > :dateDepart AND annule = 0");
                    $statement->bindValue(":email", $_POST['mail']);
                    $statement->bindValue(":dateDepart", date('Y-m-d H:i:s'));
                    $statement->execute() or die(print_r($statement->errorInfo(), true));
                    $data = $statement->fetchAll();

                    foreach($data as $offre) {
                        $statement = $pdo->prepare("UPDATE OFFRE SET annule = 1 WHERE idfOffre = :idfOffre");
                        $statement->bindValue(":idfOffre", $offre["idfOffre"]);
                        $statement->execute() or die(print_r($statement->errorInfo(), true));
                    }

                    // Supprimer l'utilisateur
                    $statement = $pdo->prepare("UPDATE UTILISATEUR SET nom = 'Utilisateur', prenom = 'Supprimé', notificationParMail = 0, estSupprime = 1, photo = :photo WHERE email = :mail");
                    $statement->bindValue(":mail", $_POST['mail']);
                    $statement->bindValue(":photo", $url . "/pictures/default.png");
                    $statement->execute() or die(print_r($statement->errorInfo(), true));

                    $pdo->commit();
                    echo json_encode(1);
            } catch (PDOException $e) {
                $pdo->rollBack();
                echo json_encode([$e->getMessage(), $e->getLine()]);
            }
        } else {
            echo json_encode(3);
        }
    } else {
        echo json_encode(4);
    }

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