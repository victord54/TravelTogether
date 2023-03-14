import {useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import {url_api} from "../data/url_api";

function ModifGroup() {
    let { id } = useParams();
    const initialValue = {
        mdp: "",
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isReplied, setIsReplied] = useState(false);
    const [isLoaded, setLoaded] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
        setIsSubmit(true);
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    async function sendDataToServer() {
        const formData = new FormData();
        formData.append("idfGroupe", id);
        formData.append("password", formValues.mdp);
        formData.append("mail", localStorage.getItem("mail"));
        await axios
            .post(url_api.url + "/modif_group", formData)
            .then(function (response) {
                setIsReplied(true);
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    async function validateForm(data) {
        const errors = {};

        //Vérification si l'utilisateur a rentrer un mdp
        if (!data.mdp) {
            errors.mdp = "Aucun mot de passe saisie.";
        } else {
            await axios
                .get(url_api.url + "/modif_group", {
                    params: {
                        password: formValues.mdp,
                        mail: localStorage.getItem("mail"),
                    },
                })
                .then(function (response) {
                    if (response.data === "1") {
                        setLoaded(true);
                    } else {
                        errors.mdp =
                            "Le mots de passe saisie n'est pas correct.";
                    }
                })
                .catch(function (error) {
                    console.log("Error :" + error);
                });
        }

        return errors;
    }

    if (
        isLoaded &&
        isSubmit &&
        !isReplied &&
        Object.keys(formErrors).length === 0
    ) {
        sendDataToServer();
    }

    if (isReplied) return <Navigate replace to="../friends-group-list" />;
    else
        return (
            <div className="form-box">
                <h1 className="suppression-titre">Modification du group</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        name="nvxNom"
                        placeholder="Saisir le nouveau nom du group"
                        value={formValues.mdp}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.mdp}</p>

                    <div className="button-forms-wrap">
                        <button type="submit" className="formulaire-submit">
                            Valider
                        </button>
                    </div>
                </form>
            </div>
        );
}

export default ModifGroup;