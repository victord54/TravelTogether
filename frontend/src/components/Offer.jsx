import { url_api } from "../data/url_api";
import axios from "axios";
import { useEffect, useState } from "react";

function Offer(data) {
    var info = <></>;
    var precision = <></>;
    var inter = <></>;
    var date = new Date(data["dateDepart"]);
    var hour = new Date("July 1 2023 " + data["heureDepart"]);
    
    const dateD = new Date(date)
    dateD.setHours(hour.getHours())
    dateD.setMinutes(hour.getMinutes())
    const dateAuj = new Date()

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

    var placedispo = <p>Nombre de places disponibles : {data["nbPlaceDisponible"]}</p>;
    if(data["nbPlaceDisponible"] === 1) placedispo = <p>Nombre de place disponible : {data["nbPlaceDisponible"]}</p>;
    if(data["nbPlaceDisponible"] === 0) placedispo = <p>Aucune place disponible.</p>;

    async function handleNoterParticipants(){
        axios.get(url_api.url + "/grade_participants", {
            params: {
                id: data["idfOffre"]
            },
        })
        .then(function (reponse) {
            console.log(reponse);
        })
    }

    return (
        
        <section key={data["idfOffre"]}>
            <h2>
                {data["villeDepart"]} &#8594; {data["villeArrivee"]}
            </h2>
            <img
                alt="profil"
                src={data["photo"] + "?" + Math.random()}
                width="75px"
            />
            <h3>{data["nom"] + " " + data["prenom"]}</h3>
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
            {dateD < dateAuj ? <button onClick={() => handleNoterParticipants}>Noter les participants</button> : <>{placedispo}</>}
            
        </section>
    );
}

export default Offer;
