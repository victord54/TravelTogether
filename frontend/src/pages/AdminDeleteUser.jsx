import {useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import {url_api} from "../data/url_api";

function AdminDeleteUser() {
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
        let formValue = new FormData();
        formValue.append("password", formValues.mdp);
        formValue.append("mailAdmin", localStorage.getItem("mail"));
        formValue.append("mail", id);
        await axios
            .post(url_api.url + "/delete_user", formValue)
            .then(function (response) {
                console.log(response.data);
                if (response.data === 1) {
                    setIsReplied(true);
                } else {
                    setFormErrors({mdp : "Mot de passe incorrect."});
                }
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
            sendDataToServer();
        }

        return errors;
    }
    if(isReplied) return <Navigate replace to="../admin-page" />;
    return (
        <div className="form-box">
            <h1 className="inscription-titre">Suppression de l'utilisateur {id}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="mdp"
                    placeholder="Saisir le mot de passe pour confirmer"
                    value={formValues.mdp}
                    onChange={handleChange}
                ></input>
                <p className="error-form">{formErrors.mdp}</p>

                <div className="button-forms-wrap">
                    <button type="submit" className="formulaire_submit">
                        Valider
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminDeleteUser;
