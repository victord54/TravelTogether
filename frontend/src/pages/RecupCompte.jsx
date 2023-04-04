import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {url_api} from "../data/url_api";
import "../styles/Login.css";
import {useAuth} from "../components/AuthProvider";
import closeEye from "../assets/closeeye.svg";
import openEye from "../assets/openeye.svg";
import { Link } from "react-router-dom";
import { useRef } from "react";

function RecupCompte() {
    const password = useRef(null);
    const password2= useRef(null);
    const initialValue = { mail: "", password: "", code: "", password2: ""};
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);
    const [isInputFocused, setInputFocused] = useState(false);
    const [hasSub, setHasSub] = useState(2);

    //source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt() {
        var min = Math.ceil(1000);
        var max = Math.floor(10000);
        var number =  Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        localStorage.setItem("code", number);
        return number;
    }
    

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

    function handleSubmit2(e) {
        e.preventDefault();
        //console.log(formValues.code);
        console.log(localStorage.getItem("code"));
        if(formValues.code == localStorage.getItem("code")){
            setHasSub(2);
            setError("");
        }else{
            setError("Code invalide");
        }
        
    }

    async function handleSubmit3(e) {
        e.preventDefault();
        var errors = await validateForm(formValues);
        console.log(Object.keys(errors).length);
        if (Object.keys(errors).length === 0) {
            resetPass();
        }else{
        //console.log("caught");
    }
    }

    async function validateForm(data) {
        const errors = {};
        if (!data.password) {
            errors.password = 1;
            setError("Le mot de passe est obligatoire.");
        } else {
            if(data.password != data.password2){
                setError("Les mots de passe doivent etre identiques.");
                errors.password2 = 1;
            }
            const regexPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!data.password.match(regexPassword)) {
                setError("Le mot de passe doit être composé d’au moins 8 caractères dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
                errors.passwordM = 1;
            }
        }
        return errors;
    }

    /**
     * Fonction qui permet de réagir quand on change la valeur d'un champs.
     *
     * @param {*} e Un évènement
     */
    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        if(!isInputFocused){
        password.current.focus();
    }else{
        password2.current.focus();
    }
    })

    function handleClick(){
        setInputFocused(true);
    }
    function handleClick2(){
        setInputFocused(false);
    }

    //utilisation de autofocus pour contourner la perte de focus liee a la facon dont j'ai implementee, le temps de pouvoir correctement tester la suite
    function Display(){
        if (hasSub == 0){
            return(
            <div className="form--connexion-box">
                        <form onSubmit={handleSubmit}>
                            <h1 className="bienvenue">Bienvenue ! </h1>
                            <p className="error">{error}</p>
                            <input
                                className="input-connexion"
                                type="mail"
                                autoFocus="autoFocus"
                                name="mail"
                                value={formValues.mail}
                                placeholder="Email"
                                onChange={handleChange}
                            ></input>
                            <br />
                        
                            <div className="button-wrap">
                                <button type="submit" className="button-connexion">
                                    Envoyer le mail
                                </button>
                            </div>
                        </form>
                    </div>
    
    );}else if(hasSub == 1){return(
        <div className="form--connexion-box">
        <form onSubmit={handleSubmit2}>
            <h1 className="bienvenue">Bienvenue ! </h1>
            <p className="error">{error}</p>
            <input
                className="input-connexion"
                type="text"
                name="code"
                value={formValues.code}
                onChange={handleChange}
                autoFocus="autoFocus"
            ></input>
            <br />
        
            <div className="button-wrap">
                <button type="submit" className="button-connexion">
                    Saisir le code.
                </button>
            </div>
        </form>
    </div>
        );}else if(hasSub == 2){return(
            
<div className="form--connexion-box">
                        <form onSubmit={handleSubmit3}>
                            <h1 className="bienvenue">Bienvenue ! </h1>
                            <p className="error">{error}</p>
                            <input
                                ref={password}
                                className="input-connexion"
                                type="password"
                                name="password"
                                id="password"
                                value={formValues.password}
                                onChange={handleChange}
                                onClick={handleClick2}
                            ></input>
                            <br />
                            <input
                                ref={password2}
                                className="input-connexion"
                                type="password"
                                name="password2"
                                value={formValues.password2}
                                onChange={handleChange}
                                onClick={handleClick}
                            ></input>
                            <br />
                        
                            <div className="button-wrap">
                                <button type="submit" className="button-connexion">
                                    Reinitialiser le mot de passe
                                </button>
                            </div>
                        </form>
                    </div>
        );}
    }


    /**
     * Fonction qui permet de récupérer les informations de l'utilisateur si celui-ci existe et que le mot de passe et le mail correspondent.
     * Si les informations sont récupérés, redirige l'utilisateur vers la page d'accueil. Sinon, affiche un message d'erreur.
     */
    async function getUser() {
        const errors = {}
        await axios
            .get(url_api.url + "/recup_compte", {
                params: {
                    mail: formValues["mail"],
                    pass: "0",
                    code: getRandomInt(),
                },
            })
            .then(function (reponse) {
                if (formValues.mail == " ") {
                    setError("Mail invalide");
                    //console.log("hi1");
                } 
                else if (reponse.data == "lied"){
                    //console.log("hi");
                    //console.log(formValues.mail);
                    setError("L'émail spécifié n'existe pas dans la base ou n'est pas un mail valide");
                }
                else {
                    //console.log("sent");
                    //console.log("Reponse : " + reponse.data);
                    setError("");
                    setHasSub(1);
                    //console.log(hasSub);
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    async function resetPass() {
        await axios
            .get(url_api.url + "/recup_compte", {
                params: {
                    mail: formValues["mail"],
                    pass: formValues["password"],
                    code: getRandomInt(),
                },
            })
            .then(function (reponse) {
                if (reponse.data == null) {
                    setError("Mail invalide");
                } else {
                    //console.log("sent");
                    //console.log(formValues["password"])
                    //console.log("Reponse : " + reponse.data);
                    setError("");
                    setHasSub(2);
                    //console.log(hasSub);
                    navigate("/login");
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }


    return (
        <Display/>
        
    );

}



export default RecupCompte;
