import "../styles/Home.css";
import { useState } from "react";
import { url_api } from "../data/url_api";
import {useAuth} from "../components/AuthProvider";
import axios from "axios";

function Home() {
    const { auth } = useAuth();
    const [ offres, setOffres ] = useState({offres : [], statut : ""});
    
    async function getOffres() {
        await axios
            .get(url_api.url + "/offer")
            .then(function (reponse) {
                if (reponse.data == null) {
                    console.log("Bug");
                } else {
                    console.log(reponse.data);
                    setOffres({offres : reponse.data, statut : "ok" });
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    if(offres.statut === "") {
        getOffres();
    } else if(offres.statut === "ok" && offres.offres.length === 0)
        return(
            <main>
            {auth ? (
                <p>
                    Bienvenue {localStorage.getItem("nom")}{" "}
                    {localStorage.getItem("prenom")} !
                </p>
            ) : (
                <p> Bienvenue !</p>
            )}
            <article>
                <p>Aucune offre disponible</p>
            </article>
        </main>
        )
    else return (
        <main>
            {auth ? (
                <p>
                    Bienvenue {localStorage.getItem("nom")}{" "}
                    {localStorage.getItem("prenom")} !
                </p>
            ) : (
                <p> Bienvenue !</p>
            )}
            <article>
                {offres.offres.map((offre) => <section>
                    <h2>{offre["email"]}</h2>
                    <p>{offre["dateDepart"] + " " + offre["heureDepart"]}</p>
                    <h3>Précision :</h3>
                    <p>{offre["precisions"]}</p>
                    <h3>Informations :</h3>
                    <p>{offre["infos"]}</p>
                </section>)}
            </article>
        </main>
    );
}

export default Home;
