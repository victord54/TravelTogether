import { Routes, Route } from "react-router-dom";
import {useAuth} from "../components/AuthProvider"
import Banner from "./Banner";
import NotAuthBanner from "./NotAuthBanner";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import Logout from "../pages/Logout";
import Profil from "../pages/Profil";
import Unknow from "../pages/Unknow";
import Create_offer from "../pages/Create-offer";

function App() {
    const { auth } = useAuth();
    console.log(auth)
    return (
        <div>
            {auth ? <Banner /> : <NotAuthBanner />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile" element={<Profil />} />
                <Route path="/create-offer" element={<Create_offer />} />
                <Route path="*" element={<Unknow />} />
            </Routes>
        </div>
    );
}

export default App;
