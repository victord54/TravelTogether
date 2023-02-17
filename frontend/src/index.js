import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./styles/index.css";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Login from "./pages/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <Route path="/">
                <Home />
            </Route>
        </Router>
    </React.StrictMode>
);
