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
        informations:"",
        groupe:""
    };
    const [citiesCodes, setCodes] = useState({start:0, end:0, inter:[]});
    const [proposition, setProposition] = useState({start : "", end : "", inter : "", groupes : []});
    const [privateOffer, setPrivate] = useState(false);
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const regExCodePostal = new RegExp("[0-9]{5}");


    async function handleSubmit(e){
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
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

    async function handleGroupe(e) {
        if(!privateOffer) {
            var reponse = await axios.get(url_api.url + "/create_offer.php", {
                params: {
                    mail: localStorage.mail
                }
            });
        
            if(reponse.data !== null && reponse.data.length >= 1) {
                var groupes = reponse.data;
                setProposition({...proposition, ['groupes'] : groupes});
                setInputValues({...formValues, ['groupe'] : groupes[0]['idfGroupe']});
            }
        }
        setPrivate(!privateOffer);
    }

    function sendDataToServer(){
        const formData = new FormData();
        formData.append("email", localStorage.mail);
        formData.append("dateDepart", formValues.date);
        formData.append("heureDepart", formValues.time);
        formData.append("prix", formValues.price);
        formData.append("precisions", formValues.precisions);
        formData.append("infos", formValues.informations);
        formData.append("nbPlaceDisponible", formValues.size);
        formData.append("villeDepart", citiesCodes.start);
        formData.append("villeArrivee", citiesCodes.end);
        formData.append("arretIntermediaire", citiesCodes.inter);
        if(privateOffer) formData.append("groupe", formValues.groupe);
        axios.post(url_api.url + "/create_offer.php", formData)
          .then(function (response) {
            console.log('Response : ' + response.data);
          })
          .catch(function (error) {
            console.log('Error : ' + error);
          });
    }

    function add() {
        setInputValues({...formValues, [formValues.interList.name] : formValues.interList.push(formValues.inter)});
    }

    function remove(i) {
        formValues.interList.splice(parseInt(i.target.value), 1);
        setInputValues({...formValues, [formValues.interList.name] : formValues.interList});
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
            }
        }

        if(start !== undefined && start.length === 1 && end !== undefined && end.length === 1 && start[0].code === end[0].code) errors.end = "Le lieu de départ et le lieu d'arrivé ne peuvent être le même.";

        var codeInter = [];
        for (const city of data.interList) {
            var matchInter = city.match(pregMatchCity);
            if(matchInter === null) {
                errors.inter = "La ville : " + city + " n'est pas cirrectement remplie : nom-de-la-ville (codePostal).";
            } else {
                var nomInter = matchInter[1];
                var cPInter = matchInter[2];
                var inter = await fetch("https://geo.api.gouv.fr/communes?nom='"+nomInter+"'&codePostal="+cPInter+"&fields=nom,codesPostaux&format=json&geometry=centre").then(rep => rep.json().then(json => {return json}));    
                if(inter === undefined || inter.length != 1) errors.inter = "La ville : " + city + " n'est pas cirrectement remplie : : nom-de-la-ville (codePostal).";
                if(inter !== undefined) if(codeInter.includes(inter[0].code)) {
                    errors.inter = "Vous ne pouvez pas passer deux fois par le même arrêts intermédiaire.";
                } else {
                    codeInter.push(inter[0].code);
                }
            }
        } 

        if(start !== undefined && start.length === 1 && codeInter.includes(start[0].code)) errors.inter = "La ville de départ ne doit pas être dans les arrêts intermédiaires.";
        else if(end !== undefined && end.length === 1 && codeInter.includes(end[0].code)) errors.inter = "La ville d'arrivée ne doit pas être dans les arrêts intermédiaires.";
        else {
            codes.inter = codeInter;
            setCodes(codes);
        }

        return errors;
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
                <input list="proposition_inter" name="inter" onChange={handleCity} /> <button type="button" className="cityButton" onClick={add}>+</button>
                <datalist id="proposition_inter">
                    {proposition.inter}
                </datalist>
                <table className="cityList">
                    <tbody>
                    {formValues.interList.map((city, i) => 
                        <tr key={i}>
                            <td>{city}</td><td><button type="button" className="cityButton" value={i} onClick={remove}>-</button></td>
                        </tr>)}
                    </tbody>
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
                
                <label><input type="checkbox" name="private" className='not-text-input' onChange={handleGroupe}/>Offre privée</label><br></br>

                <select disabled={!privateOffer} name="groupe" onChange={handleChange}>{proposition.groupes.map(groupe => <option key={groupe['idfGroupe']} value={groupe['idfGroupe']}>{groupe['nomDeGroupe']}</option>)}</select>

                <br/><br/>
                <div className="button-forms-wrap"><button type='submit' className="formulaire-submit">Valider</button></div>
                <p className="info-obligatoire">* : Information obligatoire.</p>

            </form></div>
        </div>
    );
}

export default Create_offer;