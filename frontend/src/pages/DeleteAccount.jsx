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
        let formData = new FormData();
        formData.append("mail", formValues["mail"]);
        formData.append("password", formValues["password"]);
        formData.append("delete", 1);
        await axios
        .post(url_api.url + "/delete_account", formData)
        .then(function (reponse) {
            if (reponse.data == null) {
                setError("Identifiant et/ou mot de passe incorrect.");
            } else {
                console.log("Reponse : " + reponse.data);
                if(reponse.data === 1) {
                    setAuth(false);
                    localStorage.clear();
                    navigate("/");
                }
            }
        })
        .catch(function (error) {
            console.log("Error :" + error);
        });
    }
  

    return (
    <div className="form--connexion-box">
    <h1 className="bienvenue">Supprimer votre compte</h1>
    <p>Attention ! Cette action est irréversible.</p>
    <form onSubmit={handleSubmit}>
      <input
        type="mail"
        name="mail"
        className="input-connexion"
        placeholder="Email"
        value={formValues.mail}
        onChange={handleChange}
      ></input>
      <br />
      <input
        type="password"
        name="password"
        className="input-connexion"
        placeholder="Mot de passe"
        value={formValues.password}
        onChange={handleChange}
      ></input>
      <br />
      <div className="button-wrap">
      <button type="submit" className="button-connexion">Supprimer mon compte</button>
      </div>
    </form>
  </div>
  );
}

export default DeleteAccount;
