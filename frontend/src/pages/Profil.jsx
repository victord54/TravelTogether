import "../styles/Profil.css";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { url_api } from "../data/url_api";
import axios from "axios";
import Offer from "../components/Offer";

function Profil() {
    const [offers, setOffers] = useState({ statut: "", offers: [] });

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
                                width="125px"
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
                        {offers.offers.length === 0 ? (
                            <Link to="../delete-account">
                                <button className="Button-profil">
                                    Supprimer mon compte
                                </button>
                            </Link>
                        ) : (
                            <p className="button-disabled">
                                Vous ne pouvez pas supprimer votre compte.
                            </p>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
        return contenu;
    }

    async function getOffres() {
        await axios
            .get(url_api.url + "/offer", {
                params: {
                    email: localStorage.getItem("mail"),
                    type: "historique",
                },
            })
            .then(function (reponse) {
                console.log(reponse.data);
                if (reponse.data == null) {
                    setOffers({ offers: [], statut: "ok" });
                } else {
                    setOffers({ offers: reponse.data, statut: "ok" });
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    var historique = <></>;

    if (offers.statut === "") {
        historique = (
            <div className="wrapper-historique">
                <p>Chargement de vos trajets</p>
            </div>
        );
        getOffres();
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
        historique = (
            <article className="wrapper-historique">
                {offers.offers.map((offre, index) => (
                    <div key={index}>{Offer(offre)}</div>
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
