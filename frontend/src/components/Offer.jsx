import {useEffect, useState, useRef} from 'react';

function Offer(data) {
    if(data["inter"] && data["inter"].length > 0)
        return (
        <section key={data["idfOffre"]}>
            <h2>{data["villeDepart"] + " -> " + data["villeArrivee"]}</h2>
            <h3>{data["nom"] + " " + data["prenom"]}</h3>
            <p>{data["dateDepart"] + " " + data["heureDepart"]}</p>
            <h3>Arrêts intermédiaires :</h3>
            <ul>
                {data["inter"].map((city, index) => <ul key={index}>{city["ville"]}</ul>)}
            </ul>
            <h3>Précision :</h3>
            <p>{data["precisions"]}</p>
            <h3>Informations :</h3>
            <p>{data["infos"]}</p>
        </section>);
    else
        return (
            <section key={data["idfOffre"]}>
                <h2>{data["villeDepart"] + " -> " + data["villeArrivee"]}</h2>
                <h3>{data["nom"] + " " + data["prenom"]}</h3>
                <p>{data["dateDepart"] + " " + data["heureDepart"]}</p>
                <h3>Précision :</h3>
                <p>{data["precisions"]}</p>
                <h3>Informations :</h3>
                <p>{data["infos"]}</p>
            </section>);
};

export default Offer;