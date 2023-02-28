import "../styles/Profil.css";
import { useState } from "react";
import { useAuth } from "../components/AuthProvider"
import React from "react"
import axios from "axios";
import { url_api } from "../data/url_api";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'


function ModifProfil() {
    const navigate = useNavigate()
    const { auth } = useAuth();
    const initialValue = {
        lastName: localStorage.getItem("prenom"),
        firstName: localStorage.getItem("nom"),
        password: "",
        passwordConfirmation: "",
        phoneNumber: localStorage.getItem("numTel"),
        gender: localStorage.getItem("genre"),
        car: localStorage.getItem("aUneVoiture"),
        mailUpdates: localStorage.getItem("notificationParMail")
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [isUser, setIsUser] = useState(false);
    const [file, setFile] = useState()
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    console.log(initialValue.mailUpdates)

    //Fonction qui retourne une des trucs si l'utilisateur est co ou non
    function affichageBienvenue() {
        var message;
        if (auth) {
            message =
                <nav>
                    <ul>
                        <Link to="../profile">Retour</Link>
                    </ul>
                </nav>
                ;
        }
        else {
            message = <h3 className="par-pitié-sois-centré"> Il semblerait que vous ne soyez pas connecté. </h3>;
        }
        return message;
    }

    function handleChange(event) {
        console.log("handleChange()");
        console.log(event.target.value)
        setInputValues({ ...formValues, [event.target.name]: event.target.value });
    }

    function handleFile(e) {
        console.log("handleFile()");
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    //Fonction qui gère et affiche tout ce qui est relatif aux modifs; IMPLÉMENTER DES VÉRIFICATIONS
    function modificationProfil() { //éventuellement rajouter des onChange pour vérifier que l'utilisateur ne rentre pas nimp
        return (
            <form onSubmit={submitFormulaire} className="form-box">
                <p> <strong> Modifications: </strong></p>
                <ul className="liste-sans-puces">
                    <li> Photo de profil : <input
                        type="file" name="picture" className="not-text-input" accept="image/png, image/jpeg" onChange={handleFile}
                    ></input></li>
                    <li> Nom :  <input
                        type="text" name="firstName" className="fullTexte" value={formValues.firstName} onChange={handleChange}
                    ></input> <p className="error-form">{formErrors.firstName}</p> </li>
                    <li> Prénom : <input
                        type="text" name="lastName" className="fullTexte" value={formValues.lastName} onChange={handleChange}
                    ></input> <p className="error-form">{formErrors.lastName}</p> </li>
                    <li className="radio"> Genre :
                        <input
                            type="radio"
                            name="gender"
                            className="not-text-input radiobutton"
                            value="f"
                            onChange={handleChange}
                            defaultChecked={initialValue.gender === "f"}
                        ></input>
                        Femme
                        <input
                            type="radio"
                            name="gender"
                            className="not-text-input radiobutton"
                            value="h"
                            onChange={handleChange}
                            defaultChecked={initialValue.gender === "h"}
                        ></input>
                        Homme
                        <input
                            type="radio"
                            name="gender"
                            className="not-text-input radiobutton"
                            value="n"
                            onChange={handleChange}
                            defaultChecked={initialValue.gender === "n"}
                        ></input>
                        Neutre
                    </li>
                    <li> Numéro de tel : <input
                        type="text" name="phoneNumber" className="fullTexte" value={formValues.phoneNumber} onChange={handleChange}
                    ></input> <p className="error-form">{formErrors.phoneNumber}</p> </li>
                    <li className="radio"> En possession d'une voiture :
                        <input
                            type="radio"
                            name="car"
                            className="not-text-input radiobutton"
                            value="1"
                            onChange={handleChange}
                            defaultChecked={initialValue.car === "1"}
                        ></input>
                        Oui
                        <input
                            type="radio"
                            name="car"
                            className="not-text-input radiobutton"
                            value="0"
                            onChange={handleChange}
                            defaultChecked={initialValue.car === "0"}
                        ></input>
                        Non
                    </li>
                    <li className="radio"> Notifications par mail :
                        <input
                            type="radio"
                            name="mailUpdates"
                            className="not-text-input radiobutton"
                            value="1"
                            onChange={handleChange}
                            defaultChecked={initialValue.mailUpdates === "1"}
                        ></input>
                        Oui
                        <input
                            type="radio"
                            name="mailUpdates"
                            className="not-text-input radiobutton"
                            value="0"
                            onChange={handleChange}
                            defaultChecked={initialValue.mailUpdates === "0"}
                        ></input>
                        Non
                    </li>
                    <li> Mot de passe : <input
                        type="password" name="password" className="fullTexte" value={formValues.password} onChange={handleChange}
                    ></input> <p className="error-form">{formErrors.password}</p> </li>
                    <li> Confirmation Mot de Passe : <input
                        type="password" name="passwordConfirmation" className="fullTexte" value={formValues.passwordConfirmation} onChange={handleChange}
                    ></input> <p className="error-form">{formErrors.passwordConfirmation}</p> </li>
                </ul>
                <button type="submit" className="formulaire-submit"> Valider changements </button>
            </form>
        );
    }

    //Appel de la validation formulaire
    function submitFormulaire(evenement) {
        evenement.preventDefault();
        const errors = (validateForm(formValues))
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            sendDataToServer();
        }
    }

    function validateForm(data) {
        console.log(data);
        const errors = {};

        //Vérification nom
        if (!data.firstName) {
            errors.firstName = "Le nom est obligatoire.";
        } else {
            if (data.firstName.length < 2) {
                errors.firstName = "Le nom doit faire minimum 2 caractères.";
            }
            if (
                !(
                    data.firstName.charAt(0) ===
                    data.firstName.charAt(0).toUpperCase()
                )
            ) {
                if (errors.firstName) {
                    errors.firstName =
                        errors.firstName +
                        " Le nom doit commencer par une majuscule.";
                } else {
                    errors.firstName =
                        "Le nom doit commencer par une majuscule.";
                }
            }
        }

        //Vérication prénom
        if (!data.lastName) {
            errors.lastName = "Le prénom est obligatoire.";
        } else {
            if (data.lastName.length < 2) {
                errors.lastName = "Le nom doit faire minimum 2 caractères.";
            }
            if (
                !(
                    data.lastName.charAt(0) ===
                    data.lastName.charAt(0).toUpperCase()
                )
            ) {
                if (errors.lastName) {
                    errors.lastName =
                        errors.lastName +
                        " Le prénom doit commencer par une majuscule.";
                } else {
                    errors.lastName =
                        "Le prénom doit commencer par une majuscule.";
                }
            }
        }

        //Vérification numéro de téléphone
        if (!data.phoneNumber) {
            errors.phoneNumber = "Le numéro de téléphone est obligatoire.";
        } else {
            const regex = /^(0|\\+33)[1-9][0-9]{8}$/;
            if (!data.phoneNumber.match(regex)) {
                errors.phoneNumber =
                    "Le numéro de téléphone doit être un numéro français commençant par 0 ou +33.";
            }
        }

        //Vérification du mot de passe
        if (data.password) {
            const regexPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!data.password.match(regexPassword)) {
                errors.password =
                    "Le mot de passe doit être composé d’au moins 8 caractères dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial.";
            }
        }

        //Vérification de la confirmation du mot de passe
        //on check même s'il n'y a pas de mdp (mdp vide et confirmation remplie)
        if (data.password !== data.passwordConfirmation) {
            errors.passwordConfirmation =
                "Les mots de passes ne sont pas identiques.";
        }

        return errors;
    }


    function sendDataToServer() {
        console.log("Envoi des changements.");

        const formData = new FormData()
        formData.append("mail", localStorage.getItem("mail"))
        formData.append("lastName", formValues.lastName)
        formData.append("firstName", formValues.firstName)
        formData.append("phoneNumber", formValues.phoneNumber)
        formData.append("password", formValues.password)
        formData.append("gender", formValues.gender)
        formData.append("car", formValues.car)
        formData.append("notification", formValues.mailUpdates)

        if (file) {
            formData.append("file", file)
        } else {
            formData.append("link_picture", localStorage.getItem("picture"))
        }
        //console.log(formData);

        axios
            .post(url_api.url + "/save_profile.php", formData)
            .then(function (response) {
                console.log("Response2 :" + response.data);
                console.log("Reload infos user");

                //on recharge le localStorage avec les nouvelles infos
                localStorage.setItem("nom", formValues.firstName);
                localStorage.setItem("prenom", formValues.lastName);
                localStorage.setItem("numTel", formValues.phoneNumber);
                localStorage.setItem("genre", formValues.gender);
                localStorage.setItem("aUneVoiture", formValues.car);
                localStorage.setItem("notificationParMail", formValues.mailUpdates);
                
                if (file){ //Le file avait changé
                    localStorage.setItem("photo",response.data)
                }
            
                //Retour profil
                navigate('/profile')
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }


    return (
        <main>
            {affichageBienvenue()}
            {modificationProfil()}
        </main>
    );

}

export default ModifProfil;