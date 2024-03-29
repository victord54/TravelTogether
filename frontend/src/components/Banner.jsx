import "../styles/Banner.css";
import logo from "../assets/travelTogether.png";
import { Link } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { useCar } from "../components/CarProvider";
import { url_api } from "../data/url_api";
import axios from "axios";

function Banner() {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const { car } = useCar();
    const [nbNewNotif, setNbNewNotif] = useState(null);

    checkForNewNotifications();

    async function checkForNewNotifications() {
        await axios
            .get(url_api.url + "/check_notifications", {
                params: {
                    notifie: localStorage.getItem("mail"),
                },
            })
            .then(function (reponse) {
                setNbNewNotif(reponse.data.length);
            });
    }

    useEffect(() => {
        const intervalId = setInterval(checkForNewNotifications, 1 * 5 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header>
            <nav className="navigation">
                <Link to="/">
                    <img src={logo} alt="logo" width="60px" />
                </Link>

                <button
                    className="hamburger"
                    onClick={() => {
                        setIsNavExpanded(!isNavExpanded);
                    }}
                >
                    {/* icon from heroicons.com */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="white"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                <div
                    className={
                        isNavExpanded
                            ? "navigation-menu expanded"
                            : "navigation-menu"
                    }
                >
                    <ul>
                        {
                            localStorage.getItem("estAdmin") === "1" ? (
                                <li>
                                <Link
                                    to="admin-page"
                                    onClick={() => setIsNavExpanded(false)}
                                >
                                    Pannel administrateur
                                </Link>
                            </li>
                            ) : (<></>)
                        }
                        {car ? (
                            <li>
                                <Link
                                    to="create-offer"
                                    onClick={() => setIsNavExpanded(false)}
                                >
                                    Créer une offre
                                </Link>
                            </li>
                        ) : (
                            <></>
                        )}
                        <li>
                            <Link
                                to="search-offer"
                                onClick={() => setIsNavExpanded(false)}
                            >
                                Rechercher une offre
                            </Link>
                        </li>
                        {nbNewNotif === 0 ? (
                            <li>
                                <Link
                                    to="notifications"
                                    onClick={() => setIsNavExpanded(false)}
                                >
                                    Notifications
                                </Link>
                            </li>
                        ) : (
                            <li className="new_notifs">
                                <Link
                                    to="notifications"
                                    onClick={() => setIsNavExpanded(false)}
                                >
                                    Notifications {"(" + nbNewNotif + ")"}
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                to="profile"
                                onClick={() => setIsNavExpanded(false)}
                            >
                                Mon profil
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="logout"
                                onClick={() => setIsNavExpanded(false)}
                            >
                                Déconnexion
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Banner;
