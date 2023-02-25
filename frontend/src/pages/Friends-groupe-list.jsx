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
                mail: localStorage.mail,
                type: 'list'
            }
        });
    
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
            <nav>
            <ul>
                <Link to="../create_group">Créer un groupe</Link>
            </ul>
            </nav>
            <h1>Vos groupes d'amis</h1>
            <p>Vous n'êtes dans aucun groupe d'amis</p>
        </div>
    );
    else return (
            <div className="wrapper-grp-list">
                <div className="wrapper-titre-bouton">
                    <div className="vos-groupes">Vos groupes d'amis</div>
                    <div className="creer-groupe-wrapper"><button><Link to="../create_group">Créer un groupe</Link></button></div>
                </div> 
                <br/>
                <div className="wrapper-list-group">
                    <ul>
                        {
                        groupes.values.map(groupe => 
                            <li key={groupe['idfGroupe']}>
                                <div className='groupe-box'>
                                    <Link className='groupe-link' to={'../groupe/'+groupe['idfGroupe']}>
                                        <h2 className='titre-groupe'>{groupe['nomDeGroupe']}</h2>
                                        <h3 className='membre-list'>Dirigeant : </h3><p className='membre-list'>{groupe['dirigeant']}</p>
                                        <h3 className='membre-list'>Membre(s) : </h3><p className='membre-list'>{groupe['members']}</p>
                                    </Link>
                                </div>
                            </li>)
                        }
                    </ul>
                </div>
            </div>
        );
}

export default Friends_groupe_list;