import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import { url_api } from "../data/url_api";

//check if user is logged in

function Create_group() {
    const initialValue = {
        group: ""
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setFormErrors(validateForm(formValues));
        setIsSubmit(true);
        console.log(
            "submit : " +
                isSubmit +
                "; length : " +
                Object.keys(formErrors).length
        );
        if (Object.keys(formErrors).length == 0) {
            await sendDataToServer();
        }
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    async function sendDataToServer() {
        const formData = new FormData()
        formData.append("nom", formValues.group)
        formData.append("mail", localStorage.getItem("mail"))
        await axios
            .post(url_api.url + "/create_group.php", formData)
            .then(function (response) {
                setInputValues({group: response.data});
                setIsLoaded(true);
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    function validateForm(data) {
        const errors = {};

        //Vérification nom
        if (data.group == "") {
            errors.group = "Le nom de groupe est obligatoire.";
        }
        return errors;
    }
        if (isLoaded) {
            return <Navigate replace to={"/groupe/"+formValues.group} />;
        } else
            return (
                <div className="form-box">
                <h1 className="creation-titre">Création d'un nouveau groupe</h1>
                <form onSubmit={handleSubmit}>
                <input
                                type="text"
                                name="group"
                                value={formValues.group}
                                onChange={handleChange}
                            ></input><button type="submit">
                            Valider
                        </button>
                        </form>
            </div>
            );
}

export default Create_group;