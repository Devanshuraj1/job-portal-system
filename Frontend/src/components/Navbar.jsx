import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login");
  };


  return (

    <nav className="navbar">

      <div className="navbar-container">


        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="navbar-logo"
        >

          <span className="logo-icon">
            J
          </span>

          <span>
            JobPortal
          </span>

        </Link>


        {/* =========================
            NAVIGATION
        ========================= */}

        <div className="navbar-links">


          {/* =========================
              HOME
          ========================= */}

          <Link
            to="/"
            className="nav-link"
          >
            Home
          </Link>


          {/* =========================
              LOGGED IN OPTIONS
          ========================= */}

          {token && (

            <>

              {/* =========================
                  USER DASHBOARD
              ========================= */}

              {role === "USER" && (

                <Link
                  to="/dashboard"
                  className="nav-link dashboard-nav-link"
                >
                  📋 My Applications
                </Link>

              )}


              {/* =========================
                  RECRUITER DASHBOARD
              ========================= */}

              {role === "RECRUITER" && (

                <Link
                  to="/recruiter-dashboard"
                  className="nav-link dashboard-nav-link"
                >
                  💼 Recruiter Dashboard
                </Link>

              )}


              {/* =========================
                  POST JOB
                  RECRUITER + ADMIN
              ========================= */}

              {(role === "RECRUITER" ||
                role === "ADMIN") && (

                <Link
                  to="/create"
                  className="nav-link"
                >
                  Post a Job
                </Link>

              )}


              {/* =========================
                  ADMIN DASHBOARD
              ========================= */}

              {role === "ADMIN" && (

                <Link
                  to="/admin"
                  className="nav-link"
                >
                  🛡️ Admin Dashboard
                </Link>

              )}

            </>

          )}


          {/* =========================
              NOT LOGGED IN
          ========================= */}

          {!token ? (

            <>

              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>

            </>

          ) : (

            /* =========================
               USER PROFILE + LOGOUT
            ========================= */

            <>

              {username && (

                <div className="user-profile">

                  <div className="user-avatar">
                    {username.charAt(0).toUpperCase()}
                  </div>

                  <div className="user-info">

                    <span className="user-greeting">
                      Hi, {username}
                    </span>

                    <span className="user-role">
                      {role}
                    </span>

                  </div>

                </div>

              )}


              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>

          )}


          {/* =========================
              CONTACT
          ========================= */}

          <a
            href="https://telusko.com/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Contact
          </a>


        </div>

      </div>

    </nav>
  );
};

export default Navbar;