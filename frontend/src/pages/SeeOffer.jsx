import {useState} from 'react';
import axios from 'axios';
import {url_api} from "../data/url_api";
import Offer from "../components/Offer";
import {Link, useParams} from "react-router-dom";
import "../styles/SeeOffer.css";

import Button from "@mui/material/Button";

function Search_offer() {
    const initialValue = {
        nbPlaces: 1,
        messageFalcutatif: ""
    };

    let { id } = useParams();
    const [offers, setOffers] = useState({statut : "", offer : null});
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);

    function load_data() { 
        axios.get(url_api.url + "/offer", {
            params: {
                idfOffre : id
            }
        })
            .then(function (response) {
                setOffers({statut : "ok", offer : response.data});
            })
            .catch(function (err) {
                console.log('Error : ' + err);
                setOffers({statut : "ok", offer : null});
            });
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e){
        e.preventDefault();
        sendDataToServer();
        setInputValues({nbPlaces: 1, messageFalcutatif: ""});
    }

    async function sendDataToServer() {
        console.log("on envoie");

        const formData = new FormData();
        formData.append("nbPlaces", formValues.nbPlaces);
        formData.append("interesse", localStorage.getItem("mail"));
        formData.append("idfOffre", id);

        console.log(formData);
        await axios
            .post(url_api.url + "/reply", formData)
            .then(function (response) {
                console.log("response :" + response.data);
                if(response.data !== "ok"){
                    
                    if(response.data == "user already replied"){
                        setError("Vous avez déjà répondu à cette offre.")
                    }else if(response.data == "not enough places available"){
                        setError("Il n'y pas assez de places disponibles pour cette offre.")
                    }
                }else{
                    setError(null);
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    let nav = <nav></nav>;
    let places = [];

    if(offers.statut === "") {
        load_data();
        return (
            <main>
                <p>Chargement des informations...</p>
            </main>
        );
    } else if (offers.statut === "ok" && offers.offer === null)
        return (
            <main>
                <article>
                    <p>L'offre n'est pas trouvée !</p>
                </article>
            </main>
        );
    else if (offers.offer["email"] !== localStorage.getItem("mail")) {
        for(let i = 1; i<=offers.offer["nbPlaceDisponible"]; i++) places.push(<option value={i}>{i}</option>);
        nav = <nav>
            <ul>
                <Link to={"../reply/" + id}>reponse</Link>
            </ul>
        </nav>;
    }
    return (
        <main>
            {nav}    
            <article>
                {Offer(offers.offer)}
                <div>
                    <form onSubmit={handleSubmit}>
                        <div>Nombre de places souhaitées :</div>
                        <label>
                            <select name="nbPlaces" id="nbPlaces" value={formValues.nbPlacesSouhaitees} onChange={handleChange}>
                                {places}
                            </select>
                        </label>
                        <div>Message (facultatif) :</div>
                        <label>
                        <textarea name="messageFalcutatif" id="messageFalcutatif" value={formValues.messageFalcutatif} onChange={handleChange}></textarea>
                        </label>
                        <div className='button-forms-wrap'>
                            <button type="submit" className="formulaire-submit">Répondre à l'offre</button>
                        </div>
                        <p className="error">{error}</p>
                    </form>
                </div>
            </article>
        </main>
    );
}

export default Search_offer;