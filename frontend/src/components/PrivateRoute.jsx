import { Navigate } from 'react-router-dom';
import {useAuth} from "../components/AuthProvider"


export { PrivateRoute };

function PrivateRoute({ children }) {
    const { auth } = useAuth();
    console.log(auth)
    
    if (!auth) {
        // not logged in so redirect to login page with the return url
        console.log("test")
        return <Navigate to="/"  />
    } 

    // authorized so return child components
    return children;
}