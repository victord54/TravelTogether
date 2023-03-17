import {useState} from 'react';
import axios from 'axios';
import {url_api} from "../data/url_api";
import Offer from "../components/Offer";
import {useParams, Link} from "react-router-dom";
import "../styles/SeeOffer.css";
import "../styles/NavButton.css";

function SeeOffer() {
    const initialValue = {
        nbPlaces: 1,
        messageFalcutatif: ""
    };

    let { id } = useParams();
    const [offers, setOffers] = useState({statut : "", offer : null});
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const [viensDeRepondre, setReponse] = useState(false);
    var buttons = <nav className='navButton'></nav>;

    function load_data() { 
        axios.get(url_api.url + "/offer", {
            params: {
                idfOffre : id
            }
        })
            .then(function (response) {
                console.log(response.data);
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

        const formData = new FormData();
        formData.append("nbPlaces", formValues.nbPlaces);
        formData.append("interesse", localStorage.getItem("mail"));
        formData.append("idfOffre", id);
        formData.append("message", formValues.messageFalcutatif);

        await axios
            .post(url_api.url + "/reply", formData)
            .then(function (response) {
                if(response.data !== "ok"){
                    
                    if(response.data === "user already replied"){
                        setError("Vous avez déjà répondu à cette offre.")
                    }else if(response.data === "not enough places available"){
                        setError("Il n'y pas assez de places disponibles pour cette offre.")
                    } else {
                        setReponse(true);
                    }
                }else{
                    setError(null);
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }
    let form = <form></form>;
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
    else {
        let ajd = new Date();
        let date = new Date(offers.offer["dateDepart"]);
        if (offers.offer["email"] !== localStorage.getItem("mail") && 
            date > ajd && !(date.getDate() === ajd.getDate() &&  
            date.getMonth() === ajd.getMonth() && 
            date.getFullYear() === ajd.getFullYear())
            && offers.offer["nbPlaceDisponible"] > 0) {


                function email_equals(obj1, email) {
                    return obj1["email"] = email;
                }
                function search_reponses(array, email) {
                    for(var i = 0; i < array.length; i++) {
                        if (email_equals(array[i], email)) return i;
                    }
                    return -1;
                }
                let index = search_reponses(offers.offer["reponses"], localStorage.getItem("mail"));

                if(index == -1 && !viensDeRepondre && offers.offer["nbPlaceDisponible"] > 0) {
                    console.log(offers.offer["reponses"]);
                    for(let i = 1; i<=offers.offer["nbPlaceDisponible"]; i++) places.push(<option key={i} value={i}>{i}</option>);
                    
                    form = <form onSubmit={handleSubmit}>
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
                    </form>;
                } else if(index != -1) {
                    let statut = offers.offer["reponses"][index]["statutReponse"];
                    if(statut != 'refuser') {
                        // Code de Dan
                    }
                }
        }
    }
    let ajd = new Date();
    let date = new Date(offers.offer["dateDepart"]);
    if(localStorage.getItem("mail") === offers.offer["email"] && date > ajd) {
        buttons = <ul className='navButton'><li className='buttonsNav'><Link to={"../modify-offer/" + offers.offer["idfOffre"]}>Modifier l'offre</Link></li></ul>;
    }
    return (
        <main>
            <nav>
                {buttons}
            </nav>
            <br/>
            <article>
                {Offer(offers.offer)}
                <div key="form">
                    {form}
                </div>
            </article>
        </main>
    );
}

export default SeeOffer;