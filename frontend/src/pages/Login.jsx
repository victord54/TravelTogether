import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url_api } from "../data/url_api";
import "../styles/Login.css";
import {useAuth} from "../components/AuthProvider"


function Login() {
    const initialValue = { mail: "", password: "" };
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { setAuth } = useAuth();
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        getUser();
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    async function getUser() {
        await axios.get(url_api.url + "/login.php", {
            params: {
                mail: formValues["mail"],
                password: formValues["password"],
            },
        }).then(function (reponse) {
            console.log("Reponse : " + reponse.data);

            if (reponse.data == null) {
                setError("Identifiant et/ou mot de passe incorrect.");
            } else {
                localStorage.setItem("mail", reponse.data["email"]);
                localStorage.setItem("nom", reponse.data["nom"]);
                localStorage.setItem("prenom", reponse.data["prenom"]);
                localStorage.setItem("genre", reponse.data["genre"]);
                localStorage.setItem("numTel", reponse.data["numTel"]);
                localStorage.setItem(
                    "aUneVoiture",
                    reponse.data["aUneVoiture"]
                );
                localStorage.setItem(
                    "notificationParMail",
                    reponse.data["notificationParMail"]
                );
                setAuth(true)
                navigate('/')
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
                            type="text"
                            name="mail"
                            value={formValues.mail}
                            placeholder="Email"
                            onChange={handleChange}
                        ></input>
                        <br/>
                        <input
                            className="input-connexion"
                            type="password"
                            name="password"
                            value={formValues.password}
                            placeholder = "Mot de passe"
                            onChange={handleChange}
                        ></input>
                        <br />
                        <br />
                        <div className="button-wrap">
                            <button type="submit" className="button-connexion">Se connecter</button>
                        </div>
                    </form>
                </div>
        );
    }


export default Login;
