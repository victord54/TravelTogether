import { useEffect, useState } from "react";
import "../styles/Signin.css"

function Login() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect( () => {
        fetch("http://travel-together/")
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
    }, []);

    if (error) {
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
    }
}

export default Login;