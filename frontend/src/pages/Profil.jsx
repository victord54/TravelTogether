import "../styles/Profil.css";
import { useState } from "react";
import {useAuth} from "../components/AuthProvider"
import React from "react"
import axios from "axios";
import { url_api } from "../data/url_api";

function Profil(){

    const { auth } = useAuth();
    const initialValue = {
        lastName: localStorage.getItem("nom"),
        firstName: localStorage.getItem("prenom"),
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

    //Fonction qui retourne une des trucs si l'utilisateur est co ou non
    function affichageBienvenue(){
        var message;
        if(auth){
            message = <h3 className="par-pitié-sois-centré"> Modification du profil de {localStorage.getItem("nom")} {localStorage.getItem("prenom")} </h3>;
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
                <li> Possède une voiture : {localStorage.getItem("aUneVoiture") ? ("Oui") : ("Non")}</li>
                <li> Notifications par mail : {localStorage.getItem("notificationParMail") ? ("Oui") : ("Non")}</li>
            </ul>
            </div>
            </React.Fragment>;
        return contenu;
    }
 
    //Fonction qui teste.
    function test(){
        console.log("zebi");
    }

    function handleChange(event) {
        console.log("handleChange()");
        setInputValues({ ...formValues, [event.target.name]: event.target.value });
    }

    //Fonction qui gère et affiche tout ce qui est relatif aux modifs; IMPLÉMENTER DES VÉRIFICATIONS
    function modificationProfil(){ //éventuellement rajouter des onChange pour vérifier que l'utilisateur ne rentre pas nimp
        
        return(
            <form onSubmit={submitFormulaire} className="form-box">
            <p> <strong> Modifications: </strong></p>
            <h3 className="pasFait"> Non implémenté : vérification des informations, photo de profil et notifications/voiture </h3>
            <ul className="liste-sans-puces"> 
                <li> Nom :  <input
                                type="text" name="firstName" className="fullTexte" value={formValues.firstName} onChange={handleChange}
                            ></input> </li>
                <li> Prénom : <input
                                type="text" name="lastName" className="fullTexte" value={formValues.lastName} onChange={handleChange}
                            ></input></li>
                <li className="radio"> Genre :
                            <input
                                type="radio"
                                name="gender"
                                className="not-text-input radiobutton"
                                value="f"
                                onChange={handleChange}
                            ></input>
                            Femme
                            <input
                                type="radio"
                                name="gender"
                                className="not-text-input radiobutton"
                                value="h"
                                onChange={handleChange}
                            ></input>
                            Homme
                            <input
                                type="radio"
                                name="gender"
                                className="not-text-input radiobutton"
                                value="n"
                                onChange={handleChange}
                            ></input>
                            Neutre
                            </li>
                <li> Numéro de tel : <input
                                type="text" name="phoneNumber" className="fullTexte" value={formValues.phoneNumber} onChange={handleChange}
                            ></input></li>
                <li className="àAmeliorer"> Possède une voiture : (pété) <input
                                type="checkbox" name="car" className="checkBox" defaultChecked={localStorage.getItem("aUneVoiture") ? ("true") : ("false")} onChange={handleChange}
                            ></input></li>
                <li className="àAmeliorer"> Notifications par mail : (pété) <input
                                type="checkbox" name="mailUpdates" className="checkBox" defaultChecked={localStorage.getItem("notificationParMail") ? ("true") : ("false")} onChange={handleChange}
                            ></input></li>
                <li> Mot de passe : <input
                                type="password" name="password" className="fullTexte" value={formValues.password} onChange={handleChange}
                            ></input></li>
                <li> Confirmation Mot de Passe : <input
                                type="password" name="passwordConfirmation" className="fullTexte" value={formValues.passwordConfirmation} onChange={handleChange}
                            ></input></li>
            </ul>
            <button type="submit" className="formulaire-submit"> Valider changements </button>
            </form>
        );
    }

    //Appel de la validation formulaire
    function submitFormulaire(evenement) {
        evenement.preventDefault();
        console.log("Handle formulaire");
        //dans les normes des choses, la place de la vérification c'est ici!
        reparerDonnees();
        sendDataToServer();
    }

    //Fonction de débug pour contrer un problème de checkbox
    function reparerDonnees(){
        //données où on ne change rien (valeur automatique) : lastName, firstName, password & confirmation, phoneNumber
        //car et mailUpdates sont pour le moment pétées, donc on considère qu'on ne change rien.
        formValues.car= localStorage.getItem("aUneVoiture");
        formValues.mailUpdates= localStorage.getItem("notificationParMail");
        console.log("Données réparées, voiture et notification ignorées.")
    }


    function sendDataToServer() {
        console.log("Envoi des changements.");

        const formData = new FormData()
        formData.append("mail", localStorage.getItem("mail"))
        formData.append("lastName", formValues.lastName)
        formData.append("firstName", formValues.firstName)
        formData.append("phoneNumber", formValues.phoneNumber)
        formData.append("password", formValues.password)
        formData.append("gender", formValues.gender)
        formData.append("car", formValues.car)

        if (formValues.notification){
            formData.append("notification", formValues.notification)
        }
        if (file){
            formData.append("file",file)
        } 
        console.log(formData);
        axios
        .post(url_api.url + "/save_profile.php", formData)    
            .then(function (response) {
                console.log("Response2 :" + response.data);
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });

        //on déconnecte l'utilisateur
        //window.location = '/logout'; marche pas
        
    }

    
    if(!auth){ //au cas où l'utilisateur ne soit pas co
        return (
        <main>
            {affichageBienvenue()}
        </main>
    );}else{ 
        return (
            <main>
                {affichageBienvenue()}
                {affichageProfil()}
                {modificationProfil()}
            </main>
        );
    }
}

export default Profil;