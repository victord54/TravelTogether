import "../styles/Profil.css";
import { useState } from "react";
import { renderMatches } from "react-router-dom";
import React from "react"

class Profil extends React.Component{

    state = {
        isUser : false,
        isSubmit : false
    };


    constructor() {
        super();
        if (localStorage.length > 0) { //on check si l'utilisatueur est connecté
            this.isUser = true;
        }
        //this.sendDataToServer = this.sendDataToServer.bind(this); //constructeur sinon ça râle
    }

    //Fonction qui retourne une des trucs si l'utilisateur est co ou non
    affichageBienvenue(){
        var message;
        if(this.isUser){
            message = <p> Modification du profil de {localStorage.getItem("nom")} {localStorage.getItem("prenom")} </p>;
        }
        else{
            message = <p> Il semblerait que vous ne soyez pas connecté. </p>;
        }
        return message;
    }

    //Fonction qui affiche les informations du profil
    affichageProfil(){
        var contenu =
            <React.Fragment> 
            <p className="fonctionnel"> <strong> Profil actuel: </strong></p>
            <ul> 
                <li> Nom : {localStorage.getItem("nom")}</li>
                <li> Prénom : {localStorage.getItem("prenom")}</li>
                <li> Genre :  {localStorage.getItem("genre")}</li>
                <li> Numéro de tel : {localStorage.getItem("numTel")}</li>
                <li> Possède une voiture : {localStorage.getItem("aUneVoiture") ? ("Oui") : ("Non")}</li>
                <li> Notifications par mail : {localStorage.getItem("notificationParMail") ? ("Oui") : ("Non")}</li>
            </ul>
            </React.Fragment>;
        return contenu;
    }

    //Fonction qui gère et affiche tout ce qui est relatif aux modifs; IMPLÉMENTER DES VÉRIFICATIONS
    modificationProfil(){ //éventuellement rajouter des onChange pour vérifier que l'utilisateur ne rentre pas nimp
        var contenu =
            <React.Fragment> 
            <form onSubmit={this.submitFormulaire}>
            <p> <strong> Modifications: </strong></p>
            <h3 className="pasFait"> La vérification des infos n'est pas encore implémentée!</h3>
            <ul> 
                <li> Nom :  <input
                                type="text" name="nom" className="fullTexte" placeholder={localStorage.getItem("nom")}
                            ></input> </li>
                <li> Prénom : <input
                                type="text" name="prenom" className="fullTexte" placeholder={localStorage.getItem("prenom")}
                            ></input></li>
                <li className="pasFait"> Genre :
                            <input
                                type="radio"
                                name="genre"
                                className="radio"
                                value="f"
                            ></input>
                            Femme
                            <input
                                type="radio"
                                name="genre"
                                className="radio"
                                value="h"
                            ></input>
                            Homme
                            <input
                                type="radio"
                                name="genre"
                                className="radio"
                                value="n"
                            ></input>
                            Neutre
                            </li>
                <li> Numéro de tel : <input
                                type="text" name="tel" className="fullTexte" placeholder={localStorage.getItem("numTel")}
                            ></input></li>
                <li className="àAmeliorer"> Possède une voiture : <input
                                type="checkbox" name="voiture" className="checkBox"
                            ></input></li>
                <li className="àAmeliorer"> Notifications par mail : <input
                                type="checkbox" name="notifMail" className="checkBox"
                            ></input></li>
            </ul>
            <button type="submit"> Valider changements </button>
            </form>
            </React.Fragment>;
        return contenu;
    }

    test(){
        console.log("zebi");
    }


    submitFormulaire() { //ici, problème au rafraichissement : pas de handle formulaire dans la console pour une raison bizarre
        //e.preventDefault(); //je sais pas à quoi ca sert mais c'est rès bien ici
        //en théorie, mettre ici une étape de vérification du formulaire avant d'envoyer les données
        console.log("Handle formulaire");
        //this.isSubmit = true;
        //test(); //problème avec le this ici => voir pq le bind constructeur ne fonctionne pas
    }

    render(){
        if(!this.isUser){ //au cas où l'utilisateur ne soit pas co
            return (
            <main>
                {this.affichageBienvenue()}
            </main>
        );}

        return (
            <main>
                {this.affichageBienvenue()}
                {this.affichageProfil()}
                {this.modificationProfil()}
            </main>
        );
    }
    
}

export default Profil;