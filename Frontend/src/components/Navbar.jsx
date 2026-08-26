import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">J</span>
          <span>JobPortal</span>
        </Link>

        {/* Navigation */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {token && (
            <Link to="/create" className="nav-link">
              Post a Job
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          ) : (
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

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