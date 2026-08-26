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

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login(user);

      console.log("JWT Token:", response.data);

      // Save JWT Token
      const token = response.data;

      localStorage.setItem("token", token);

      // Decode JWT
      const decodedToken = jwtDecode(token);

      console.log("Decoded JWT:", decodedToken);

      // Get username and role from JWT
      const username = decodedToken.sub;
      const role = decodedToken.role;

      console.log("Username:", username);
      console.log("Role:", role);

      // Save user information
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      alert("Login Successful!");

      navigate("/");

    } catch (error) {
      console.error(error);

      alert("Invalid Username or Password!");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-brand">

          <div className="brand-logo">
            J
          </div>

          <h1>Welcome back.</h1>

          <p>
            Find your next opportunity and take the
            next step in your career.
          </p>

          <div className="login-points">

            <div>
              <span>✓</span>
              <p>Discover better job opportunities</p>
            </div>

            <div>
              <span>✓</span>
              <p>Connect with recruiters</p>
            </div>

            <div>
              <span>✓</span>
              <p>Build your professional profile</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="login-form-section">

          <h2>Sign in</h2>

          <p className="login-description">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit}>

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

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <div className="login-register">

            <span>Don't have an account?</span>

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