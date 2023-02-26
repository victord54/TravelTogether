import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import { url_api } from "../data/url_api";


//check if user is logged in

function Delete_group() {
    //let { id } = useParams();
    const initialValue = {
        mdp: ""
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
   // const [groupe, setGroupes] = useState({value:null, state:null});


/*
    async function getGroupes() {
        // On récupère le groupe 
        var reponse = await axios.get(url_api.url + "/friends_group.php", {
            params: {
                idfGroupe: id,
                mail: localStorage.getItem("mail"),
                type: 'one'
            }
        });
    
        if(reponse.data !== null && reponse.data !== '') {
            setGroupes({value : reponse.data, state : 'ok'});
        } else {
            setGroupes({value : [], state : 'notOk'});
        }
    }
    */

    async function handleSubmit(e) {
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
        setIsSubmit(true);
      
        if (Object.keys(formErrors).length === 0) {
            sendDataToServer();
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
            .post(url_api.url + "/delete_group.php", formData)
            .then(function (response) {
                setInputValues({group: response.data});
                setIsLoaded(true);
            })
            .catch(function (error) {
                console.log("Error :" + error);
            });
            
    }

    

    async function validateForm(data) {

        
        const errors = {};
        
        //Vérification si l'utilisateur a rentrer un mdp 
        if (!data.mdp) {
            errors.mdp = "La saisie du mots de passe est obligatoire.";
        }

   
       /* if (data.mdp === ""){
            errors.mdp = "Le mots de passe saisie n'est pas correct.";
        }
        */
        
        return errors;
    }
        if (isLoaded) {
            return <Navigate replace to={"/groupe/"+formValues.group} />;
        } else
            return (
                // {groupe.value['nomDeGroupe']}  pour recupe le nom du groupe 
                <div className="form-box">
                <h1 className="suppression-titre">Suppression groupe nommé </h1>
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