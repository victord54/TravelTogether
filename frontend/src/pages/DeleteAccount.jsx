import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {url_api} from "../data/url_api";
import "../styles/Login.css";
import {useAuth} from "../components/AuthProvider";

function DeleteAccount() {
    const initialValue = { mail: "", password: "" };
    const [formValues, setInputValues] = useState(initialValue);
    const [error, setError] = useState(null);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        deleteacc();
    }

    function handleChange(e) {
        setInputValues({ ...formValues, [e.target.name]: e.target.value });
    }

    async function deleteacc() {
        await axios
        .get(url_api.url + "/delete_account", {
            params: {
                mail: formValues["mail"],
                password: formValues["password"],
            },
        })
        .then(function (reponse) {
            if (reponse.data == null) {
                setError("Identifiant et/ou mot de passe incorrect.");
            } else {
                console.log("Reponse : " + reponse.data);
                setAuth(false);
                localStorage.clear();
                navigate("/");
            }
        })
        .catch(function (error) {
            console.log("Error :" + error);
        });
    }
  

    return (
    <div className="delete-account-box">
    <h1>Supprimer votre compte</h1>
    <p>Attention ! Cette action est irréversible.</p>
    <form onSubmit={handleSubmit}>
      <input
        type="mail"
        name="mail"
        placeholder="Email"
        value={formValues.mail}
        onChange={handleChange}
      ></input>
      <br />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        value={formValues.password}
        onChange={handleChange}
      ></input>
      <br />
      <p className="error">{error}</p>
      <button type="submit">Supprimer mon compte</button>
    </form>
  </div>
  );
}

export default DeleteAccount;
