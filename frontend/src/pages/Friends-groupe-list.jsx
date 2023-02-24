import axios from 'axios'
import { url_api } from "../data/url_api";
import "../styles/Friends-groupe-list.css";
import { useState } from 'react';
import { Link } from "react-router-dom";

function Friends_groupe_list() {
    const [groupes, setGroupes] = useState({values:[], state:null});

    async function getGroupes() {
        // On récupère tout les groupes où l'utilisateur appartient (ou dirige).
        var reponse = await axios.get(url_api.url + "/friends_group.php", {
            params: {
                mail: localStorage.mail
            }
        });
        console.log(reponse.data);
    
        if(reponse.data !== null && reponse.data.length >= 1) {
            setGroupes({values : reponse.data, state : 'ok'});
        } else {
            setGroupes({values : [], state : 'ok'});
        }
    }

    if(groupes.state === null) {
        getGroupes();
        return (
            <div>
                <h1>Vos groupes d'amis</h1>
                <p>Chargement en cours...</p>
            </div>
        );
    }
    if(groupes.values.length == 0) return (
        <div>
            <h1>Vos groupes d'amis</h1>
            <p>Vous n'êtes dans aucun groupe d'amis</p>
        </div>
    );
    else return (
            <div>
                <h1>Vos groupes d'amis</h1>
                <ul>
                    {
                    groupes.values.map(groupe => <li key={groupe['idfGroupe']}>
                        <div className='groupe-box'>
                        <Link className='groupe-link' to={'../blog/'+groupe['idfGroupe']}>
                            <h3 className='titre-groupe'>{groupe['nomDeGroupe']}</h3>
                            <p className='membre-list'><h4>Dirigeant : </h4>{groupe['dirigeant']}</p>
                            <p className='membre-list'><h4>Membre(s) : </h4>{groupe['members']}</p>
                        </Link>
                        </div>
                        </li>)
                    }
                </ul>
            </div>
        );
}

export default Friends_groupe_list;