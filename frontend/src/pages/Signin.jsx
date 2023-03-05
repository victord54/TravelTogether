import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import { url_api } from "../data/url_api";

function Signin() {
    const initialValue = {
        lastName: "",
        firstName: "",
        mail: "",
        password: "",
        passwordConfirmation: "",
        phoneNumber: "",
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    /**
     * Fonction appelé lors de la tentative d'envoie du questionnaire au serveur.
     * Vérifie les erreurs et s'il n'y en a pas : Envoie les informations au serveur.
     *
     * @param {*} e Un évènement
     */
    async function handleSubmit(e) {
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            sendDataToServer();
        }
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
     * Fonction qui permet de réagir lors de l'ajout d'une image.
     *
     * @param {*} e Un évènement.
     */
    function handleFile(e) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    /**
     * Fonction qui permet d'envoyer les informations au serveur. Si tout s'est bien passé, envoie l'utilisateur à la page de Login.
     */
    async function sendDataToServer() {
        console.log("on envoie");

        const formData = new FormData();
        formData.append("mail", formValues.mail);
        formData.append("lastName", formValues.lastName);
        formData.append("firstName", formValues.firstName);
        formData.append("phoneNumber", formValues.phoneNumber);
        formData.append("password", formValues.password);
        formData.append("gender", formValues.gender);
        formData.append("car", formValues.car);

        if (formValues.notification) {
            formData.append("notification", formValues.notification);
        }
        if (file) {
            formData.append("file", file);
        }
        console.log(formData);
        await axios
            .post(url_api.url + "/signin", formData)
            .then(function (response) {
                console.log("Response1 :" + response.data);
                if (response.data !== "ok") {
                    alert("Une erreur s'est produite.");
                } else {
                    navigate("/login");
                }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    /**
     * Fonction qui permet de vérifier les éléments du formulaire.
     *
     * @param {*} data Les données du formulaire.
     * @returns Les erreurs éventuelles.
     */
    async function validateForm(data) {
        console.log(data);
        const errors = {};

        //Vérification nom
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

        //Vérication prénom
        if (!data.firstName) {
            errors.firstName = "Le prénom est obligatoire.";
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
                        " Le prénom doit commencer par une majuscule.";
                } else {
                    errors.firstName =
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

        //Vérification du genre
        if (!data.gender) {
            errors.gender = "Le genre est obligatoire.";
        }

        //Vérication du mail
        if (!data.mail) {
            errors.mail = "L'adresse email est obligatoire.";
        } else {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!data.mail.match(regex)){
                errors.mail = "Cette adresse mail n'est pas bonne."
            } else {
                //On check si le mail est déjà utilisé
                await axios
                .get(url_api.url + "/signin", {
                    params: {
                        mail: data.mail,
                    },
                })
                .then((response) => {
                    console.log("Rep mail " + response.data);
                    if (!(response.data == null)) {
                        errors.mail = "L'adresse mail est déjà utilisée.";
                    }
                });
            }
            
        }

        //Vérification du mot de passe
        if (!data.password) {
            errors.password = "Le mot de passe est obligatoire.";
        } else {
            const regexPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!data.password.match(regexPassword)) {
                errors.password =
                    "Le mot de passe doit être composé d’au moins 8 caractères dont au moins une majuscule, une minuscule, un chiffre et un caractère spécial.";
            }
        }

        //Vérification de la confirmation du mot de passe
        if (data.password !== data.passwordConfirmation) {
            errors.passwordConfirmation =
                "Les mots de passes ne sont pas identiques.";
        }

        //Vérification possession d'une voiture
        if (!data.car) {
            errors.car = "La réponse est obligatoire.";
        }

        return errors;
    }

    return (
        <div>
            <div className="form-box">
                <h1 className="inscription-titre">Inscription</h1>
                <form onSubmit={handleSubmit}>
                    <div>Nom* :</div>
                    <input
                        type="text"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.lastName}</p>

                    <div>Prénom* :</div>
                    <input
                        type="text"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.firstName}</p>

                    <div>Sélectionner votre genre* : </div>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            className="not-text-input radiobutton"
                            value="f"
                            onChange={handleChange}
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
                        ></input>
                        Neutre
                    </label>
                    <p className="error-form">{formErrors.gender}</p>

                    <div>Numéro de téléphone* : </div>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formValues.phoneNumber}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.phoneNumber}</p>

                    <div>Adresse e-mail* : </div>
                    <input
                        type="mail"
                        name="mail"
                        value={formValues.mail}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.mail}</p>

                    <div>Mot de passe* : </div>
                    <input
                        type="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.password}</p>

                    <div>Veuillez confirmer votre mot de passe* : </div>
                    <input
                        type="password"
                        name="passwordConfirmation"
                        value={formValues.passwordConfirmation}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">
                        {formErrors.passwordConfirmation}
                    </p>

                    <div>Possédez-vous une voiture ?* </div>
                    <label>
                        <input
                            type="radio"
                            name="car"
                            className="not-text-input radiobutton"
                            value="yes"
                            onChange={handleChange}
                        ></input>
                        Oui
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="car"
                            className="not-text-input radiobutton"
                            value="no"
                            onChange={handleChange}
                        ></input>
                        Non
                    </label>
                    <p className="error-form">{formErrors.car}</p>

                    <label>
                        <input
                            type="checkbox"
                            name="notification"
                            className="not-text-input"
                            onChange={handleChange}
                        ></input>
                        Recevoir les notifications par e-mail.
                    </label>
                    <br />
                    <br />
                    <div>Choisissez une photo de profil :</div>
                    <input
                        type="file"
                        name="picture"
                        className="not-text-input"
                        accept="image/png, image/jpeg"
                        onChange={handleFile}
                    ></input>
                    <p className="error-form">{formErrors.picture}</p>

                    <br />
                    <br />
                    <div className="button-forms-wrap">
                        <button type="submit" className="formulaire-submit">
                            Valider
                        </button>
                    </div>
                    <p className="info-obligatoire">
                        * : Information obligatoire.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signin;
