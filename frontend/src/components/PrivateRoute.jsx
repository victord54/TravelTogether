import { Navigate } from 'react-router-dom';
import {useAuth} from "../components/AuthProvider"


export { PrivateRoute };

function PrivateRoute({ children }) {
    const { auth } = useAuth();
    
    if (!auth) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/"  />
    } 

    // authorized so return child components
    return children;
}