import "../styles/Profil.css";
import { useState } from "react";
import {useAuth} from "../components/AuthProvider"
import React from "react"
import axios from "axios";
import { url_api } from "../data/url_api";
import { Link } from "react-router-dom";
import  { redirect, useHistory, Navigate} from 'react-router-dom'


function Profil(){

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

    //Fonction qui retourne une des trucs si l'utilisateur est co ou non
    function affichageBienvenue(){
        var message;
        if(auth){
            message = 
            <nav>
                <ul>
                    <Link to="../">Retour</Link>
                    <Link to="../Friends-groupe-list">Mes Groupes</Link>
                    <Link to="../modif-profile">Modifier mon profil</Link>
                </ul>
            </nav>
            ;
        }
        else{
            message = <h3 className="par-pitié-sois-centré"> Il semblerait que vous ne soyez pas connecté. </h3>;
        }
        return message;
    }

    //Fonction qui affiche les informations du profil
    function affichageProfil(){
        var contenu =
            <React.Fragment> 
            <div className="affichageActuel">
            <p className="fonctionnel"> <strong> Profil actuel: </strong></p>
            <ul> 
                <li> Nom : {localStorage.getItem("nom")}</li>
                <li> Prénom : {localStorage.getItem("prenom")}</li>
                <li> Genre :  {localStorage.getItem("genre")}</li>
                <li> Numéro de tel : {localStorage.getItem("numTel")}</li>
                <li> Possède une voiture : {localStorage.getItem("aUneVoiture") == 1 ? ("Oui") : ("Non")}</li>
                <li> Notifications par mail : {localStorage.getItem("notificationParMail") == 1 ? ("Oui") : ("Non")}</li>
            </ul>
            </div>
            </React.Fragment>;
        return contenu;
    }
 
    //Fonction qui teste.
    function test(){
        console.log("Das Test.");
    }
    

        return (
            <main>
                {affichageBienvenue()}
                {affichageProfil()}
            </main>
        );
    
}

export default Profil;