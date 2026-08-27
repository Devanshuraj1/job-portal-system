import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setUser({
      ...user,
      role: role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await register(user);

      console.log("Registration Response:", response.data);

      alert("Registration Successful!");

      setUser({
        username: "",
        password: "",
        role: "USER",
      });

      navigate("/login");

    } catch (error) {
      console.error("Registration Error:", error);

      if (error.response) {
        if (typeof error.response.data === "string") {
          alert(error.response.data);
        } else {
          alert("Registration Failed!");
        }
      } else {
        alert("Registration Failed!");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* LEFT SIDE */}
        <div className="register-brand">

          <div className="register-logo">
            J
          </div>

          <h1>Start your journey.</h1>

          <p>
            Create your account and discover new
            opportunities for your career.
          </p>

          <div className="register-points">

            <div>
              <span>✓</span>
              <p>Explore exciting job opportunities</p>
            </div>

            <div>
              <span>✓</span>
              <p>Build your professional presence</p>
            </div>

            <div>
              <span>✓</span>
              <p>Connect with recruiters</p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="register-form-section">

          <h2>Create account</h2>

          <p className="register-description">
            Create your account to get started.
          </p>

          <form onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="register-field">

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
            <div className="register-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={user.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* =========================
                ACCOUNT TYPE
            ========================= */}

            <div className="register-field">

              <label>
                Account Type
              </label>

              <div className="role-selection">

                {/* JOB SEEKER */}

                <button
                  type="button"
                  className={`role-card ${
                    user.role === "USER"
                      ? "role-card-active"
                      : ""
                  }`}
                  onClick={() =>
                    handleRoleChange("USER")
                  }
                >

                  <div className="role-icon">
                    👤
                  </div>

                  <div className="role-content">

                    <strong>
                      Job Seeker
                    </strong>

                    <span>
                      Find jobs & apply
                    </span>

                  </div>

                  <div className="role-check">
                    {user.role === "USER" ? "✓" : ""}
                  </div>

                </button>


                {/* RECRUITER */}

                <button
                  type="button"
                  className={`role-card ${
                    user.role === "RECRUITER"
                      ? "role-card-active"
                      : ""
                  }`}
                  onClick={() =>
                    handleRoleChange("RECRUITER")
                  }
                >

                  <div className="role-icon">
                    💼
                  </div>

                  <div className="role-content">

                    <strong>
                      Recruiter
                    </strong>

                    <span>
                      Post jobs & hire
                    </span>

                  </div>

                  <div className="role-check">
                    {user.role === "RECRUITER" ? "✓" : ""}
                  </div>

                </button>

              </div>

              {/* RECRUITER NOTE */}

              {user.role === "RECRUITER" && (

                <p className="recruiter-note">
                  Recruiter accounts require admin approval
                  before you can post jobs.
                </p>

              )}

            </div>


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>


          {/* LOGIN LINK */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;