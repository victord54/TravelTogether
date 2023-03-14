import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { url_api } from "../data/url_api";
import "../styles/RatingUser.css";

function RatingUser() {
    const params = useParams();
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const stars = [0, 1, 2, 3, 4, 5];

    async function handleNoterParticipants() {
        await axios
            .get(url_api.url + "/grade_participants", {
                params: {
                    id: params.id,
                },
            })
            .then(function (reponse) {
                console.log(reponse.data);
                setUsers(reponse.data);
                console.log(users);
            });
    }
    if (!isLoaded) {
        handleNoterParticipants();
        setIsLoaded(true);
    }
    if (isLoaded) {
        console.log(users);
        return (
            <>
                <h1>Notez les participants du trajet</h1>
                <form className="rating_form">
                    {users.map((user, index) => {
                        if (user.email != localStorage.getItem('mail')){
                            return (
                                <div key={index} className="user_stars">
                                    {user.nom + " " + user.prenom}
                                    <br/>
                                    {user.email == user.notifie ? <>Conducteur</> : <>Passager</>}
                                    {stars.map((star, index1) => {
                                        return (
                                            <div
                                                key={index1}
                                                className="star_button_pair"
                                            >
                                                <label
                                                    htmlFor={"star" + star + index}
                                                >
                                                    {star}
                                                </label>
                                                <input
                                                    type="radio"
                                                    name="stars"
                                                    id={"star" + star + index}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
                    })}
                </form>
            </>
        );
    }
}

export default RatingUser;
