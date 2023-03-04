import axios from "axios";
import { React, useState } from "react";
import Notif from "../components/Notif";
import { url_api } from "../data/url_api";

function Notifications() {
    const [data, setData] = useState([]);
    const [isGetData, setIsGetData] = useState(false);
    const [isData, setIsData] = useState(false);
    function getNotifs(id) {
        axios
            .get(url_api.url + "/notifications", {
                params: {
                    mail: id,
                },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data !== "false") {
                    setIsData(true);
                    setData(response.data);
                }
            });
    }
    if (!isGetData) {
        getNotifs("dallevictor@gmail.com");
        setIsGetData(true);
    } else {
        if (isData) {
            return data.map((tuple) => (
                <Notif
                    idNotif={tuple.idfNotification}
                    type="No sé"
                    date="Oui"
                    message={tuple.informations}
                />
            ));
        } else {
            return <div>Il n'y a pas de notifications pour le moment</div>;
        }
    }
}

export default Notifications;
