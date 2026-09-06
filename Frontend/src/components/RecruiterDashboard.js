import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./RecruiterDashboard.css";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        applications: 0,
        applicants: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const jobsResponse = await api.get("/jobPosts/my");
            const jobs = Array.isArray(jobsResponse.data)
                ? jobsResponse.data
                : [];

            if (jobs.length === 0) {
                setStats({
                    totalJobs: 0,
                    activeJobs: 0,
                    applications: 0,
                    applicants: 0,
                });
                return;
            }

            const applicationResponses = await Promise.all(
                jobs.map((job) =>
                    api.get(`/applications/job/${job.postId}`)
                )
            );

            const applications = applicationResponses.flatMap((response) =>
                Array.isArray(response.data) ? response.data : []
            );

            const uniqueApplicants = new Set(
                applications
                    .map((application) => application.username)
                    .filter(Boolean)
            );

            // The current JobPost model has no active/inactive field,
            // so every existing recruiter job is currently considered active.
            setStats({
                totalJobs: jobs.length,
                activeJobs: jobs.length,
                applications: applications.length,
                applicants: uniqueApplicants.size,
            });
        } catch (err) {
            console.error("Dashboard load error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    err.response.data ||
                    "Your recruiter account is not approved yet."
                );
                return;
            }

            setError("Unable to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    return (
        <div className="recruiter-dashboard">
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

            <main className="recruiter-main">
                <header className="recruiter-header">
                    <div>
                        <h1>Recruiter Dashboard</h1>
                        <p>Manage your jobs and applications</p>
                    </div>

                    <button
                        className="post-job-header-btn"
                        onClick={() => navigate("/create")}
                    >
                        + Post New Job
                    </button>
                </header>

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

                {error && (
                    <div className="dashboard-error">
                        ⚠ {error}
                        <button onClick={loadDashboard}>Retry</button>
                    </div>
                )}

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">💼</div>
                        <div>
                            <p>Total Jobs</p>
                            <h2>{loading ? "..." : stats.totalJobs}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🟢</div>
                        <div>
                            <p>Active Jobs</p>
                            <h2>{loading ? "..." : stats.activeJobs}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📄</div>
                        <div>
                            <p>Applications</p>
                            <h2>{loading ? "..." : stats.applications}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div>
                            <p>Applicants</p>
                            <h2>{loading ? "..." : stats.applicants}</h2>
                        </div>
                    </div>
                </section>

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
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && navigate("/create")}
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
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && navigate("/my-jobs")}
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
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && navigate("/applications")}
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
