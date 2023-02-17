import { useEffect, useState } from "react";
import "../styles/Signin.css"
import axios from "axios"


function Login() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get("http://localhost/PPIL/TravelTogether/backend/login.php").then((response) => {
            setItems(response.data)
            console.log(response.data)
        })
    },[])

    /*useEffect( () => {
        get("http://travel-together/")
        .then( (res) => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setItems(result.results);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    }, []);*/

    /*if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        )
    }*/

    return (
        <div>
            <div>{items.title}</div>
            <div>{items.recipe}</div> 
            <div>{items.author}</div>
        </div>       
    );
}

export default Login;