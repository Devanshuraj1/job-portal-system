import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./UserDashboard.css";

function UserDashboard() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET MY APPLICATIONS
    // =====================================================

    useEffect(() => {

        const fetchApplications = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/applications/my");

                console.log(
                    "MY APPLICATIONS:",
                    response.data
                );

                setApplications(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (err) {

                console.error(
                    "MY APPLICATIONS ERROR:",
                    err
                );

                if (err.response?.status === 401) {

                    setError(
                        "Session expired. Please login again."
                    );

                } else if (err.response?.status === 403) {

                    setError(
                        "You are not authorized to view applications."
                    );

                } else {

                    setError(
                        "Unable to load your applications."
                    );
                }

            } finally {

                setLoading(false);
            }
        };

        fetchApplications();

    }, []);


    // =====================================================
    // STATUS FORMAT
    // =====================================================

    const formatStatus = (status) => {

        if (!status) {
            return "Applied";
        }

        return status
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, letter =>
                letter.toUpperCase()
            );
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "SHORTLISTED":
                return "status-shortlisted";

            case "REJECTED":
                return "status-rejected";

            case "HIRED":
                return "status-hired";

            case "APPLIED":
            default:
                return "status-applied";
        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        try {

            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch {

            return date;
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your applications...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-container">

                    <div className="dashboard-error">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Something went wrong
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login Again
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="dashboard-page">

            <div className="dashboard-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="dashboard-header">

                    <div>

                        <p className="dashboard-label">
                            USER DASHBOARD
                        </p>

                        <h1>
                            My Applications
                        </h1>

                        <p className="dashboard-subtitle">
                            Track all the jobs you have applied for.
                        </p>

                    </div>


                    <button
                        className="browse-jobs-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Browse Jobs
                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="application-summary">


                    {/* TOTAL */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            📄
                        </div>

                        <div>

                            <span>
                                Total Applications
                            </span>

                            <strong>
                                {applications.length}
                            </strong>

                        </div>

                    </div>


                    {/* APPLIED */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            🟡
                        </div>

                        <div>

                            <span>
                                Applied
                            </span>

                            <strong>

                                {
                                    applications.filter(
                                        application =>
                                            !application.status ||
                                            application.status ===
                                                "APPLIED"
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


                    {/* SHORTLISTED */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            🟢
                        </div>

                        <div>

                            <span>
                                Shortlisted
                            </span>

                            <strong>

                                {
                                    applications.filter(
                                        application =>
                                            application.status ===
                                                "SHORTLISTED"
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


                    {/* HIRED */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            🎉
                        </div>

                        <div>

                            <span>
                                Hired
                            </span>

                            <strong>

                                {
                                    applications.filter(
                                        application =>
                                            application.status ===
                                                "HIRED"
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>


                    {/* REJECTED */}

                    <div className="summary-card">

                        <div className="summary-icon">
                            🔴
                        </div>

                        <div>

                            <span>
                                Rejected
                            </span>

                            <strong>

                                {
                                    applications.filter(
                                        application =>
                                            application.status ===
                                                "REJECTED"
                                    ).length
                                }

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    APPLICATIONS
                ================================================= */}

                <div className="applications-section">

                    <div className="section-header">

                        <h2>
                            My Applications
                        </h2>

                        <span>
                            {applications.length} application
                            {applications.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    {/* EMPTY */}

                    {applications.length === 0 ? (

                        <div className="empty-applications">

                            <div className="empty-icon">
                                📋
                            </div>

                            <h3>
                                No applications yet
                            </h3>

                            <p>
                                You haven't applied for any jobs yet.
                                Start exploring available opportunities.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                Find Jobs
                            </button>

                        </div>

                    ) : (

                        <div className="applications-list">

                            {applications.map(
                                (application) => (

                                    <div
                                        className="application-card"
                                        key={application.id}
                                    >


                                        {/* JOB ICON */}

                                        <div className="application-job-icon">

                                            {application.jobTitle
                                                ? application.jobTitle
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "J"}

                                        </div>


                                        {/* JOB DETAILS */}

                                        <div className="application-details">

                                            <h3>

                                                {application.jobTitle ||
                                                    `Job #${application.jobId}`}

                                            </h3>

                                            <p>

                                                {application.companyName ||
                                                    "Company not specified"}

                                            </p>


                                            <div className="application-meta">

                                                <span>
                                                    🆔 Job #{application.jobId}
                                                </span>

                                                <span>
                                                    📅 Applied{" "}
                                                    {formatDate(
                                                        application.appliedAt
                                                    )}
                                                </span>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <div className="application-status">

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    application.status
                                                )}`}
                                            >

                                                <span className="status-dot"></span>

                                                {formatStatus(
                                                    application.status
                                                )}

                                            </span>

                                        </div>


                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default UserDashboard;