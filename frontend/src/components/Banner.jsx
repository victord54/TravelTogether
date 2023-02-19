import "../styles/Banner.css"
import logo from "../assets/travelTogether.png"
import { Link } from "react-router-dom";

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
                    <Link to="logout">Déconnexion</Link>
                </ul>
            </nav>
            <div className="search-bar">
                <div>From</div>
                <div>To</div>
                <div>Date</div>
                <div>Heure</div>
                <div>Passagers</div>
                <button>Valider</button>
            </div>
        </header>
    );
}

export default Banner;