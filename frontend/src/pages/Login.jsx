import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {url_api} from "../data/url_api";
import "../styles/Login.css";
import {useAuth} from "../components/AuthProvider";
import closeEye from "../assets/closeeye.svg";
import openEye from "../assets/openeye.svg";
import { Link } from "react-router-dom";
import {Navigate} from 'react-router-dom';
import { useCar } from "../components/CarProvider";

function Login() {
    const initialValue = { mail: "", password: "" };
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const { setAuth } = useAuth();
    const { setCar } = useCar();
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
            .get(url_api.url + "/login", {
                params: {
                    mail: formValues["mail"],
                    password: formValues["password"],
                },
            })
            .then(function (reponse) {
                if (reponse.data == null) {
                    setError("Identifiant et/ou mot de passe incorrect.");
                } else {
                    console.log(reponse.data);
                    localStorage.setItem("mail", reponse.data["email"]);
                    localStorage.setItem("nom", reponse.data["nom"]);
                    localStorage.setItem("prenom", reponse.data["prenom"]);
                    localStorage.setItem("genre", reponse.data["genre"]);
                    localStorage.setItem("numTel", reponse.data["numTel"]);
                    localStorage.setItem("estAdmin", reponse.data["estAdmin"]);
                    localStorage.setItem(
                        "aUneVoiture",
                        reponse.data["aUneVoiture"]
                    );
                    localStorage.setItem(
                        "notificationParMail",
                        reponse.data["notificationParMail"]
                    );
                    localStorage.setItem("photo", reponse.data["photo"]);
                    setAuth(true);
                    setCar(localStorage.getItem("aUneVoiture") === "1");
                    navigate("/");
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    return (
        <div className="form--connexion-box">
            <form onSubmit={handleSubmit}>
                <h1 className="bienvenue">Connection</h1>
                <input
                    className="input-connexion"
                    type="mail"
                    name="mail"
                    value={formValues.mail}
                    placeholder="Email"
                    onChange={handleChange}
                ></input>
                <br />
                <input
                    className="input-connexion"
                    type={passwordIsVisible ? 'text' : 'password'}
                    name="password"
                    value={formValues.password}
                    placeholder="Mot de passe"
                    onChange={handleChange}
                ></input>
                <span
                    className="button_show"
                    name="show"
                    onClick={() => setPasswordIsVisible((prevState) => !prevState)}>
                    <img 
                        src={passwordIsVisible ? closeEye : openEye}
                        alt={passwordIsVisible ? "Closed Eye" : "open Eye"}
                        width="32"
                    />
                </span>
                <p className="error">{error}</p>
                <br />
                    <button type="submit" className="button-connexion">
                        Se connecter
                    </button> 
                <br />
                    <Link to="../RecupCompte" className="under-button">Recupérer son compte</Link>
            </form>
        </div>
    );
}
/**Pretify button for recovery, check if email is in database before */
export default Login;
