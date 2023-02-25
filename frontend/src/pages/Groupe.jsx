import axios from 'axios'
import { url_api } from "../data/url_api";
import "../styles/Friends-groupe-list.css";
import { useState } from 'react';
import { useParams, Navigate, Link } from "react-router-dom";

function Groupe() {
    let { id } = useParams();
    const [groupe, setGroupes] = useState({value:null, state:null});

    async function getGroupes() {
        // On récupère tout les groupes où l'utilisateur appartient (ou dirige).
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

    if(groupe.state === null) {
        getGroupes();
        return (
            <div>
                <h1>Le groupe d'amis</h1>
                <p>Chargement en cours...</p>
            </div>
        );
    }else if(groupe.state == 'notOk') return (
        <Navigate replace to="./friends-groupe-list" />
    )
    else return (
            <div>
                <nav>
                <ul>
                    <Link to={"../delete_groupe/"+id}>Supprimer ce groupe</Link>
                </ul>
                </nav>
                <h1>{groupe.value['nomDeGroupe']}</h1>
                <div className='groupe-box'>
                    <h2 className='titre-groupe'>{groupe.value['nomDeGroupe']}</h2>
                    <h3 className='membre-list'>Dirigeant : </h3><p className='membre-list'>{groupe.value['dirigeant']}</p>
                    <h3 className='membre-list'>Membre(s) : </h3><p className='membre-list'>{groupe.value['members']}</p>
                </div>
            </div>
        );
}

export default Groupe;