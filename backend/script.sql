\W DROP DATABASE IF EXISTS travel_together;

CREATE DATABASE travel_together;

USE travel_together;

CREATE TABLE
    UTILISATEUR(
        email VARCHAR(50) PRIMARY KEY,
        nom VARCHAR(50),
        prenom VARCHAR(50),
        numTel VARCHAR(10) NOT NULL DEFAULT "0000000000",
        genre CHAR(1) NOT NULL,
        motDePasse VARCHAR(60) NOT NULL,
        aUneVoiture BOOLEAN NOT NULL DEFAULT 0,
        notificationParMail BOOLEAN NOT NULL DEFAULT 0,
        photo VARCHAR(150)
    );

CREATE TABLE
    SUPERUTILISATEUR(
        email VARCHAR(50) PRIMARY KEY,
        FOREIGN KEY (email) REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    VILLE(
        nomVille VARCHAR(50),
        codePostal VARCHAR(5),
        PRIMARY KEY(nomVille, codePostal)
    );

CREATE TABLE
    GROUPE(
        idfGroupe INT PRIMARY KEY AUTO_INCREMENT,
        nomDeGroupe VARCHAR(50) NOT NULL,
        dirigeant VARCHAR(50) NOT NULL,
        FOREIGN KEY (dirigeant) REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    OFFRE(
        idfOffre INT PRIMARY KEY AUTO_INCREMENT,
        dateDepart DATE NOT NULL,
        heureDepart TIME NOT NULL,
        prix FLOAT NOT NULL,
        nbPlaceDisponible INT NOT NULL,
        precisions TEXT,
        infos TEXT,
        nomVilleDepart VARCHAR(50) NOT NULL,
        codePostalDepart VARCHAR(5) NOT NULL,
        nomVilleFin VARCHAR(50) NOT NULL,
        codePostalFin VARCHAR(5) NOT NULL,
        FOREIGN KEY (
            nomVilleDepart,
            codePostalDepart
        ) REFERENCES VILLE(nomVille, codePostal),
        FOREIGN KEY (nomVilleFin, codePostalFin) REFERENCES VILLE(nomVille, codePostal)
    );

CREATE TABLE
    OFFREPUBLIC(
        idfOffre INT PRIMARY KEY AUTO_INCREMENT,
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre)
    );

CREATE TABLE
    OFFREPRIVEE(
        idfOffre INT PRIMARY KEY AUTO_INCREMENT,
        idfGroupe INT NOT NULL,
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre),
        FOREIGN KEY (idfGroupe) REFERENCES GROUPE(idfGroupe)
    );

CREATE TABLE
    NOTE(
        email VARCHAR(50),
        noteur VARCHAR(50),
        idfOffre INT,
        valeur INT NOT NULL,
        PRIMARY KEY(email, noteur, idfOffre),
        FOREIGN KEY (email) REFERENCES UTILISATEUR(email),
        FOREIGN KEY (noteur) REFERENCES UTILISATEUR(email),
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre)
    );

CREATE TABLE
    NOTIFICATION(
        idfNotification INT PRIMARY KEY AUTO_INCREMENT,
        notifie VARCHAR(50) NOT NULL,
        informations TEXT NOT NULL,
        FOREIGN KEY (notifie) REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    NOTIFICATIONGROUPE(
        idfNotification INT PRIMARY KEY,
        idfGroupe INT NOT NULL,
        FOREIGN KEY (idfNotification) REFERENCES NOTIFICATION(idfNotification),
        FOREIGN KEY (idfGroupe) REFERENCES GROUPE(idfGROUPE)
    );

CREATE TABLE
    NOTIFICATIONOFFRE(
        idfNotification INT PRIMARY KEY,
        idfOffre INT NOT NULL,
        FOREIGN KEY (idfNotification) REFERENCES NOTIFICATION(idfNotification),
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre)
    );

CREATE TABLE
    NOTIFICATIONREPONSE(
        idfNotification INT PRIMARY KEY,
        idfOffre INT NOT NULL,
        interesse VARCHAR(50) NOT NULL,
        FOREIGN KEY (idfNotification) REFERENCES NOTIFICATION(idfNotification),
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre),
        FOREIGN KEY (interesse) REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    PASSE_PAR(
        idfOffre INT,
        nomVille VARCHAR(50),
        codePostal VARCHAR(5),
        PRIMARY KEY(idfOffre, nomVille, CodePostal),
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre),
        FOREIGN KEY (nomVille, codePostal) REFERENCES VILLE(nomVille, codePostal)
    );

CREATE TABLE
    APPARTIENT(
        email VARCHAR(50),
        idfGroupe INT,
        PRIMARY KEY(idfGroupe, email),
        FOREIGN KEY (email) REFERENCES UTILISATEUR(email),
        FOREIGN KEY (idfGroupe) REFERENCES GROUPE(idfGroupe)
    );