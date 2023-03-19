import {useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import {url_api} from "../data/url_api";

//check if user is logged in

function Modif_group() {
    let { id } = useParams();
    const initialValue = {
        group: "",
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
        setIsSubmit(true);

        console.log(
            "submit : " +
                isSubmit +
                "; length : " +
                Object.keys(formErrors).length
        );

        if (Object.keys(errors).length === 0) {
            sendDataToServer();
        }
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    async function sendDataToServer() {
        const errors = {};
        const formData = new FormData();
        formData.append("idfGroupe", id);
        formData.append("nom", formValues.group);
        formData.append("mail", localStorage.getItem("mail"));
        await axios
            .post(url_api.url + "/modif_group", formData)
            .then(function (response) {
                console.log("response", response.data);
                console.log("test", response.data === "exists")
                if(response.data == 0){
                    //console.log("exists");
                    
                    setIsLoaded(false);
                    errors.group = "Vous avez un nom de groupe de ce nom deja existant.";
                    setFormErrors(errors);
                    return errors;
                }else{
                    console.log("hi");
                    setInputValues({ group: response.data });
                setIsLoaded(true);
            }
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
    }

    function validateForm(data) {
        const errors = {};

        //Vérification nom
        if (!data.group) {
            errors.group = "Le nom de groupe est obligatoire.";
        }
        return errors;
    }
    if (isLoaded) {
        return <Navigate replace to="../friends-group-list" />;
    } else
        return (
            <div className="form-box">
                <h1 className="creation-titre">Modification d'un groupe</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="group"
                        value={formValues.group}
                        onChange={handleChange}
                    ></input>
                    <p className="error-form">{formErrors.group}</p>
                    <div className="button-forms-wrap">
                        <button type="submit" className="formulaire-submit">
                            Valider
                        </button>
                    </div>
                </form>
            </div>
        );
}

export default Modif_group;
