import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
  };


  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage("");

    try {

      setLoading(true);

      const response = await login(user);

      console.log("JWT Token:", response.data);


      // =========================
      // SAVE TOKEN
      // =========================

      const token = response.data;

      localStorage.setItem(
        "token",
        token
      );


      // =========================
      // DECODE JWT
      // =========================

      const decodedToken = jwtDecode(token);

      console.log(
        "Decoded JWT:",
        decodedToken
      );


      // =========================
      // GET USER INFO
      // =========================

      const username =
        decodedToken.sub;

      const role =
        decodedToken.role;


      console.log(
        "Username:",
        username
      );

      console.log(
        "Role:",
        role
      );


      // =========================
      // SAVE USER INFO
      // =========================

      localStorage.setItem(
        "username",
        username
      );

      localStorage.setItem(
        "role",
        role
      );


      // =========================
      // SUCCESS
      // =========================

      navigate("/");


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );


      // =========================
      // GET BACKEND MESSAGE
      // =========================

      const backendMessage =
        error?.response?.data;


      if (
        typeof backendMessage === "string" &&
        backendMessage.toLowerCase().includes("pending")
      ) {

        setErrorMessage(
          "Your recruiter account is waiting for admin approval."
        );

      }

      else if (
        typeof backendMessage === "string" &&
        backendMessage.toLowerCase().includes("rejected")
      ) {

        setErrorMessage(
          "Your recruiter account has been rejected."
        );

      }

      else {

        setErrorMessage(
          "Invalid username or password."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">

      <div className="login-card">


        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="login-brand">

          <div className="brand-logo">
            J
          </div>

          <h1>
            Welcome back.
          </h1>

          <p>
            Find your next opportunity and take
            the next step in your career.
          </p>


          <div className="login-points">

            <div>
              <span>✓</span>

              <p>
                Discover better job opportunities
              </p>
            </div>


            <div>
              <span>✓</span>

              <p>
                Connect with recruiters
              </p>
            </div>


            <div>
              <span>✓</span>

              <p>
                Build your professional profile
              </p>
            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="login-form-section">

          <h2>
            Sign in
          </h2>

          <p className="login-description">
            Enter your credentials to access your account.
          </p>


          {/* =========================
              ERROR MESSAGE
          ========================= */}

          {errorMessage && (

            <div className="login-error">

              {errorMessage}

            </div>

          )}


          <form onSubmit={handleSubmit}>


            {/* USERNAME */}

            <div className="login-field">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={user.username}
                onChange={handleChange}
                required
              />

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign in"}

            </button>

          </form>


          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;