import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { url_api } from "../data/url_api";

function Login() {
    const initialValue = { mail: "", password: "" };
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        getUser();
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    const getUser = async () => {
        try {
            const reponse = await axios.get(url_api.url + "/login", {
                params: {
                    mail: formValues["mail"],
                    password: formValues["password"],
                },
            });

            if (reponse.data == null) {
                setError("Identifiant et/ou mot de passe incorrect.");
                setIsLoaded(false);
            } else {
                setIsLoaded(true);
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
            }
            console.log("Reponse : ");
            console.log(reponse.data);
        } catch (errors) {
            console.log(errors);
        }
    };

    if (isLoaded) {
        return <Navigate replace to="/" />;
    } else {
        return (
            <div>
                <div>
                    <h1>S'identifier : </h1>
                    <p>{error}</p>
                    <form onSubmit={handleSubmit}>
                        <div>Adresse mail :</div>
                        <input
                            type="text"
                            name="mail"
                            value={formValues.mail}
                            onChange={handleChange}
                        ></input>

                        <div>Mot de passe :</div>
                        <input
                            type="password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                        ></input>
                        <br />
                        <br />
                        <div>
                            <button type="submit">Se connecter</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
