import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import { url_api } from "../data/url_api";

function Delete_group() {
    let { id } = useParams();
    const initialValue = {
        mdp: ""
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
            .post(url_api.url + "/delete_group.php", formData)
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
       if (!data.mdp){
            errors.mdp = "Aucun mot de passe saisie.";
        } else {
            await axios
                .get(url_api.url + "/delete_group.php", {
                    params: {
                        password: formValues.mdp,
                        mail: localStorage.getItem("mail"),
                    }
                })
                .then(function (response) {
                    if(response.data === "1") {
                        setLoaded(true);
                    } else {
                        errors.mdp = "Le mots de passe saisie n'est pas correct.";
                    }
                })
                .catch(function (error) {
                    console.log("Error :" + error);
                });
        }
        
        return errors;
    }

    if (isLoaded && isSubmit && !isReplied && Object.keys(formErrors).length === 0) {
        sendDataToServer();
    }

    if(isReplied) return(
        <Navigate replace to="../friends-groupe-list" />
    )
    else return ( 
            <div className="form-box">
            <h1 className="suppression-titre">Suppression du groupe</h1>
            <form onSubmit={handleSubmit}>
            <input
                            type="password"
                            name="mdp"
                            placeholder="Saisir le mots de passe pour confirmer"
                            value={formValues.mdp}
                            onChange={handleChange}
            ></input>
                            <p className="error-form">{formErrors.mdp}</p>
                        <button type="submit">
                        Valider
                    </button>
                    </form>
        </div>
        );
}


export default Delete_group;