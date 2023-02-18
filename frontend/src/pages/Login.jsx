import { useEffect, useState } from "react";
import axios from "axios"


function Login() {
    const initialValue = {mail:"", password:""}
    const [formValues, setInputValues] = useState(initialValue)
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    function handleSubmit(e){
        e.preventDefault();
    }

    function handleChange(e){
        setInputValues({ ...formValues, [e.target.name] : e.target.value})
    }

    /*useEffect(() => {
        axios.get("http://localhost/PPIL/TravelTogether/backend/login.php").then((response) => {
            setItems(response.data)
        })
    },[])*/

    return (
        <div>
            <div>
                <h1>S'identifier : </h1>
                <form onSubmit={handleSubmit}>
                    <div>Adresse mail :</div>
                    <input 
                        type="text" 
                        name="mail"
                        value={formValues.mail}
                        onChange={handleChange}>
                    </input>

                    <div>Mot de passe :</div>
                    <input 
                        type="password" 
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}>
                    </input>
                    <br/><br/>
                    <div><button type='submit'>Se connecter</button></div>

                </form>
            </div>
        </div>       
    );
}

export default Login;