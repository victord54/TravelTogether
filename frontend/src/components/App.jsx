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
import ModifProfil from "../pages/ModifProfil";
import Unknow from "../pages/Unknow";
import Create_offer from "../pages/Create-offer";
import Create_group from "../pages/Create-group";
import Groupe from "../pages/Groupe";
import Friends_groupe_list from "../pages/Friends-group-list";
import Delete_group from "../pages/Delete-group";
import Search_offer from "../pages/Search-offer";


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
                <Route path="/modif-profile" element={<PrivateRoute><ModifProfil /></PrivateRoute>} />
                <Route path="/create-offer" element={<PrivateRoute><Create_offer /></PrivateRoute>} />
                <Route path="/search-offer" element={<PrivateRoute><Search_offer /></PrivateRoute>}/>
                <Route path="/create-group" element={<PrivateRoute><Create_group /></PrivateRoute>} />
                <Route path="/delete-group/:id"  element={<PrivateRoute><Delete_group/></PrivateRoute>}/>
                <Route path="/friends-group-list" element={<PrivateRoute><Friends_groupe_list /></PrivateRoute>} />
                <Route path="groupe/:id" element={<PrivateRoute><Groupe /></PrivateRoute>} />
                <Route path="*" element={<Unknow />} />
            </Routes>
        </div>
    );
}

export default App;
