import axios from "axios";
import {url_api} from "../data/url_api";
import "../styles/Friends-groupe-list.css";
import {useState} from "react";
import {Link} from "react-router-dom";
import Group from "../components/Group";

function Friends_groupe_list() {
    const [groupes, setGroupes] = useState({ values: [], state: null });

    async function getGroupes() {
        // On récupère tout les groupes où l'utilisateur appartient (ou dirige).
        var reponse = await axios.get(url_api.url + "/friends_group", {
            params: {
                mail: localStorage.mail,
                type: "list",
            },
        });

        if (reponse.data !== null && reponse.data.length >= 1) {
            setGroupes({ values: reponse.data, state: "ok" });
        } else {
            setGroupes({ values: [], state: "ok" });
        }
    }

    if (groupes.state == null) {
        getGroupes();
        return (
            <div>
                <h1>Vos groupes d'amis</h1>
                <p>Chargement en cours...</p>
            </div>
        );
    }
    if (groupes.values.length === 0)
        return (
            <div>
                <nav>
                    <ul>
                        <Link to="../create-group"><button className="button_classical">Créer un groupe</button></Link>
                    </ul>
                </nav>
                <h1>Vos groupes d'amis</h1>
                <p>Vous n'êtes dans aucun groupe d'amis</p>
            </div>
        );
    else
        return (
            <div className="wrapper-grp-list">
                <div className="wrapper-titre-bouton">
                    <div className="vos-groupes">Vos groupes d'amis</div>
                    <div className="creer-groupe-wrapper">
                            <Link to="../create-group"><button className="button_classical">Créer un groupe</button></Link>
                    </div>
                </div>
                <br />
                <div className="wrapper-list-group">
                    <ul>
                        {groupes.values.map((groupe) => (
                            <li key={groupe["idfGroupe"]}>
                                <Link
                                    className="groupe-link"
                                    to={"../groupe/" + groupe["idfGroupe"]}>
                                        {Group(groupe)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
}

export default Friends_groupe_list;
