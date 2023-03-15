import axios from "axios";
import {url_api} from "../data/url_api";
import "../styles/Friends-groupe-list.css";
import {useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import Group from "../components/Group";

function Groupe() {
    let { id } = useParams();
    const [groupe, setGroupes] = useState({ value: null, state: null });

    async function getGroupes() {
        // On récupère tout les groupes où l'utilisateur appartient (ou dirige).
        var reponse = await axios.get(url_api.url + "/friends_group", {
            params: {
                idfGroupe: id,

                mail: localStorage.getItem("mail"),
                type: "one",
            },
        });

        if (reponse.data !== null && reponse.data !== "") {
            setGroupes({ value: reponse.data, state: "ok" });
        } else {
            setGroupes({ value: [], state: "notOk" });
        }
    }
    let navBar = <nav></nav>;

    if (groupe.state == null) {
        getGroupes();
        return (
            <div>
                <h1>Le groupe d'amis</h1>
                <p>Chargement en cours...</p>
            </div>
        );
    } else if (groupe.state === "notOk")
        return <Navigate replace to="./friends-group-list" />;
    else if (groupe.value["email"] === localStorage.getItem("mail")) {
       

        navBar = (

            <nav>
                    <ul className='navButton'><li className='buttonsNav'>
                    <Link to={"../delete-group/" + id}>Supprimer ce groupe</Link>
                    </li>

                    <li className='buttonsNav'>
                    <Link to={"../addmember-group/" + id}>Ajouter un nouveau membre</Link>
                    </li>

                    <li className='buttonsNav'>
                    <Link to={"../deletemember-group/" + id}>Supprimer un membre</Link>
                    </li>

                    <li className='buttonsNav'>
                    <Link to={"../modif-group/" + id}>Modifier ce groupe</Link>
                    </li></ul>
                
            </nav>
          
        );
        
    }
    return (
        <div>
            {navBar}
            <br></br>
            <h1>{groupe.value["nomDeGroupe"]}</h1>
            {Group(groupe.value)}
        </div>
    );
}

export default Groupe;
