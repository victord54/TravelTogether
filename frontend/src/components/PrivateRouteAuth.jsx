import {Navigate} from 'react-router-dom';
import {useAuth} from "../components/AuthProvider"


export { PrivateRouteAuth };

function PrivateRouteAuth({ children }) {
    const { auth } = useAuth();
    console.log(auth)
    
    if (auth) {
        console.log("test")
        return <Navigate to="/"  />
    } 

    // authorized so return child components
    return children;
}