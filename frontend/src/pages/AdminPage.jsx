import {useState} from "react";
import {url_api} from "../data/url_api";
import {Link} from "react-router-dom";
import axios from "axios";
import "../styles/Admin-page.css";



function AdminPage() {
    const [users, setUsers] = useState({ statut: "", users: [], size:0, charged:0});

    async function getSize() {
        await axios.get(url_api.url + "/admin_get_users", {
            params:{
                type:"size"
            }
        }).then(function (response) {
            if(response.data == null) console.error("Problème");
            else {
                setUsers({statut: "size only", users:[], size:response.data, charged:0});
            }
        });
    }

    async function getUsers(index) {
        await axios.get(url_api.url + "/admin_get_users", {
            params:{
                type:"users",
                offset: index
            }
        }).then(function (response) {
            if(response.data == null) console.error("Problème");
            else {
                setUsers({statut: "charged", users:response.data, size:users.size, charged:index});
            }
        });
    }

    function getUsersIndex(event) {
        getUsers(event.target.value);
    }

    if(users.statut === "") {
        getSize();
        return (<h1>Chargement..</h1>)
    } else if (users.statut === "size only") {
        getUsers(0);
        return (<h1>Chargement...</h1>)
    } else {
        var indexList = [];
        for(var i = 1; i < Math.ceil(users.size/10)+1; i++) indexList.push(i);
        console.log(indexList);
        var indexBar = <nav className="index-bar">
            {indexList.map((val) => <button className="index-button" disabled={(val-1)*10==users.charged} value={(val-1)*10} key={val} onClick={getUsersIndex}>{val}</button>)}
        </nav>;
        return <main>
        <h1>Liste des membres</h1>
        {indexBar}
        <article>
            {users.users.map((data,index) => 
            <section key={index}>
                <table align="left">
                    <tbody>
                        <tr>
                            <td>
                            <img
                                alt="profil"
                                src={data["photo"] + "?" + Math.random()}
                                width="75px"
                            />
                            </td>
                            <td>
                            <h1>{data["nom"]} {data["prenom"]}</h1>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>{data["email"]}</td>
                        </tr>
                    </tbody>
                </table>
               <ul className='navButton' align="right">
               {data["estAdmin"] === '0' ? (<li className='buttonsNavAdmin'><Link to={"../delete-user/" + data["email"]}>Supprimer l'utilisateur</Link></li>) : (<></>) }
                    <li className='buttonsNavAdmin'><Link to={"../admin-see-offers/" + data["email"]}>Consulter les offres de l'utilisateur</Link></li>
                </ul>
            </section>)}
        </article>
        {indexBar}
        </main>
    }
}

export default AdminPage;