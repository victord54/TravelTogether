import "../styles/Profil.css";
import { useState } from "react";
import { useAuth } from "../components/AuthProvider"
import React from "react"
import axios from "axios";
import { url_api } from "../data/url_api";
import { Link } from "react-router-dom";
import { redirect, useHistory, Navigate } from 'react-router-dom'


function Profil() {

    const { auth } = useAuth();
    const initialValue = {
        lastName: localStorage.getItem("prenom"),
        firstName: localStorage.getItem("nom"),
        password: "",
        passwordConfirmation: "",
        phoneNumber: localStorage.getItem("numTel"),
        gender: localStorage.getItem("genre"),
        car: localStorage.getItem("aUneVoiture"),
        mailUpdates: localStorage.getItem("notificationParMail")
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [isUser, setIsUser] = useState(false);
    const [file, setFile] = useState(null)
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    //Fonction qui affiche les informations du profil
    function affichageProfil() {
        console.log(localStorage.getItem('photo'))
        var contenu =
            <React.Fragment>
                <div className="wrapper-profil">
                    <div className="affichageActuel">
                        <p className="fonctionnel"> <strong> Profil actuel: </strong></p>
                        <div className="picture">
                            <img src={localStorage.getItem('photo')} height="175px" width="125px" />
                        </div>
                        <div className="profil-infos">
                            <ul>
                                <li> Nom : {localStorage.getItem("nom")}</li>
                                <li> Prénom : {localStorage.getItem("prenom")}</li>
                                <li> Genre :  {localStorage.getItem("genre")}</li>
                                <li> Numéro de tel : {localStorage.getItem("numTel")}</li>
                                <li> Possède une voiture : {localStorage.getItem("aUneVoiture") === "1" ? ("Oui") : ("Non")}</li>
                                <li> Notifications par mail : {localStorage.getItem("notificationParMail") === "1" ? ("Oui") : ("Non")}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="wrapper-nav">
                        <Link to="../Friends-groupe-list"><button className="Button-profil">Mes Groupes</button></Link><br />
                        <Link to="../modif-profile"><button className="Button-profil">Modifier mon profil</button></Link><br />
                        <button className="Button-profil">Supprimer mon compte</button>
                    </div>
                </div>
            </React.Fragment>;
        return contenu;
    }

    //Fonction qui teste.
    function test() {
        console.log("Das Test.");
    }


    return (
        <main>
            {affichageProfil()}
            <div className="wrapper-historique"><br /><br />
                HISTORIQUE DES TRAJETS ICI =)
            </div>
        </main>
    );

}

export default Profil;