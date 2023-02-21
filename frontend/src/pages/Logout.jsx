import { Navigate } from "react-router-dom";

function Logout() {
    localStorage.clear();
    sessionStorage.setItem("reload", "true")
    return <Navigate replace to="/" />;
}

export default Logout;
