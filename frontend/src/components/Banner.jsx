import "../styles/Banner.css"
import logo from "../assets/travelTogether.png"
import { Link } from "react-router-dom";
import Signin from "../pages/Signin";

function Banner() {
    return (
        <header>
            <nav>
                <Link to="/">
                    <img src={logo} alt="logo"/>
                </Link>
                <ul>
                    <Link to="create-offer">Créer une offre</Link>
                    <Link to="search-offer">Rechercher une offre</Link>
                    <Link to="notifications">Notifications</Link>
                    <Link to="profile">Profil</Link>
                    <Link to="signin">Inscription</Link>
                    <Link to="login">Connexion</Link>
                </ul>
            </nav>
            <div className="search-bar">Barre de recherche</div>
        </header>
    );
}

export default Banner;