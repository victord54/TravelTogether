import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { url_api } from "../data/url_api";
import "../styles/RatingUser.css";

function RatingUser() {
    const params = useParams();
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const stars = [0, 1, 2, 3, 4, 5];
    const [rate, setRate] = useState([]);
    const navigate = useNavigate();

    async function getRate() {
        await axios
            .get(url_api.url + "/rate_user", { params: { id: params.id } })
            .then(function (reponse) {
                delete reponse.data[localStorage.getItem("mail")];
                console.log(reponse.data);
                setRate(reponse.data);
            });
    }

    async function deleteRate(idRated, idf) {
        await axios
            .delete(url_api.url + "/rate_user", {
                params: { idRated: idRated, idf: idf },
            })
            .then(function (reponse) {
                console.log(reponse.data);
            });
    }

    async function createRate() {
        const data = new FormData();
        data.append("rater", localStorage.getItem("mail"));
        data.append("offer", params.id);
        for (const [k, v] of Object.entries(rate)) {
            data.append(k, v);
        }
        await axios
            .post(url_api.url + "/rate_user", data)
            .then(function (reponse) {
                console.log(reponse.data);
                navigate("/profile");
            });
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(rate);
        createRate();
    }

    function handleChange(e) {
        setRate({ ...rate, [e.target.name]: e.target.value });
    }

    function handleDelete(e, id) {
        e.preventDefault();
        console.log("delete " + id);
        setRate({ ...rate, [id]: null });
        deleteRate(id, params.id);
    }

    async function handleNoterParticipants() {
        await axios
            .get(url_api.url + "/grade_participants", {
                params: {
                    id: params.id,
                },
            })
            .then(function (reponse) {
                reponse.data = reponse.data.filter(
                    (elem) => elem.email !== localStorage.getItem("mail")
                );
                console.log(reponse.data);

                setUsers(reponse.data);
            });
    }
    if (!isLoaded) {
        Promise.all([getRate(), handleNoterParticipants()]);
        setIsLoaded(true);
    }
    if (isLoaded) {
        return (
            <>
                <h1 className="titre">Notez les participants du trajet</h1>
                <form className="rating_form" onSubmit={handleSubmit}>
                    {users.map((user, index) => {
                        return (
                            <div key={index} className="user_stars">
                                {user.nom + " " + user.prenom}
                                <br />
                                {user.email == user.notifie ? (
                                    <>Conducteur</>
                                ) : (
                                    <>Passager</>
                                )}
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
                                                name={user.email}
                                                value={index1}
                                                onChange={handleChange}
                                                checked={
                                                    rate[user.email] == index1
                                                }
                                            />
                                        </div>
                                    );
                                })}
                                <button className="buttonsNav"
                                    onClick={(e) => handleDelete(e, user.email)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        );
                    })}
                    <button type="submit" className="formulaire_submit">
                        Valider
                    </button>
                </form>
            </>
        );
    }
}

export default RatingUser;
