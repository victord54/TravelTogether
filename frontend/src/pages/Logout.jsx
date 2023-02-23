import { Navigate } from "react-router-dom";
import {useAuth} from "../components/AuthProvider"

function Logout() {
    localStorage.clear();
    const { setAuth } = useAuth();
    setAuth(false);
    return <Navigate replace to="/" />;
}

export default Logout;
