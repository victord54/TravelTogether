import {useState} from 'react';
import axios from 'axios';
import {url_api} from "../data/url_api";
import Offer from "../components/Offer";
import {Link, useParams} from "react-router-dom";

function Search_offer() {
    let { id } = useParams();
    const [offers, setOffers] = useState({statut : "", offer : null});

    function load_data() { 
        axios.get(url_api.url + "/offer", {
            params: {
                idfOffre : id
            }
        })
            .then(function (response) {
                setOffers({statut : "ok", offer : response.data});
            })
            .catch(function (error) {
                console.log('Error : ' + error);
                setOffers({statut : "ok", offer : null});
            });
    }
    let nav = <nav></nav>;

    if(offers.statut === "") {
        load_data();
        return (
            <main>
                <p>Chargement des informations...</p>
            </main>
        );
    } else if (offers.statut === "ok" && offers.offer === null)
        return (
            <main>
                <article>
                    <p>L'offre n'est pas trouvée !</p>
                </article>
            </main>
        );
    else if (offers.offer["email"] !== localStorage.getItem("mail")) {
        nav = <nav>
            <ul>
                <Link to={"../reply/" + id}></Link>
            </ul>
        </nav>;
    }
    return (
        <main>
            {nav}    
            <article>
                {Offer(offers.offer)}
            </article>
        </main>
    );
}

export default Search_offer;