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
    GROUPE(
        idfGroupe INT PRIMARY KEY AUTO_INCREMENT,
        nomDeGroupe VARCHAR(50) NOT NULL,
        dirigeant VARCHAR(50) NOT NULL,
        FOREIGN KEY (dirigeant) REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    OFFRE(
        idfOffre INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(50) NOT NULL,
        dateDepart DATE NOT NULL,
        heureDepart TIME NOT NULL,
        prix FLOAT NOT NULL,
        nbPlaceDisponible INT NOT NULL,
        precisions TEXT,
        infos TEXT,
        villeDepart INT NOT NULL,
        villeArrivee INT NOT NULL,
        FOREIGN KEY (email) REFERENCES UTILISATEUR(email)
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
        idfNotif INT PRIMARY KEY AUTO_INCREMENT,
        typeNotif ENUM('groupe', 'offre', 'reponse'),
        dateNotif DATE NOT NULL,
        notifie VARCHAR(50) NOT NULL,
        idfGroupe INT DEFAULT NULL,
        idfOffre INT DEFAULT NULL,
        interesse VARCHAR(50) DEFAULT NULL,
        informations TEXT NOT NULL,
        etat BOOLEAN NOT NULL DEFAULT 0,
        statutReponse ENUM('attente', 'accepter', 'refuser'),
        FOREIGN KEY (notifie) REFERENCES UTILISATEUR(email),
        FOREIGN KEY (idfGroupe) REFERENCES GROUPE(idfGROUPE),
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre),
        FOREIGN KEY (interesse) REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    PASSE_PAR(
        idfOffre INT,
        ville INT,
        position INT NOT NULL,
        PRIMARY KEY(idfOffre, ville),
        FOREIGN KEY (idfOffre) REFERENCES OFFRE(idfOffre)
    );

CREATE TABLE
    APPARTIENT(
        email VARCHAR(50),
        idfGroupe INT,
        PRIMARY KEY(idfGroupe, email),
        FOREIGN KEY (email) REFERENCES UTILISATEUR(email),
        FOREIGN KEY (idfGroupe) REFERENCES GROUPE(idfGroupe)
    );