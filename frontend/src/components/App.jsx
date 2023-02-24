import { Routes, Route } from "react-router-dom";
import {useAuth} from "../components/AuthProvider"
import { PrivateRoute } from "./PrivateRoute";
import { PrivateRouteAuth} from "./PrivateRouteAuth";
import Banner from "./Banner";
import NotAuthBanner from "./NotAuthBanner";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import Logout from "../pages/Logout";
import Profil from "../pages/Profil";
import Unknow from "../pages/Unknow";
import Create_offer from "../pages/Create-offer";
import Create_group from "../pages/Create_group";
import Friends_groupe_list from "../pages/Friends-groupe-list";

function App() {
    const { auth } = useAuth();
    return (
        <div>
            {auth ? <Banner /> : <NotAuthBanner />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<PrivateRouteAuth><Signin /></PrivateRouteAuth>} />
                <Route path="/login" element={<PrivateRouteAuth><Login /></PrivateRouteAuth>} />
                <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profil /></PrivateRoute>} />
                <Route path="/create-offer" element={<PrivateRoute><Create_offer /></PrivateRoute>} />
                <Route path="/create_group" element={<PrivateRoute><Create_group /></PrivateRoute>} />
                <Route path="/friends-groupe-list" element={<Friends_groupe_list />} />
                <Route path="*" element={<Unknow />} />
            </Routes>
        </div>
    );
}

export default App;
