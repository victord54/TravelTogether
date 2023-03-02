import { useState } from 'react'
import axios from 'axios'
import { url_api } from "../data/url_api";

function Search_offer() {
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
        informations:"",
        groupe:""
    };
    const [citiesCodes, setCodes] = useState({start:0, end:0});
    const [proposition, setProposition] = useState({start : "", end : ""});
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const regExCodePostal = new RegExp("[0-9]{5}");

    async function handleSubmit(e){
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
        console.log(errors);
        if (Object.keys(errors).length === 0 ) {
            sendDataToServer();
        }
    }
    
    async function handleChange(e){
        setInputValues({ ...formValues, [e.target.name] : e.target.value});
    }

    function handleCity(e) {
        handleChange(e);
        if(regExCodePostal.test(e.target.value))
            fetch('https://geo.api.gouv.fr/communes?codePostal='+ e.target.value +'&fields=nom,codesPostaux&format=json&geometry=centre').then(rep => rep.json().then(json => setProposition({...proposition, [e.target.name] : json.map((elem,index) => <option key={index} value={elem.nom + " (" +  elem.codesPostaux.map(code => code) + ")"}>{e.target.value}</option>)}))); 
        else
            fetch('https://geo.api.gouv.fr/communes?nom="'+ e.target.value +'"&fields=nom,codesPostaux&format=json&geometry=centre').then(rep => rep.json().then(json => setProposition({...proposition, [e.target.name] : json.map((elem, index) => <option key={index} value={elem.nom + " (" + elem.codesPostaux.map(code => code) + ")"}>{elem.nom}</option>)}))); 
    }

    function sendDataToServer(){
        axios.get(url_api.url + "/search_offer", {
            params: {
                dateDepart : formValues.date,
                nbPlaceDisponible : formValues.size
            }
        })
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log('Error : ' + error);
          });
    }

    async function validateForm(data){
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
        if(!data.size) {
            errors.size = "Le nombre de place est obligatoire.";
        }

        // Vérification lieux
        var pregMatchCity = /([a-zA-Z0-9\u00C0-\u017F'\s-]+) [(]([0-9]+)/;
        var matchStart = data.start.match(pregMatchCity);
        var start;
        var codes = citiesCodes;
        if(matchStart == null) {
            errors.start = "La ville de départ n'est pas correctement remplie : nom-de-la-ville (codePostal).";
        } else {
            var nomStart = matchStart[1];
            var cPStart = matchStart[2];
            start = await fetch("https://geo.api.gouv.fr/communes?nom='"+nomStart+"'&codePostal="+cPStart+"&fields=nom,codesPostaux&format=json&geometry=centre").then(rep => rep.json().then(json => {return json}));
            if(start === undefined || start.length !== 1) errors.start = "La ville de départ ne peut pas être detectée !";
            else {
                codes.start = start[0].code;
            }
        }

        var matchEnd = data.end.match(pregMatchCity);
        var end;
        if(matchEnd == null) {
            errors.end = "La ville d'arrivée n'est pas correctement remplie : nom-de-la-ville (codePostal).";
        } else {
            var nomEnd = matchEnd[1];
            var cPSEnd = matchEnd[2];
            end = await fetch("https://geo.api.gouv.fr/communes?nom='"+nomEnd+"'&codePostal="+cPSEnd+"&fields=nom,codesPostaux&format=json&geometry=centre").then(rep => rep.json().then(json => {return json}));    
            if(end === undefined || end.length !== 1) errors.end = "La ville d'arrivée ne peut pas être detectée !";
            else {
                codes.end = end[0].code;
                setCodes(codes);
            }
        }

        return errors;
    }

    return (
            <div className="form-box">
            <form onSubmit={handleSubmit}>
                <div>Date de départ* : </div>
                <input type="date" name="date" value={formValues.date} onChange={handleChange} />
                <p className="error-form">{formErrors.date}</p>

                <div>Heure de départ : </div>
                <input type="time" name="time" value={formValues.time} onChange={handleChange} />
                <p></p>

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

                <div>Nombre de places* : </div>
                <input type="number" name="size" value={formValues.size} onChange={handleChange}/>
                <p className="error-form">{formErrors.size}</p>

                <br/><br/>
                <div className="button-forms-wrap"><button type='submit' className="formulaire-submit">Valider</button></div>
                <p className="info-obligatoire">* : Information obligatoire.</p>

            </form></div>
    );
}

export default Search_offer;
