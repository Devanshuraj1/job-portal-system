import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AllPosts from "./components/AllPosts";
import Login from "./components/Login";
import Register from "./components/Register";
import JobDetails from "./components/JobDetails";
import Edit from "./components/Edit";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import Applicants from "./components/Applicants";
import Create from "./components/Create";
import MyJobs from "./components/MyJobs";

function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    HOME / JOB LIST
                ========================= */}

                <Route
                    path="/"
                    element={<AllPosts />}
                />


                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* =========================
                    REGISTER
                ========================= */}

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    JOB DETAILS
                ========================= */}

                <Route
                    path="/job/:id"
                    element={<JobDetails />}
                />


                {/*
                    CREATE JOB
                    RECRUITER + ADMIN
                */}

                <Route
                    path="/create"
                    element={<Create />}
                />


                {/* =========================
                    EDIT JOB
                ========================= */}

                <Route
                    path="/edit"
                    element={<Edit />}
                />


                {/* =========================
                    USER DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={<UserDashboard />}
                />


                {/* =========================
                    RECRUITER DASHBOARD
                ========================= */}

                <Route
                    path="/recruiter-dashboard"
                    element={<RecruiterDashboard />}
                />

                <Route
                   path="/applications"
                   element={<Applicants />}
                />

                <Route
                    path="/my-jobs"
                    element={<MyJobs />}
                />


                {/* =========================
                    ADMIN DASHBOARD
                ========================= */}

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;