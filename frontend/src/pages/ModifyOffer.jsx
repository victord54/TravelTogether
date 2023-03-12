import {useState} from "react";
import axios from "axios";
import {url_api} from "../data/url_api";
import "../styles/Create-offer.css";
import {useNavigate, useParams} from "react-router-dom";

function ModifyOffer() {
    let { id } = useParams();
    const initialValue = {
        start: "",
        end: "",
        inter: "",
        interList: [],
        date: "",
        time: "",
        price: 0,
        size: 0,
        precisions: "",
        informations: "",
        groupe: "",
    };
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});

    /**
     * Fonction appelé lors de la tentative d'envoie du questionnaire au serveur.
     * Vérifie les erreurs et s'il n'y en a pas : Envoie les informations au serveur.
     *
     * @param {*} e Un évènement
     */

    function handleSubmit(e) {
        e.preventDefault();
        setFormErrors(validateForm(formValues));
        if (Object.keys(formErrors).length === 0) {
            sendDataToServer();
        }
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    function sendDataToServer() {

    }

    function validateForm(values) {
        let errors = {};
        if(!values.date) errors.date = "La date de départ est obligatoire !";
        if(!values.time) errors.time = "L'heure de départ est obligatoire !";
        if(!values.price) errors.price = "Le prix est obligatoire !";
        if(!values.size) errors.size = "Le nombre de place est obligatoire !";

        return errors;
    }

    return (
            <div className="form-box">
                <h1 className="creation-titre">Modification de l'offre</h1>
                <form onSubmit={handleSubmit}>
                    <div>Date de départ* : </div>
                    <input
                        type="date"
                        name="date"
                        value={formValues.date}
                        onChange={handleChange}
                    />
                    <p className="error-form">{formErrors.date}</p>
                    <div>Heure de départ* : </div>
                    <input
                        type="time"
                        name="time"
                        value={formValues.time}
                        onChange={handleChange}
                    />
                    <p className="error-form">{formErrors.time}</p>
                    <div>Prix* : </div>
                    <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={handleChange}
                    />
                    <p className="error-form">{formErrors.price}</p>
                    <div>Nombre de places* : </div>
                    <input
                        type="number"
                        name="size"
                        value={formValues.size}
                        onChange={handleChange}
                    />
                    <p className="error-form">{formErrors.size}</p>
                    <div>Précision sur le point de rendez-vous : </div>
                    <input
                        type="text"
                        name="precisions"
                        value={formValues.precisions}
                        onChange={handleChange}
                    />
                    <div>
                        Commentaires / informations supplémentaires :{" "}
                    </div>
                    <input
                        type="text"
                        name="informations"
                        value={formValues.informations}
                        onChange={handleChange}
                    />
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
    );
}


export default ModifyOffer;