import { Routes, Route } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { PrivateRoute } from "./PrivateRoute";
import { PrivateRouteAuth } from "./PrivateRouteAuth";
import Banner from "./Banner";
import NotAuthBanner from "./NotAuthBanner";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import Logout from "../pages/Logout";
import Profil from "../pages/Profil";
import ModifProfil from "../pages/ModifProfil";
import Unknow from "../pages/Unknow";
import CreateOffer from "../pages/CreateOffer";
import CreateGroup from "../pages/CreateGroup";
import Groupe from "../pages/Groupe";
import FriendsGroupList from "../pages/FriendsGroupList";
import DeleteGroup from "../pages/DeleteGroup";
import SearchOffer from "../pages/SearchOffer";
import Notifications from "../pages/Notifications";
import CarProvider from "./CarProvider";

function App() {
    const { auth } = useAuth();
    return (
        <div>
            {auth ? <Banner /> : <NotAuthBanner />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/signin"
                    element={
                        <PrivateRouteAuth>
                            <Signin />
                        </PrivateRouteAuth>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PrivateRouteAuth>
                            <Login />
                        </PrivateRouteAuth>
                    }
                />
                <Route
                    path="/logout"
                    element={
                        <PrivateRoute>
                            <Logout />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profil />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/modif-profile"
                    element={
                        <PrivateRoute>
                            <ModifProfil />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-offer"
                    element={
                        <PrivateRoute>
                            <CreateOffer />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/search-offer"
                    element={
                        <PrivateRoute>
                            <SearchOffer />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-group"
                    element={
                        <PrivateRoute>
                            <CreateGroup />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/delete-group/:id"
                    element={
                        <PrivateRoute>
                            <DeleteGroup />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/friends-group-list"
                    element={
                        <PrivateRoute>
                            <FriendsGroupList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="groupe/:id"
                    element={
                        <PrivateRoute>
                            <Groupe />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="notifications"
                    element={
                        <PrivateRoute>
                            <Notifications />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Unknow />} />
            </Routes>
        </div>
    );
}

export default App;
