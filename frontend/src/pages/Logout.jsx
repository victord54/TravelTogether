import { Navigate } from "react-router-dom"

function Logout(){
    localStorage.clear()
    return <Navigate replace to="/" />
}

export default Logout;
