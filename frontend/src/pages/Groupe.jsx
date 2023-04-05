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
                <div className="centre">
                    <ul className='nav_Button'><li className='buttons_Nav'>
                    <Link to={"../delete-group/" + id}><button>Supprimer ce groupe</button></Link>
                    </li>

                    <li className='buttons_Nav'>
                    <Link to={"../addmember-group/" + id}><button>Ajouter un nouveau membre</button></Link>
                    </li>
                    
                    <li className='buttons_Nav'>
                    <Link to={"../deletemember-group/" + id}><button>Supprimer un membre</button></Link>
                    </li>

                    <li className='buttons_Nav'>
                    <Link to={"../modif-group/" + id}><button>Modifier ce groupe</button></Link>
                    </li></ul>
                </div>
            </nav>
          
        );
        
    }
    return (
        <div className="groupe-centre">
            {navBar}
            <br/><br/><br/>
            {Group(groupe.value)}
        </div>
    );
}

export default Groupe;
