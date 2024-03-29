import "../styles/Profil.css";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { url_api } from "../data/url_api";
import axios from "axios";
import Offer from "../components/Offer";

function AdminSeeOffers() {
    let { id } = useParams();
    const [offers, setOffers] = useState({ statut: "", offers: [] });
    const [index, setIndex] = useState(0);

    function getOffersIndex(event) {
        setIndex(event.target.value);
        setOffers({offers: [], statut: "changeIndex", size:offers.size, charged:offers.charged})
    }
    async function getOffres(indx) {
        await axios
            .get(url_api.url + "/offer", {
                params: {
                    email: id,
                    type: "admin historique",
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
                email: id,
                type: "adminNbOffer",
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
                    {id} n'a pas effectué de trajet.
                </p>
            </div>
        );
    } else if (offers.statut === "changeIndex") {
        var indexList = [];
        for(var i = 1; i <= Math.ceil(offers.size); i++) indexList.push(i);
        var indexBar = <nav className="index-bar">
            {indexList.map((val) => <button className="index-button" disabled={val==offers.charged+1} value={(val-1)*5} key={val} onClick={getOffersIndex}>{val}</button>)}
        </nav>;
        historique = (
            <article className="wrapper-historique">
                {indexBar}
                Chargement en cours...
            </article>
        );
        getOffres(index);
    } else {  //affichage des offres en général
    
        //pour chaque offre affichée dans le profil, on doit pouvoir l'annuler
        offers.offers = offers.offers.map(item => {
            return { ...item, isCancellable: true };
        });

        var indexList = [];
        for(var i = 1; i <= Math.ceil(offers.size); i++) indexList.push(i);
        var indexBar = <nav className="index-bar">
            {indexList.map((val) => <button className="index-button" disabled={val==offers.charged+1} value={(val-1)*5} key={val} onClick={getOffersIndex}>{val}</button>)}
        </nav>;
        historique = (
            <article className="wrapper-historique">
                {indexBar}
                {offers.offers.map((offre, index) => (
                    <Link to={"../offre/" + offre["idfOffre"]} key={index}>{Offer(offre, true)}</Link>
                ))}
            </article>
        );
        //explication du code précédent : pour chaque offre sur la page, on link l'offre vers une nouvelle page contenant l'offre seule
    }

    return (
        <main>
            <h1>Offres proposés par {id}</h1>
            {historique}
        </main>
    );
}

export default AdminSeeOffers;
