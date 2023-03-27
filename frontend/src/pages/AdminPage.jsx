import {useState} from "react";
import {url_api} from "../data/url_api";
import axios from "axios";


function AdminPage() {
    const [users, setUsers] = useState({ statut: "", users: [], size:0 });

    async function getSize() {
        await axios.get(url_api.url + "/admin_get_users", {
            params:{
                type:"size"
            }
        }).then(function (response) {
            if(response.data == null) console.error("Problème");
            else {
                console.log({statut: "size only", users:[], size:response.data});
                setUsers({statut: "size only", users:[], size:response.data});
            }
        });
    }

    async function getUsers(index) {
        await axios.get(url_api.url + "/admin_get_users", {
            params:{
                type:"users",
                offset: index*5
            }
        }).then(function (response) {
            if(response.data == null) console.error("Problème");
            else {
                console.log(response.data);
                setUsers({statut: "charged", users:response.data, size:users.size});
            }
        });
    }
    if(users.statut === "") {
        getSize();
        return (<h1>Chargement..</h1>)
    } else if (users.statut === "size only") {
        getUsers(0);
        return (<h1>Chargement...</h1>)
    } else {
        return <main>
        <h1>Yo</h1>
        <article>
            {users.users.map((data,index) => <section key={index}>
            <h1>{data["nom"]} {data["prenom"]}</h1>
            {data["email"]}</section>)}
        </article>
        </main>
    }
}

export default AdminPage;