import { Route, Routes } from "react-router-dom";
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
import AddMember_group from "../pages/AddMember-group";
import DeleteMember_group from "../pages/DeleteMember-group";
import SearchOffer from "../pages/SearchOffer";
import Notifications from "../pages/Notifications";
import SeeOffer from "../pages/SeeOffer";
import ModifyOffer from "../pages/ModifyOffer";
import DeleteOffer from "../pages/DeleteOffer"
import ModifGroup from "../pages/ModifGroup";
import RatingUser from "../pages/RatingUser";
import RecupCompte from "../pages/RecupCompte";
import AdminPage from "../pages/AdminPage";
import DeleteAccount from "../pages/DeleteAccount";
import AdminDeleteUser from "../pages/AdminDeleteUser";
import AdminSeeOffers from "../pages/AdminSeeOffers";

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
                    path="/deletemember-group/:id"
                    element={
                        <PrivateRoute>
                            <DeleteMember_group />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/addmember-group/:id"
                    element={
                        <PrivateRoute>
                            <AddMember_group />
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
                <Route
                    path="offre/:id"
                    element={
                        <PrivateRoute>
                            <SeeOffer />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="modif-group/:id"
                    element={
                        <PrivateRoute>
                            <ModifGroup />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="modify-offer/:id"
                    element={
                        <PrivateRoute>
                            <ModifyOffer />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="delete-offer/:id"
                    element={
                        <PrivateRoute>
                            <DeleteOffer />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="rating-user/:id"
                    element={
                        <PrivateRoute>
                            <RatingUser />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/recupcompte"
                    element={
                            <RecupCompte />
                    }
                />
                <Route path="*" element={<Unknow />} />
                <Route
                    path="/admin-page"
                    element={
                        <PrivateRoute>
                            <AdminPage />
                        </PrivateRoute>
                    }
                />
                <Route 
                    path="/delete-user/:id"
                    element={
                        <PrivateRoute>
                            <AdminDeleteUser />
                        </PrivateRoute>
                    }
                />
                <Route 
                    path="/admin-see-offers/:id"
                    element={
                        <PrivateRoute>
                            <AdminSeeOffers />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
