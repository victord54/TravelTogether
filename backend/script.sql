CREATE TABLE
    UTILISATEUR(
        email VARCHAR(50) PRIMARY KEY,
        nom VARCHAR(50),
        prenom VARCHAR(50),
        numTel VARCHAR(50) NOT NULL,
        genre CHAR(1) NOT NULL,
        motDePasse VARCHAR(60) NOT NULL,
        aUneVoiture BOOLEAN NOT NULL,
        notificationParMail BOOLEAN NOT NULL,
        photo VARCHAR(50)
    );

CREATE TABLE
    SUPERUTILISATEUR(
        email VARCHAR(50) PRIMARY KEY REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    VILLE(
        nomVille VARCHAR(50),
        codePostal VARCHAR(5),
        PRIMARY KEY(nomVille, codePostal)
    );

CREATE TABLE
    GROUPE(
        idfGroupe INT PRIMARY KEY,
        nomDeGroupe VARCHAR(50) NOT NULL,
        dirigeant VARCHAR(50) NOT NULL REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    OFFRE(
        idfOffre INT PRIMARY KEY,
        dateDepart DATE NOT NULL,
        heureDepart TIME NOT NULL,
        prix FLOAT NOT NULL,
        nbPlaceDisponible INT NOT NULL,
        precisions TEXT,
        infos TEXT,
        nomVilleDepart VARCHAR(50) NOT NULL REFERENCES VILLE(nomVille),
        codePostalDepart VARCHAR(5) NOT NULL REFERENCES VILLE(codePostal),
        nomVilleFin VARCHAR(50) NOT NULL REFERENCES VILLE(nomVille),
        codePostalFin VARCHAR(5) NOT NULL REFERENCES VILLE(codePostal)
    ) ENGINE = INNODB;

CREATE TABLE
    OFFREPUBLIC(
        idfOffre INT PRIMARY KEY REFERENCES OFFRE(idfOffre)
    );

CREATE TABLE
    OFFREPRIVEE(
        idfOffre INT PRIMARY KEY REFERENCES OFFRE(idfOffre),
        idfGroupe INT NOT NULL REFERENCES GROUPE(idfGroupe)
    );

CREATE TABLE
    NOTE(
        email VARCHAR(50) REFERENCES UTILISATEUR(email),
        noteur VARCHAR(50) REFERENCES UTILISATEUR(email),
        idfOffre INT REFERENCES OFFRE(idfOffre),
        valeur INT NOT NULL,
        PRIMARY KEY(email, noteur, idfOffre)
    );

CREATE TABLE
    NOTIFICATION(
        idfNotification INT PRIMARY KEY,
        notifie VARCHAR(50) NOT NULL REFERENCES UTILISATEUR(email),
        informations TEXT NOT NULL
    );

CREATE TABLE
    NOTIFICATIONGROUPE(
        idfNotification INT PRIMARY KEY REFERENCES NOTIFICATION(idfNotification),
        idfGroupe INT NOT NULL REFERENCES GROUPE(idfGROUPE)
    );

CREATE TABLE
    NOTIFICATIONOFFRE(
        idfNotification INT PRIMARY KEY REFERENCES NOTIFICATION(idfNotification),
        idfOffre INT NOT NULL REFERENCES OFFRE(idfOffre)
    );

CREATE TABLE
    NOTIFICATIONREPONSE(
        idfNotification INT PRIMARY KEY REFERENCES NOTIFICATION(idfNotification),
        idfOffre INT NOT NULL REFERENCES OFFRE(idfOffre),
        interesse VARCHAR(50) NOT NULL REFERENCES UTILISATEUR(email)
    );

CREATE TABLE
    PASSE_PAR(
        idfOffre INT REFERENCES OFFRE(idfOffre),
        nomVille VARCHAR(50) REFERENCES VILLE(nomVille),
        codePostal VARCHAR(5) REFERENCES VILLE(codePostal),
        PRIMARY KEY(idfOffre, nomVille, CodePostal)
    );

CREATE TABLE
    APPARTIENT(
        email VARCHAR(50) REFERENCES UTILISATEUR(email),
        idfGroupe INT REFERENCES GROUPE(idfGroupe),
        PRIMARY KEY(idfGroupe, email)
    );