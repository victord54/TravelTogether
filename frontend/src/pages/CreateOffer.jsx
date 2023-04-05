import {useState} from "react";
import axios from "axios";
import {url_api} from "../data/url_api";
import "../styles/Create-offer.css";
import {useNavigate} from "react-router-dom";
import plus from "../assets/plus.svg";
import moins from "../assets/moins.svg";

function Create_offer() {
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
    const [citiesCodes, setCodes] = useState({ start: 0, end: 0, inter: [] });
    const [proposition, setProposition] = useState({
        start: "",
        end: "",
        inter: "",
        groupes: [],
    });
    const [privateOffer, setPrivate] = useState(false);
    const [formValues, setInputValues] = useState(initialValue);
    const [formErrors, setFormErrors] = useState({});
    const regExCodePostal = new RegExp("[0-9]{5}");
    const navigate = useNavigate();

    /**
     * Fonction appelé lors de la tentative d'envoie du questionnaire au serveur.
     * Vérifie les erreurs et s'il n'y en a pas : Envoie les informations au serveur.
     *
     * @param {*} e Un évènement
     */
    async function handleSubmit(e) {
        console.log(formValues);
        e.preventDefault();
        var errors = await validateForm(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            sendDataToServer();
        }
    }

    /**
     * Fonction qui permet de réagir quand on change la valeur d'un champs.
     * @param {*} e Un évènement
     */
    async function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    /**
     * Fonction qui permet de réagir quand on écrit dans un input relié aux villes.
     * @param {*} e Un évènement
     */
    function handleCity(e) {
        handleChange(e);
        if (regExCodePostal.test(e.target.value))
            fetch(
                "https://geo.api.gouv.fr/communes?codePostal=" +
                    e.target.value +
                    "&fields=nom,codesPostaux&format=json&geometry=centre"
            ).then((rep) =>
                rep.json().then((json) =>
                    setProposition({
                        ...proposition,
                        [e.target.name]: json.map((elem, index) => (
                            <option
                                key={index}
                                value={
                                    elem.nom +
                                    " (" +
                                    elem.codesPostaux.map((code) => code) +
                                    ")"
                                }
                            >
                                {e.target.value}
                            </option>
                        )),
                    })
                )
            );
        else
            fetch(
                'https://geo.api.gouv.fr/communes?nom="' +
                    e.target.value +
                    '"&fields=nom,codesPostaux&format=json&geometry=centre'
            ).then((rep) =>
                rep.json().then((json) =>
                    setProposition({
                        ...proposition,
                        [e.target.name]: json.map((elem, index) => (
                            <option
                                key={index}
                                value={
                                    elem.nom +
                                    " (" +
                                    elem.codesPostaux.map((code) => code) +
                                    ")"
                                }
                            >
                                {elem.nom}
                            </option>
                        )),
                    })
                )
            );
    }

    /**
     * Fonction qui permet de réagir quand on selectionne une offre comme privée.
     * @param {*} e Un évènement
     */
    async function handleGroupe(e) {
        if (!privateOffer) {
            // On récupère tout les groupes où l'utilisateur appartient (ou dirige).
            var reponse = await axios.get(url_api.url + "/create_offer", {
                params: {
                    mail: localStorage.mail,
                },
            });
            console.log(reponse);
            if (reponse.data !== null && reponse.data.length >= 1) {
                var groupes = reponse.data;
                setProposition({ ...proposition, groupes: groupes });
                setPrivate(!privateOffer);
                setInputValues({
                    ...formValues,
                    ["groupe"]: groupes[0]["idfGroupe"]
                });
            }
        } else {
            setPrivate(!privateOffer);
        }
    }

    /**
     * Fonction qui permet d'envoyer les informations au serveur.
     */
    function sendDataToServer() {
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
        if (privateOffer) {
            formData.append("groupe", formValues.groupe);
            console.log("groupe privée " + formValues.groupe);
        } 
        axios
            .post(url_api.url + "/create_offer", formData)
            .then(function (response) {
                console.log("Response : " + response.data);
                navigate("/");
            })
            .catch(function (error) {
                console.log("Error : " + error);
            });
    }

    /**
     * Ajoute la ville contenu dans formValues.inter dans les arrêts intermédiaires.
     */
    function add() {
        setInputValues({
            ...formValues,
            [formValues.interList.name]: formValues.interList.push(
                formValues.inter
            ),
        });
    }

    /**
     * Echange l'index de deux élements dans la liste des arrêts intermédiaire.
     * Attention veillez viens à ce que 0 <= fromIndex <= formValues.interList.length
     * et à ce que 0 <= toIndex <= formValues.interList.length
     *
     * @param {number} fromIndex Premier index de l'élément à échanger
     * @param {number} toIndex Deuxième index de l'autre élément à échanger
     */
    function move(fromIndex, toIndex) {
        let arr = formValues.interList;
        [arr[fromIndex], arr[toIndex]] = [arr[toIndex], arr[fromIndex]];
        setInputValues({ ...formValues, [formValues.interList.name]: arr });
    }

    /**
     * Echange de place une ville avec la ville précédente dans la liste
     *
     * @param {*} i Evenement de click sur le bouton remove. i.target.value doit être un entier correspondant à l'index de la ville !
     */
    function moveUp(i) {
        if (i.target.value !== 0) {
            var index = parseInt(i.target.value);
            move(index, index - 1);
        }
    }

    /**
     * Echange de place une ville avec la ville suivante dans la liste
     *
     * @param {*} i Evenement de click sur le bouton remove. i.target.value doit être un entier correspondant à l'index de la ville !
     */
    function moveDown(i) {
        if (i.target.value !== formValues.interList.length - 1) {
            var index = parseInt(i.target.value);
            move(index, index + 1);
        }
    }

    /**
     * Enlève une ville de la liste des arrêts intermédiaires
     *
     * @param {*} i Evenement de click sur le bouton remove. i.target.value doit être un entier correspondant à l'index de la ville !
     */
    function remove(i) {
        formValues.interList.splice(parseInt(i.target.value), 1);
        setInputValues({
            ...formValues,
            [formValues.interList.name]: formValues.interList,
        });
    }

    async function validateForm(data) {
        const errors = {};

        // Vérification des champs obligatoires
        if (!data.start) {
            errors.start = "La ville de départ est obligatoire.";
        }
        if (!data.end) {
            errors.end = "La ville d'arrivée est obligatoire.";
        }
        if (!data.date) {
            errors.date = "La date de départ est obligatoire.";
        }
        if (!data.time) {
            errors.time = "L'heure de départ est obligatoire.";
        }
        if (!data.price) {
            errors.price = "Le prix est obligatoire.";
        }
        if (!data.size) {
            errors.size = "Le nombre de place est obligatoire.";
        }

        // Vérification date
        if (new Date(data.date + " " + data.time) <= new Date())
            errors.time = "La date et l'heure sont déjà passées.";

        // Vérification prix
        if (data.price < 0)
            errors.price = "Le prix doit avoir une valeur positive ou nulle.";

        // Vérification nombre de place
        if (data.size <= 0)
            errors.size = "Le nombre de place doit être strictement positif.";

        // Vérification lieux
        var pregMatchCity = /([a-zA-Z0-9\u00C0-\u017F'\s-]+) [(]([0-9]+)/;
        var matchStart = data.start.match(pregMatchCity);
        var start;
        var codes = citiesCodes;

        // Récupération du code de la ville de départ
        if (matchStart == null) {
            errors.start =
                "La ville de départ n'est pas correctement remplie : nom-de-la-ville (codePostal).";
        } else {
            var nomStart = matchStart[1];
            var cPStart = matchStart[2];
            start = await fetch(
                "https://geo.api.gouv.fr/communes?nom='" +
                    nomStart +
                    "'&codePostal=" +
                    cPStart +
                    "&fields=nom,codesPostaux&format=json&geometry=centre"
            ).then((rep) =>
                rep.json().then((json) => {
                    return json;
                })
            );
            if (start === undefined || start.length < 1)
                errors.start = "La ville de départ ne peut pas être detectée !";
            else {
                codes.start = start[0].code;
            }
        }

        // Récupération du code de la ville d'arrivée
        var matchEnd = data.end.match(pregMatchCity);
        var end;
        if (matchEnd == null) {
            errors.end =
                "La ville d'arrivée n'est pas correctement remplie : nom-de-la-ville (codePostal).";
        } else {
            var nomEnd = matchEnd[1];
            var cPSEnd = matchEnd[2];
            end = await fetch(
                "https://geo.api.gouv.fr/communes?nom='" +
                    nomEnd +
                    "'&codePostal=" +
                    cPSEnd +
                    "&fields=nom,codesPostaux&format=json&geometry=centre"
            ).then((rep) =>
                rep.json().then((json) => {
                    return json;
                })
            );
            if (end === undefined || end.length < 1)
                errors.end = "La ville d'arrivée ne peut pas être detectée !";
            else {
                codes.end = end[0].code;
            }
        }

        // Comparaison entre la ville de départ et la ville d'arrivée
        if (
            start !== undefined &&
            start.length === 1 &&
            end !== undefined &&
            end.length === 1 &&
            start[0].code === end[0].code
        )
            errors.end =
                "Le lieu de départ et le lieu d'arrivé ne peuvent être le même.";

        // Récupération des codes des arrêts intermédiraires
        var codeInter = [];
        for (const city of data.interList) {
            var matchInter = city.match(pregMatchCity);
            if (matchInter === null) {
                errors.inter =
                    "La ville : " +
                    city +
                    " n'est pas correctement remplie : nom-de-la-ville (codePostal).";
            } else {
                var nomInter = matchInter[1];
                var cPInter = matchInter[2];
                var inter = await fetch(
                    "https://geo.api.gouv.fr/communes?nom='" +
                        nomInter +
                        "'&codePostal=" +
                        cPInter +
                        "&fields=nom,codesPostaux&format=json&geometry=centre"
                ).then((rep) =>
                    rep.json().then((json) => {
                        return json;
                    })
                );

                if (inter === undefined || inter.length < 1)
                    errors.inter =
                        "La ville : " +
                        city +
                        " n'est pas cirrectement remplie : : nom-de-la-ville (codePostal).";

                if (inter !== undefined)
                    if (codeInter.includes(inter[0].code)) {
                        errors.inter =
                            "Vous ne pouvez pas passer deux fois par le même arrêts intermédiaire.";
                    } else {
                        codeInter.push(inter[0].code);
                    }
            }
        }

        // Test de validité sur la liste des arrêts intermédiaires
        if (
            start !== undefined &&
            start.length === 1 &&
            codeInter.includes(start[0].code)
        )
            errors.inter =
                "La ville de départ ne doit pas être dans les arrêts intermédiaires.";
        else if (
            end !== undefined &&
            end.length === 1 &&
            codeInter.includes(end[0].code)
        )
            errors.inter =
                "La ville d'arrivée ne doit pas être dans les arrêts intermédiaires.";
        else {
            codes.inter = codeInter;
            setCodes(codes); // Si tout les codes sont bon alors on mets les informations dans citiesCodes
        }

        return errors;
    }

    if (localStorage.getItem("aUneVoiture") === 0)
        return (
            <div className="form-box">
                <h1 className="offer_titre">
                    Vous ne pouvez pas créer d'offre.
                </h1>
                <p>
                    Pour pouvoir créer une offre, vous devez posséder une
                    voiture.
                </p>
            </div>
        );
    else
        return (
            <div>
                <div className="form_box">
                    <h1 className="titre">Création de l'offre</h1>
                    <form onSubmit={handleSubmit}>
                        <div>Lieu de départ* :</div>
                        <input
                            list="proposition_start"
                            name="start"
                            onChange={handleCity}
                        />
                        <datalist id="proposition_start">
                            {proposition.start}
                        </datalist>
                        <p className="error-form">{formErrors.start}</p>
                        <div>Lieu d'arrivée* :</div>
                        <input
                            list="proposition_end"
                            name="end"
                            onChange={handleCity}
                        />
                        <datalist id="proposition_end">
                            {proposition.end}
                        </datalist>
                        <p className="error-form">{formErrors.end}</p>
                        <div>Arrêtes intermédiaires : </div>
                        <div className="division_city">
                            <input
                                list="proposition_inter"
                                name="inter"
                                onChange={handleCity}
                            />{" "}
                            <span
                                className="add_city_button"
                                onClick={add}
                            >
                                <img 
                                src={plus}
                                alt="plus"
                                width="32"
                                />
                            </span>
                        </div>
                        <datalist id="proposition_inter">
                            {proposition.inter}
                        </datalist>
                        <table className="cityList">
                            <tbody>
                                {formValues.interList.map((city, i) => (
                                    <tr key={i}>
                                        <td>{i}</td>
                                        <td>{city}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="cityButton"
                                                value={i}
                                                onClick={moveUp}
                                                disabled={i === 0}
                                    
                                            >
                                                &#8593; 
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="cityButton"
                                                value={i}
                                                onClick={moveDown}
                                                disabled={
                                                    i ===
                                                    formValues.interList
                                                        .length -
                                                        1
                                                }
                                            >
                                                &#8595;
                                            </button>
                                        </td>
                                        <td>
                                            <span
                                                className="cityButton"
                                                value={i}
                                                onClick={remove}
                                            >
                                                <img 
                                                    src={moins}
                                                    alt="moins"
                                                    width="32"
                                                />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="error-form">{formErrors.inter}</p>
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
                        <p className="error-form">{formErrors.precisions}</p>
                        <div>
                            Commentaires / informations supplémentaires :{" "}
                        </div>
                        <input
                            type="text"
                            name="informations"
                            value={formValues.informations}
                            onChange={handleChange}
                        />
                        <p className="error-form">{formErrors.informations}</p>
                        <label>
                            <input
                                type="checkbox"
                                name="private"
                                className="not-text-input"
                                onChange={handleGroupe}
                            />
                            Offre privée
                        </label>
                        <br></br>
                        <select
                            disabled={!privateOffer}
                            name="groupe"
                            className="not-text-input"
                            onChange={handleChange}
                        >
                            {proposition.groupes.map((groupe) => (
                                <option
                                    key={groupe["idfGroupe"]}
                                    value={groupe["idfGroupe"]}
                                >
                                    {groupe["nomDeGroupe"]}
                                </option>
                            ))}
                        </select>
                        <br />
                        <br />
                        <div className="button-forms-wrap">
                            <button type="submit" className="formulaire_submit">
                                Valider
                            </button>
                        </div>
                        <p className="info-obligatoire">
                            * : Information obligatoire.
                        </p>
                    </form>
                </div>
            </div>
        );
}

export default Create_offer;
