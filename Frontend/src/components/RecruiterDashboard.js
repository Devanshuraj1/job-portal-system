import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <div className="recruiter-dashboard">

      {/* Sidebar */}
      <aside className="recruiter-sidebar">

        <div className="recruiter-logo">
          Job<span>Portal</span>
        </div>

        <div className="recruiter-profile">
          <div className="profile-avatar">
            {username ? username.charAt(0).toUpperCase() : "R"}
          </div>

          <div>
            <h3>{username || "Recruiter"}</h3>
            <p>Recruiter</p>
          </div>
        </div>

        <nav className="recruiter-nav">

          <button
            className="nav-item active"
            onClick={() => navigate("/recruiter-dashboard")}
          >
            🏠 Dashboard
          </button>

          
        <button
          className="nav-item"
          onClick={() => navigate("/create")}
        >
            ➕ Post Job
        </button>

          <button
            className="nav-item"
            onClick={() => navigate("/my-jobs")}
          >
            💼 My Jobs
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/applications")}
          >
            📄 Applications
          </button>

        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>

      </aside>


      {/* Main Content */}
      <main className="recruiter-main">

        {/* Header */}
        <header className="recruiter-header">

          <div>
            <h1>Recruiter Dashboard</h1>
            <p>Manage your jobs and applications</p>
          </div>

          <button
            className="post-job-header-btn"
            onClick={() => navigate("/post-job")}
          >
            + Post New Job
          </button>

        </header>


        {/* Welcome */}
        <section className="welcome-section">

          <div>
            <h2>
              Welcome back, {username || "Recruiter"} 👋
            </h2>

            <p>
              Find the right candidates and manage your job postings.
            </p>
          </div>

        </section>


        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">💼</div>

            <div>
              <p>Total Jobs</p>
              <h2>0</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">🟢</div>

            <div>
              <p>Active Jobs</p>
              <h2>0</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">📄</div>

            <div>
              <p>Applications</p>
              <h2>0</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">👥</div>

            <div>
              <p>Applicants</p>
              <h2>0</h2>
            </div>
          </div>

        </section>


        {/* Quick Actions */}
        <section className="dashboard-section">

          <div className="section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your recruitment activities</p>
            </div>
          </div>


          <div className="quick-actions">

            <div
              className="action-card"
              onClick={() => navigate("/create")}
            >
              <div className="action-icon">➕</div>

              <h3>Post a Job</h3>

              <p>
                Create a new job posting and find qualified candidates.
              </p>

              <span>Post Job →</span>
            </div>


            <div
              className="action-card"
              onClick={() => navigate("/my-jobs")}
            >
              <div className="action-icon">💼</div>

              <h3>Manage Jobs</h3>

              <p>
                View, edit and delete your existing job postings.
              </p>

              <span>View Jobs →</span>
            </div>


            <div
              className="action-card"
              onClick={() => navigate("/applications")}
            >
              <div className="action-icon">📄</div>

              <h3>Applications</h3>

              <p>
                Review applications submitted by job seekers.
              </p>

              <span>View Applications →</span>
            </div>

          </div>

        </section>
      </main>

    </div>
  );
};

export default RecruiterDashboard;