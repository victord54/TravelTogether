import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Signin.css";
import { url_api } from "../data/url_api";

//check if user is logged in

function Create_group() {
    const initialValue = {
        group: "",
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setFormErrors(validateForm(formValues));
        console.log(Object.keys(formErrors));
        setIsSubmit(true);
        console.log(
            "submit : " +
                isSubmit +
                "; length : " +
                Object.keys(formErrors).length
        );
        if (Object.keys(formErrors).length == 0) {
            sendDataToServer();
        }
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    function sendDataToServer() {
        console.log("on envoie");
        const formData = new FormData()
        formData.append("nom", formValues.group)
        formData.append("mail", localStorage.getItem("mail"))
        console.log(formValues.group, localStorage.getItem("mail"));
        axios
            .post(url_api.url + "/create_group.php", formData)
            .then(function (response) {
                //console.log("Response :" + response.data);
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    function validateForm(data) {
        console.log(data);
        const errors = {};

        //Vérification nom
        if (data.group == "") {
            errors.group = "Le nom de groupe est obligatoire.";
        }
        return errors;
    }

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