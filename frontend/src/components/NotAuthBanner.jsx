import "../styles/NotAuthBanner.css";
import logo from "../assets/travelTogether.png";
import { Link } from "react-router-dom";

function Banner() {
    return (
        <header>
            <nav className="navigation-not-auth">
                <Link to="/">
                    <img src={logo} alt="logo" />
                </Link>
                <div className="navigation-menu-not-auth">
                    <ul>
                        <li><Link to="signin">Inscription</Link></li>
                        <li><Link to="login">Connexion</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Banner;
