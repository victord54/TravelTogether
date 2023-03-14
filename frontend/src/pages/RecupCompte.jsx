import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {url_api} from "../data/url_api";
import "../styles/Login.css";
import {useAuth} from "../components/AuthProvider";
import closeEye from "../assets/closeeye.svg";
import openEye from "../assets/openeye.svg";
import { Link } from "react-router-dom";

function RecupCompte() {
    const initialValue = { mail: "", password: "" };
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);
    

    /**
     * Fonction appelé lors de la tentative d'envoie du questionnaire au serveur.
     * Vérifie les erreurs et s'il n'y en a pas : Envoie les informations au serveur.
     *
     * @param {*} e Un évènement
     */
    function handleSubmit(e) {
        e.preventDefault();
        getUser();
    }

    /**
     * Fonction qui permet de réagir quand on change la valeur d'un champs.
     *
     * @param {*} e Un évènement
     */
    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    /**
     * Fonction qui permet de récupérer les informations de l'utilisateur si celui-ci existe et que le mot de passe et le mail correspondent.
     * Si les informations sont récupérés, redirige l'utilisateur vers la page d'accueil. Sinon, affiche un message d'erreur.
     */
    async function getUser() {
        await axios
            .get(url_api.url + "/recup_compte", {
                params: {
                    mail: formValues["mail"],
                    code: "1234",
                },
            })
            .then(function (reponse) {
                if (reponse.data == null) {
                    setError("Mail invalide");
                } else {
                    console.log("sent");
                    console.log("Reponse : " + reponse.data);
                    
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    return (
        <div className="form--connexion-box">
            <form onSubmit={handleSubmit}>
                <h1 className="bienvenue">Bienvenue ! </h1>
                <p className="error">{error}</p>
                <input
                    className="input-connexion"
                    type="mail"
                    name="mail"
                    value={formValues.mail}
                    placeholder="Email"
                    onChange={handleChange}
                ></input>
                <br />
            
                <div className="button-wrap">
                    <button type="submit" className="button-connexion">
                        Se connecter
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RecupCompte;
