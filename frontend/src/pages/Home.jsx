import "../styles/Home.css";
import { useState } from "react";
import { url_api } from "../data/url_api";
import {useAuth} from "../components/AuthProvider";
import axios from "axios";
import Offer from "../components/Offer";
import { Link } from "react-router-dom";

function Home() {
    const { auth } = useAuth();
    const [ offres, setOffres ] = useState({offres : [], statut : ""});
    
    async function getOffres() {
        await axios
            .get(url_api.url + "/offer", {
                params: {
                    email : localStorage.getItem("mail")
                }
            })
            .then(function (reponse) {
                if (reponse.data == null || !isJson(reponse.data)) {
                    console.log("Bug");
                    setOffres({offres : [], statut : "ok" });
                } else {
                    console.log(reponse.data);
                    setOffres({offres : reponse.data, statut : "ok" });
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    if(!auth) {
        return <main>
            <p>Bienvenue !</p>
        </main>
    } else if(offres.statut === "") {
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
            <p>
                Bienvenue {localStorage.getItem("nom")}{" "}
                {localStorage.getItem("prenom")} !
            </p>
            <article>
                {offres.offres.map((offre, index) => <Link to={"../offre/" + offre["idfOffre"]} key={index}>{Offer(offre)}</Link>)}
            </article>
        </main>
    );

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}


export default Home;
