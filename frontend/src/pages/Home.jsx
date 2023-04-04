import "../styles/Home.css";
import { useState } from "react";
import { url_api } from "../data/url_api";
import { useAuth } from "../components/AuthProvider";
import axios from "axios";
import Offer from "../components/Offer";
import { Link } from "react-router-dom";
import coins from "../assets/coins.svg";
import certificate from "../assets/certificate.svg";
import time from "../assets/time.svg";
import mens from "../assets/mens.svg";
import car from "../assets/car.svg";

function Home() {
    const { auth } = useAuth();
    const [offres, setOffres] = useState({ offres: [], statut: "" });

    async function getOffres() {
        await axios
            .get(url_api.url + "/offer", {
                params: {
                    email: localStorage.getItem("mail"),
                },
            })
            .then(function (reponse) {
                console.log(reponse);
                if (reponse.data == null) {
                    setOffres({ offres: [], statut: "ok" });
                } else {
                    setOffres({ offres: reponse.data, statut: "ok" });
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    if (!auth) {
        return (
            <main>
                <h1  className="slogan">Voyageons ensemble à moindre coût</h1>
                <div className="mainPicture">
                    <img
                        className="home_image"  
                        src={mens}
                        alt="mens"
                    />
                    <img
                        className="home_image"  
                        src={car}
                        alt="car"  
                    />
                </div>
                <div className="presentation_frame">
                    <div className="presentation_box">
                    <img
                        src={certificate}
                        alt="certificate"
                        width="52"
                    />
                    <h2>Sécurisé</h2>
                    <p>
                        Tous les membres de TravelTogether sont soumis à une notation des autres participants
                        d’un trajet commun. Vous pouvez à tout moment prendre connaissance de celles-ci afin
                        de vous assurez de voyager en bonne compagnie.
                    </p>
                    </div>
                    <div className="presentation_box">
                    <img 
                        src={time}
                        alt="time"
                        width="52"
                    />
                    <h2>Rapide</h2>
                    <p>
                        Vous n’avez pas le temps d’attendre,
                        c’est pourquoi nous avons mis un point d’honneur à simplifier tous les aspects 
                        de la mise en place d’un covoiturage : création de trajet efficiente,
                        réservation de place instantanée, possibilité
                        de retrouver tous vos trajets simplement.
                    </p>
                    </div>
                    <div className="presentation_box">
                    <img 
                        src={coins}
                        alt="coins"
                        width="52"
                    />
                    <h2>Economique</h2>
                    <p>
                        Afin de promouvoir le covoiturage, TravelTogether s’engage à le rendre accessible à tous.
                        C’est dans cette optique que nous vous laissons fixer le prix de vos trajets et que nous
                        ne prenons aucune marge sur ceux-ci.
                    </p>
                    </div>
                </div>
            </main>
        );
    } else if (offres.statut === "") {
        getOffres();
    } else if (offres.statut === "ok" && offres.offres.length === 0)
        return (
            <main>
                {auth ? (
                    <h1  className="slogan">Bienvenue {localStorage.getItem("nom")}{" "}
                        {localStorage.getItem("prenom")} !</h1>
                ) : (
                    <p> Bienvenue !</p>
                )}
                <article>
                    <p>Aucune offre disponible ! </p>
                </article>
            </main>
        );
    else
        return (
            <main>
                <p>
                    Bienvenue {localStorage.getItem("nom")}{" "}
                    {localStorage.getItem("prenom")} !
                </p>
                <article>
                    {offres.offres.map((offre, index) => (
                        <Link to={"../offre/" + offre["idfOffre"]} key={index}>
                            {Offer(offre)}
                        </Link>
                    ))}
                </article>
            </main>
        );
}

export default Home;
