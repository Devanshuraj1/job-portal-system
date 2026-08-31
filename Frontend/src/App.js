import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AllPosts from "./components/AllPosts";
import Create from "./components/Create";
import Edit from "./components/Edit";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import JobDetails from "./components/JobDetails";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<AllPosts />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* JOB DETAILS */}

        <Route
          path="/job/:id"
          element={<JobDetails />}
        />

        {/* CREATE JOB */}

        <Route
          path="/create"
          element={
            <ProtectedRoute
              allowedRoles={[
                "RECRUITER",
                "ADMIN"
              ]}
            >
              <Create />
            </ProtectedRoute>
          }
        />

        {/* EDIT JOB */}

        <Route
          path="/edit"
          element={
            <ProtectedRoute
              allowedRoles={[
                "RECRUITER",
                "ADMIN"
              ]}
            >
              <Edit />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;