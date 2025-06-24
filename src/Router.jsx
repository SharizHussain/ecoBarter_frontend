import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
// import Home from "../pages/Home";
import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home";
import Register from "./Pages/Register/Register.jsx";
import Discover from "./Pages/Discover.jsx";
import Upload from "./Pages/Upload.jsx";
import AcceptedRequests from "./Pages/AcceptedRequests.jsx";
import ExtendPost from "./Pages/ExtendPost.jsx";

function Router() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/acceptedRequests" element={<AcceptedRequests/>} />
                <Route path="/mapview/:id" element={<ExtendPost />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
