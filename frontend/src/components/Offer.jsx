import React, { useState } from "react";
import axios from "axios";
import { url_api } from "../data/url_api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SeeOffer.css";

function Offer(data, adminMode = false) {

    //const navigate = useNavigate();

    function cancelReply(){  //envoie au serv la demande d'annulation de participation à un trajet
        
        console.log("Envoi de l'annulation");
        const formData = new FormData();
        formData.append("mail", localStorage.getItem("mail"));
        formData.append("idfOffre", data["idfOffre"]);

        console.log("formdata: " + data["idfOffre"] + localStorage.getItem("mail"));

        axios
            .post(url_api.url + "/cancel_ride", formData)
            .then(function (response) {
                console.log("Response :" + response.data);
                //éventuellement mettre ici des trucs pour afficher une notif
                //navigate("/profile");
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }


    var info = <></>;
    var precision = <></>;
    var inter = <></>;
    var annulerParticipation = <></>;
    var date = new Date(data["dateDepart"]);
    var hour = new Date("July 1 2023 " + data["heureDepart"]);
    var annulable = (typeof data["isCancellable"] !== 'undefined'); //affichage du bouton d'annulation de la participation à cette offre

    const dateD = new Date(date);
    dateD.setHours(hour.getHours());
    dateD.setMinutes(hour.getMinutes());
    const dateAuj = new Date();

    if(annulable && data['email'] !== localStorage.getItem('mail')){ //l'offre est annulable, l'utilisateur qui l'annule est celui du localstorage
        annulerParticipation = (
            <button className="bouton-annuler" onClick={cancelReply}> Annuler participation </button>
        );
    }

    if (data["infos"].length > 1)
        info = (
            <main>
                <h3>Informations :</h3>
                <p>{data["infos"]}</p>
            </main>
        );
    if (data["precisions"].length > 1)
        precision = (
            <main>
                <h3>Précision :</h3>
                <p>{data["precisions"]}</p>
            </main>
        );

    if (data["inter"] && data["inter"].length > 0)
        inter = (
            <main>
                <h3>Arrêts intermédiaires :</h3>
                <ul className="citiesList">
                    {data["inter"].map((city, index) => (
                        <li key={index}>{city}</li>
                    ))}
                </ul>
            </main>
        );

    var nbPlaceDispo = data["nbPlaceDisponible"] - ( data["nbPlacesReserves"] ? data["nbPlacesReserves"] : 0);
    var placedispo = (
        <p>Nombre de places disponibles : {nbPlaceDispo}</p>
    );
    if (nbPlaceDispo === 1)
        placedispo = (
            <p>Nombre de place disponible : {nbPlaceDispo}</p>
        );
    if (nbPlaceDispo === 0)
        placedispo = <p>Aucune place disponible.</p>;


    function getEtoiles(note) {
        let res = "";
        let nbEtoiles = 0;
        while(note > 1) {
            note -= 1;
            nbEtoiles += 1;
            res += 	"\u2605";
        }
        if(note > 0.5) {
            note -= 1;
            nbEtoiles += 1;
            res += 	"\u2605";
        }
        while(nbEtoiles < 5) {
            res += "\u2606";
            nbEtoiles += 1;
        }
        console.log(res);
        return res;
    }

    return (
        <section key={data["idfOffre"]}>
            <h2>
                {data["villeDepart"]} &#8594; {data["villeArrivee"]}
            </h2>
            <h1>
                {data["prix"]} €
            </h1>
            <img
                alt="profil"
                src={data["photo"] + "?" + Math.random()}
                width="75px"
            />
            <h3>{data["nom"] + " " + data["prenom"]} {data["note"] !== null ? getEtoiles(data["note"]) : ""}</h3>
            <p>
                Le{" "}
                {date.getDate().toString().padStart(2, "0") +
                    "/" +
                    (date.getMonth() + 1).toString().padStart(2, "0") +
                    "/" +
                    date.getFullYear()}{" "}
                à{" "}
                {hour.getHours() +
                    "h" +
                    hour.getMinutes().toString().padStart(2, "0")}
            </p>
            {inter}
            {precision}
            {info}
            {dateD < dateAuj ? (
                <Link to={"/rating-user/" + data["idfOffre"]}>
                    <button className="bouton-annuler">Noter les participants</button>
                </Link>
            ) : (
                <>{placedispo}{annulerParticipation}{adminMode ? (<Link to={"/admin-delete-offer/"+data["idfOffre"]}><button className="bouton-annuler">Supprimer l'offre</button></Link>) : (<></>)}</>
            )}
        </section>
    );
}



export default Offer;

