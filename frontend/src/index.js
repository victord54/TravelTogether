import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router} from "react-router-dom";
import App from "./components/App";
import "./styles/index.css";
import AuthProvider from "./components/AuthProvider";
import CarProvider from "./components/CarProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <AuthProvider>
            <CarProvider>
                 <App />
            </CarProvider>
        </AuthProvider>
    </Router>
);
