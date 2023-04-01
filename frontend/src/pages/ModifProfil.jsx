import "../styles/Profil.css";
import React, { useState } from "react";
import axios from "axios";
import { url_api } from "../data/url_api";
import { Link, useNavigate } from "react-router-dom";
import { useCar } from "../components/CarProvider";

function ModifProfil() {
    const navigate = useNavigate();
    const { setCar } = useCar();

    const initialValue = {
        lastName: localStorage.getItem("nom"),
        firstName: localStorage.getItem("prenom"),
        password: "",
        passwordConfirmation: "",
        phoneNumber: localStorage.getItem("numTel"),
        gender: localStorage.getItem("genre"),
        car: localStorage.getItem("aUneVoiture"),
        mailUpdates: localStorage.getItem("notificationParMail"),
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [file, setFile] = useState();
    const [formErrors, setFormErrors] = useState({});

    function handleChange(event) {
        console.log("handleChange()");
        console.log(event.target.value);
        setInputValues({
            ...formValues,
            [event.target.name]: event.target.value,
        });
    }

    function handleFile(e) {
        console.log("handleFile()");
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    //Fonction qui gère et affiche tout ce qui est relatif aux modifs; IMPLÉMENTER DES VÉRIFICATIONS
    function modificationProfil() {
        //éventuellement rajouter des onChange pour vérifier que l'utilisateur ne rentre pas nimp
        return (
            <div>
                <div className="form_box">
                    <form onSubmit={submitFormulaire}>
                        <h1 className="modificationProfile_titre">Modifications</h1>
                        <div>Photo de profil :</div>
                        <input
                            type="file"
                            name="picture"
                            className="not-text-input"
                            accept="image/png, image/jpeg"
                            onChange={handleFile}
                        ></input>
                        <p></p>

                        <div>Nom :</div>
                        <input
                            type="text"
                            name="lastName"
                            className="fullTexte"
                            value={formValues.lastName}
                            onChange={handleChange}
                        ></input>
                        <p className="error-form">{formErrors.lastName}</p>{" "}
                            
                        <div>Prénom :</div>
                        <input
                            type="text"
                            name="firstName"
                            className="fullTexte"
                            value={formValues.firstName}
                            onChange={handleChange}
                        ></input>
                        <p className="error-form">{formErrors.firstName}</p>{" "}
                            
                        <div>Sélectionner votre genre : </div>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                className="not-text-input radiobutton"
                                value="f"
                                onChange={handleChange}
                                defaultChecked={initialValue.gender === "f"}
                            ></input>
                            Femme
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                className="not-text-input radiobutton"
                                value="h"
                                onChange={handleChange}
                                defaultChecked={initialValue.gender === "h"}
                            ></input>
                            Homme
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                className="not-text-input radiobutton"
                                value="n"
                                onChange={handleChange}
                                defaultChecked={initialValue.gender === "n"}
                            ></input>
                            Neutre
                         </label>
                         <p></p>
                                                   
                        <div>Numéro de téléphone : </div>
                        <input
                            type="text"
                            name="phoneNumber"
                            className="fullTexte"
                            value={formValues.phoneNumber}
                            onChange={handleChange}
                        ></input>
                        <p className="error-form">{formErrors.phoneNumber}</p>{" "}
                        
                        <div>En possession d'une voiture :</div>
                        <label>
                            <input
                                type="radio"
                                name="car"
                                className="not-text-input radiobutton"
                                value="1"
                                onChange={handleChange}
                                defaultChecked={initialValue.car === "1"}
                            ></input>
                            Oui
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="car"
                                className="not-text-input radiobutton"
                                value="0"
                                onChange={handleChange}
                                defaultChecked={initialValue.car === "0"}
                                ></input>
                                Non
                        </label>
                        <p></p>
                        <div>Notifications par mail :</div>
                        <label>
                                <input
                                    type="radio"
                                    name="mailUpdates"
                                    className="not-text-input radiobutton"
                                    value="1"
                                    onChange={handleChange}
                                    defaultChecked={initialValue.mailUpdates === "1"}
                                ></input>
                                Oui
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="mailUpdates"
                                className="not-text-input radiobutton"
                                value="0"
                                onChange={handleChange}
                                defaultChecked={initialValue.mailUpdates === "0"}
                            ></input>
                            Non
                        </label>
                        <p></p>

                        <div>Mot de passe :</div>
                        <input
                            type="password"
                            name="password"
                            className="fullTexte"
                            value={formValues.password}
                            onChange={handleChange}
                        ></input>{" "}
                        <p className="error-form">{formErrors.password}</p>{" "}
                        
                        <div>Confirmation Mot de Passe :</div>
                        <input
                            type="password"
                            name="passwordConfirmation"
                            className="fullTexte"
                            value={formValues.passwordConfirmation}
                            onChange={handleChange}
                        ></input>
                        <p className="error-form">{formErrors.passwordConfirmation}</p>
                        
                        <button type="submit" className="formulaire_submit">
                            Valider changements
                        </button>
                        <nav className="backButton">
                            <Link to="../profile">Annuler</Link>
                        </nav>
                    </form>
                </div>
            </div>
        );
    }

    //Appel de la validation formulaire
    function submitFormulaire(evenement) {
        evenement.preventDefault();
        const errors = validateForm(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            sendDataToServer();
        }
    }

    function validateForm(data) {
        console.log(data);
        const errors = {};

        //Vérification nom
        if (!data.firstName) {
            errors.firstName = "Le prénom est obligatoire.";
        } else {
            if (data.firstName.length < 2) {
                errors.firstName = "Le prénom doit faire minimum 2 caractères.";
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
                        " Le prénom doit commencer par une majuscule.";
                } else {
                    errors.firstName =
                        "Le prénom doit commencer par une majuscule.";
                }
            }
        }

        //Vérication prénom
        if (!data.lastName) {
            errors.lastName = "Le nom est obligatoire.";
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
                        " Le nom doit commencer par une majuscule.";
                } else {
                    errors.lastName =
                        "Le nom doit commencer par une majuscule.";
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

        const formData = new FormData();
        formData.append("mail", localStorage.getItem("mail"));
        formData.append("lastName", formValues.lastName);
        formData.append("firstName", formValues.firstName);
        formData.append("phoneNumber", formValues.phoneNumber);
        formData.append("password", formValues.password);
        formData.append("gender", formValues.gender);
        formData.append("car", formValues.car);
        formData.append("notification", formValues.mailUpdates);

        if (file) {
            formData.append("file", file);
        } else {
            formData.append("link_picture", localStorage.getItem("photo"));
        }
        //console.log(formData);

        axios
            .post(url_api.url + "/save_profile", formData)
            .then(function (response) {
                console.log("Response2 :" + response.data);
                console.log("Reload infos user");

                //on recharge le localStorage avec les nouvelles infos
                localStorage.setItem("nom", formValues.lastName);
                localStorage.setItem("prenom", formValues.firstName);
                localStorage.setItem("numTel", formValues.phoneNumber);
                localStorage.setItem("genre", formValues.gender);
                localStorage.setItem("aUneVoiture", formValues.car);
                localStorage.setItem(
                    "notificationParMail",
                    formValues.mailUpdates
                );

                if (file) {
                    //Le file avait changé
                    localStorage.setItem("photo", response.data);
                }

                setCar(localStorage.getItem("aUneVoiture") === "1");

                //Retour profil
                navigate("/profile");
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    return (
        <main>
            {modificationProfil()}
        </main>
    );
}

export default ModifProfil;
