import { useState } from 'react'
import axios from 'axios'
import { url_api } from "../data/url_api";
import "../styles/Create-offer.css";

function Create_offer() {
    const initialValue = {
        start : "", 
        end :"", 
        inter:"", 
        interList:[], 
        date:"", 
        time:"", 
        price:0, 
        size:0, 
        precisions:"", 
        informations:""
    }

    const [proposition, setProposition] = useState({start : "", end : "", inter : ""})
    const [formValues, setInputValues] = useState(initialValue)
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false);
    const regExCodePostal = new RegExp("[0-9]{5}")

    function handleSubmit(e){
        e.preventDefault()
        setFormErrors(validateForm(formValues))
        console.log(formErrors)
        setIsSubmit(true)
    }
    
    function handleChange(e){
        setInputValues({ ...formValues, [e.target.name] : e.target.value})
    }

    function handleCity(e) {
        handleChange(e);
        if(regExCodePostal.test(e.target.value))
            fetch('https://geo.api.gouv.fr/communes?codePostal='+ e.target.value +'&fields=nom,codesPostaux&format=json&geometry=centre').then(rep => rep.json().then(json => setProposition({...proposition, [e.target.name] : json.map(elem => <option key={elem.code} value={elem.nom + " (" + elem.codesPostaux[0] + ")"}>{elem.codesPostaux[0]}</option>)}))); 
        else
            fetch('https://geo.api.gouv.fr/communes?nom="'+ e.target.value +'"&fields=nom,codesPostaux&format=json&geometry=centre').then(rep => rep.json().then(json => setProposition({...proposition, [e.target.name] : json.map(elem => <option key={elem.code} value={elem.nom + " (" + elem.codesPostaux[0] + ")"}>{elem.nom}</option>)}))); 
    }

    function sendDataToServer(){
        axios.post(url_api.url + "/create_offer", {
            data: {
              inputValue: formValues
            }
          })
          .then(function (response) {
            console.log('Response :' + response.data);
          })
          .catch(function (error) {
            console.log('Error :' + error);
          });
    }

    function add() {
        if(formValues.interList.includes(formValues.inter)) {
            formErrors.inter = "Une ville ne peut pas être ajoutée deux fois dans la liste des arrêts intermédiaires."
            setFormErrors(formErrors);
        } else if (formValues.inter == formValues.start) {
            formErrors.inter = "La ville de départ ne peut pas être ajoutée dans la liste des arrêts intermédiaires."
            setFormErrors(formErrors);
        } else if (formValues.inter == formValues.end) {
            formErrors.inter = "La ville d'arrivée ne peut pas être ajoutée dans la liste des arrêts intermédiaires."
            setFormErrors(formErrors);
        } else {
            formErrors.inter = "";
            setFormErrors(formErrors);
            setInputValues({...formValues, [formValues.interList.name] : formValues.interList.push(formValues.inter)});
        }
        setInputValues({...formValues, [formValues.interList.name] : formValues.interList});
    }

    function remove(i) {
        formValues.interList.splice(parseInt(i.target.value), 1);
        console.log(parseInt(i.target.value));
        setInputValues({...formValues, [formValues.interList.name] : formValues.interList});
    }

    function validateForm(data){
        console.log(data)
        const errors = {}
        
        // Vérification des champs obligatoires
        if(!data.start) {
            errors.start = "La ville de départ est obligatoire.";
        }
        if(!data.end) {
            errors.end = "La ville d'arrivée est obligatoire.";
        }
        if(!data.date) {
            errors.date = "La date de départ est obligatoire.";
        }
        if(!data.time) {
            errors.time = "L'heure de départ est obligatoire.";
        }
        if(!data.price) {
            errors.price = "Le prix est obligatoire.";
        }
        if(!data.size) {
            errors.size = "Le nombre de place est obligatoire.";
        }

        // Vérification date
        if(new Date(data.date) <= new Date()) errors.date = "La date est déjà passée.";

        // Vérification prix
        if(data.price < 0) errors.price = "Le prix doit avoir une valeur positive ou nulle.";

        // Vérification nombre de place
        if(data.size <= 0) errors.size = "Le nombre de place doit être strictement positif.";

        // Vérification lieux
        if(data.start == data.end) errors.end = "Le lieu de départ et le lieu d'arrivé ne peuvent être le même.";

        return errors
    }
    
    if (isSubmit && Object.keys(formErrors).length ===0 ) {
        sendDataToServer()
    }

    return (
        <div>
            <div className="form-box">
            <h1 className="creation-titre">Création de l'offre</h1>
            <form onSubmit={handleSubmit}>
                <div>Lieu de départ* :</div>
                <input list="proposition_start" name="start" onChange={handleCity} />    
                <datalist id="proposition_start">
                    {proposition.start}
                </datalist>
                <p className="error-form">{formErrors.start}</p>
                
                <div>Lieu d'arrivée* :</div>
                <input list="proposition_end" name="end" onChange={handleCity} />    
                <datalist id="proposition_end">
                    {proposition.end}
                </datalist>
                <p className="error-form">{formErrors.end}</p>

                <div>Arrêtes intermédiaires : </div>
                <input list="proposition_inter" name="inter" onChange={handleCity} /> <button type="button" className="citieButton" onClick={add}>+</button>
                <datalist id="proposition_inter">
                    {proposition.inter}
                </datalist>
                <table className="cityList">
                    {formValues.interList.map((city, i) => <tr> <td>{city}</td><td><button type="button" className="citieButton" value={i} onClick={remove}>-</button></td></tr>)}
                </table>
                <p className="error-form">{formErrors.inter}</p>

                <div>Date de départ* : </div>
                <input type="date" name="date" value={formValues.date} onChange={handleChange} />
                <p className="error-form">{formErrors.date}</p>

                <div>Heure de départ* : </div>
                <input type="time" name="time" value={formValues.time} onChange={handleChange} />
                <p className="error-form">{formErrors.time}</p>

                <div>Prix* : </div>
                <input type="number" name="price" value={formValues.price} onChange={handleChange}/>
                <p className="error-form">{formErrors.price}</p>

                <div>Nombre de places* : </div>
                <input type="number" name="size" value={formValues.size} onChange={handleChange}/>
                <p className="error-form">{formErrors.size}</p>

                <div>Précision sur le point de rendez-vous : </div>
                <input type="text" name="precisions" value={formValues.precisions} onChange={handleChange} />
                <p className="error-form">{formErrors.precisions}</p>


                <div>Commentaires / informations supplémentaires : </div>
                <input type="text" name="informations" value={formValues.informations} onChange={handleChange} />
                <p className="error-form">{formErrors.informations}</p>


                <br/><br/>
                <div className="button-forms-wrap"><button type='submit' className="formulaire-submit">Valider</button></div>
                <p className="info-obligatoire">* : Information obligatoire.</p>

            </form></div>
        </div>
    );
}

export default Create_offer;