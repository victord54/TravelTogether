import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import Logout from "../pages/Logout";
import Unknow from "../pages/Unknow";
import Banner from "./Banner";

function App() {
    return (
        <div>
            <Banner />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="*" element={<Unknow />} />
            </Routes>
        </div>
    );
}

export default App;
