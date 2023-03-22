import "../styles/Profil.css";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { url_api } from "../data/url_api";
import axios from "axios";
import Offer from "../components/Offer";

function Profil() {
    const [offers, setOffers] = useState({ statut: "", offers: [] });
    const [index, setIndex] = useState(0);

    //Fonction qui affiche les informations du profil
    function affichageProfil() {
        var contenu = (
            <React.Fragment>
                <div className="wrapper-profil">
                    <div className="affichageActuel">
                        <p className="fonctionnel">
                            {" "}
                            <strong> Profil actuel: </strong>
                        </p>
                        <div className="picture">
                            <img
                                alt="profil"
                                src={
                                    localStorage.getItem("photo") +
                                    "?" +
                                    Math.random()
                                }
                                height="175px"
                                width="175px"
                            />
                        </div>
                        <div className="profil-infos">
                            <ul>
                                <li> Nom : {localStorage.getItem("nom")}</li>
                                <li>
                                    {" "}
                                    Prénom : {localStorage.getItem("prenom")}
                                </li>
                                <li>
                                    {" "}
                                    Genre : {localStorage.getItem("genre")}
                                </li>
                                <li>
                                    {" "}
                                    Numéro de tel :{" "}
                                    {localStorage.getItem("numTel")}
                                </li>
                                <li>
                                    {" "}
                                    Possède une voiture :{" "}
                                    {localStorage.getItem("aUneVoiture") === "1"
                                        ? "Oui"
                                        : "Non"}
                                </li>
                                <li>
                                    {" "}
                                    Notifications par mail :{" "}
                                    {localStorage.getItem(
                                        "notificationParMail"
                                    ) === "1"
                                        ? "Oui"
                                        : "Non"}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="wrapper-nav">
                        <Link to="../Friends-group-list">
                            <button className="Button-profil">
                                Mes Groupes
                            </button>
                        </Link>
                        <br />
                        <Link to="../modif-profile">
                            <button className="Button-profil">
                                Modifier mon profil
                            </button>
                        </Link>
                        <br />
                        <button className="Button-profil">
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
        return contenu;
    }

    function getOffersIndex(event) {
        getOffres(event.target.value);
    }
    async function getOffres(indx) {
        await axios
            .get(url_api.url + "/offer", {
                params: {
                    email: localStorage.getItem("mail"),
                    type: "historique",
                    offset: indx
                },
            })
            .then(function (reponse) {
                console.log(reponse.data);
                if (reponse.data == null) {
                    setOffers({ offers: [], statut: "ok", size:offers.size, charged:indx/5 });
                } else {
                    setOffers({ offers: reponse.data, statut: "ok", size:offers.size, charged:indx/5 });
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }
    
    async function getNbOffres() {
        await axios
        .get(url_api.url + "/offer", {
            params: {
                email: localStorage.getItem("mail"),
                type: "nbOffer",
            },
        })
        .then(function (reponse) {
            if (reponse.data == null) {
                setOffers({ offers: [], statut: "sizeOnly", size:0, charged:0 });
            } else {
                setOffers({ offers: [], statut: "sizeOnly", size:reponse.data["nbOffre"]/5, charged:0 });
            }
        })
        .catch(function (error) {
            console.log("Error :" + error);
        });
    }

    var historique = <></>;

    if (offers.statut === "") {
        getNbOffres();
        historique = (
            <div className="wrapper-historique">
                <p>Chargement de vos trajets</p>
            </div>
        );
    } else if (offers.statut === "sizeOnly") {
        historique = (
            <div className="wrapper-historique">
                <p>Chargement de vos trajets</p>
            </div>
        );
        getOffres(index);
    } else if (offers.statut === "ok" && offers.offers.length === 0) {
        historique = (
            <div className="wrapper-historique">
                <p>
                    Vous n'avez pas effectué de trajet ou n'avez aucune demande
                    de trajet en attente.
                </p>
            </div>
        );
    } else {
        var indexList = [];
        for(var i = 1; i <= Math.ceil(offers.size); i++) indexList.push(i);
        var indexBar = <nav className="index-bar">
            {indexList.map((val) => <button className="index-button" disabled={val==offers.charged+1} value={(val-1)*5} key={val} onClick={getOffersIndex}>{val}</button>)}
        </nav>;
        historique = (
            <article className="wrapper-historique">
                {indexBar}
                {offers.offers.map((offre, index) => (
                    <Link to={"../offre/" + offre["idfOffre"]} key={index}>{Offer(offre)}</Link>
                ))}
            </article>
        );
    }

    return (
        <main>
            {affichageProfil()}
            {historique}
        </main>
    );
}

export default Profil;
