import {Navigate} from "react-router-dom";
import {useAuth} from "../components/AuthProvider"
import {useEffect} from "react";

function Logout() {
    const { setAuth } = useAuth();
    localStorage.clear();
    useEffect(() => {
        setAuth(false)
    });
    return <Navigate replace to="/" />;
}

export default Logout;
