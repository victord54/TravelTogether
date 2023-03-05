import { Navigate } from "react-router-dom";
import {useAuth} from "../components/AuthProvider"

function Logout() {
    const { setAuth } = useAuth();
    localStorage.clear();
    setAuth(false);
    return <Navigate replace to="/" />;
}

export default Logout;
