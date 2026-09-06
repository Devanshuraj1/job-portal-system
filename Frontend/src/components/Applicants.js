import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Applicants.css";

const Applicants = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // LOAD RECRUITER JOBS + APPLICATIONS
    // =====================================================

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            // Get recruiter's own jobs
            const jobsResponse = await api.get("/jobPosts/my");

            const myJobs = jobsResponse.data;

            console.log("MY JOBS:", myJobs);

            setJobs(myJobs);

            // No jobs
            if (!myJobs || myJobs.length === 0) {
                setApplications([]);
                setLoading(false);
                return;
            }

            // Get applications for every job
            const applicationRequests = myJobs.map((job) =>
                api.get(`/applications/job/${job.postId}`)
            );

            const responses = await Promise.all(applicationRequests);

            // Combine all applications
            const allApplications = [];

            responses.forEach((response, index) => {
                const job = myJobs[index];

                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach((application) => {
                        allApplications.push({
                            ...application,
                            jobTitle: job.postProfile,
                            companyName: job.companyName,
                        });
                    });
                }
            });

            console.log("ALL APPLICATIONS:", allApplications);

            setApplications(allApplications);
        } catch (err) {
            console.error("Error loading applications:", err);

            if (err.response?.status === 401) {
                setError("Unauthorized. Please login again.");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "You don't have permission to view these applications."
                );
                return;
            }

            if (err.response) {
                setError(
                    err.response.data ||
                    "Unable to load applications"
                );
            } else {
                setError("Unable to connect to server");
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD DATA WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {
        loadApplications();
    }, []);

    // =====================================================
    // UPDATE APPLICATION STATUS
    // =====================================================

    const updateStatus = async (applicationId, newStatus) => {
        try {
            setError("");
            setMessage("");

            await api.patch(
                `/applications/${applicationId}/status`,
                newStatus,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage(
                `Application status updated to ${newStatus}`
            );

            await loadApplications();
        } catch (err) {
            console.error("Status update error:", err);

            if (err.response?.status === 401) {
                setError("Unauthorized. Please login again.");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "You don't have permission to update this application."
                );
                return;
            }

            if (err.response) {
                setError(
                    err.response.data ||
                    "Unable to update application status"
                );
            } else {
                setError("Unable to connect to server");
            }
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="applicants-page">
                <div className="applicants-loading">
                    Loading applications...
                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="applicants-page">

            {/* HEADER */}
            <div className="applicants-header">
                <div>
                    <h1>Applications</h1>

                    <p>
                        Review and manage applications
                        submitted for your jobs.
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={loadApplications}
                >
                    ↻ Refresh
                </button>
            </div>

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="success-message">
                    ✓ {message}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="error-message">
                    ⚠ {error}
                </div>
            )}

            {/* NO JOBS */}
            {jobs.length === 0 ? (
                <div className="empty-applications">
                    <div className="empty-applications-icon">
                        💼
                    </div>

                    <h2>No Jobs Posted</h2>

                    <p>
                        You haven't posted any jobs yet.
                    </p>
                </div>
            ) : applications.length === 0 ? (

                /* NO APPLICATIONS */

                <div className="empty-applications">
                    <div className="empty-applications-icon">
                        📄
                    </div>

                    <h2>No Applications Yet</h2>

                    <p>
                        No candidates have applied
                        to your job postings yet.
                    </p>
                </div>

            ) : (

                /* APPLICATIONS */

                <div className="applications-list">

                    {applications.map((application) => (
                        <div
                            className="application-card"
                            key={application.id}
                        >

                            {/* TOP SECTION */}
                            <div className="application-top">

                                <div className="candidate-info">

                                    <div className="candidate-avatar">
                                        {application.username
                                            ? application.username
                                                .charAt(0)
                                                .toUpperCase()
                                            : "U"}
                                    </div>

                                    <div>
                                        <h2>
                                            {application.username}
                                        </h2>

                                        <p>
                                            Applied for{" "}

                                            <strong>
                                                {application.jobTitle}
                                            </strong>
                                        </p>
                                    </div>

                                </div>

                                {/* STATUS */}
                                <span
                                    className={`status-badge ${
                                        application.status?.toLowerCase()
                                    }`}
                                >
                                    {application.status}
                                </span>

                            </div>

                            {/* DETAILS */}
                            <div className="application-details">

                                {/* COMPANY */}
                                <div className="detail-item">
                                    <span className="detail-label">
                                        🏢 Company
                                    </span>

                                    <span>
                                        {application.companyName}
                                    </span>
                                </div>

                                {/* MATCH SCORE */}
                                <div className="detail-item match-score-item">
                                    <span className="detail-label">🎯 Resume Match</span>
                                    <strong className="match-score">{application.matchPercentage ?? 0}%</strong>
                                </div>

                                {/* RESUME */}
                                <div className="detail-item">
                                    <span className="detail-label">📄 Resume</span>
                                    {application.resumeFile ? (
                                        <a className="resume-link" href={`http://localhost:8084/applications/resume/${application.id}`} target="_blank" rel="noreferrer">View Resume</a>
                                    ) : <span>Not uploaded</span>}
                                </div>

                                {/* APPLIED DATE */}
                                <div className="detail-item">
                                    <span className="detail-label">
                                        📅 Applied On
                                    </span>

                                    <span>
                                        {application.appliedAt
                                            ? new Date(
                                                application.appliedAt
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </span>
                                </div>

                                {/* APPLICATION ID */}
                                <div className="detail-item">
                                    <span className="detail-label">
                                        🆔 Application ID
                                    </span>

                                    <span>
                                        #{application.id}
                                    </span>
                                </div>

                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="application-actions">

                                {/* SHORTLIST */}
                                {application.status !== "SHORTLISTED" &&
                                    application.status !== "REJECTED" &&
                                    application.status !== "HIRED" && (

                                        <button
                                            className="shortlist-btn"
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "SHORTLISTED"
                                                )
                                            }
                                        >
                                            ✓ Shortlist
                                        </button>
                                    )}

                                {/* REJECT */}
                                {application.status !== "REJECTED" &&
                                    application.status !== "HIRED" && (

                                        <button
                                            className="reject-btn"
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "REJECTED"
                                                )
                                            }
                                        >
                                            ✕ Reject
                                        </button>
                                    )}

                                {/* HIRE */}
                                {application.status === "SHORTLISTED" && (

                                    <button
                                        className="hire-btn"
                                        onClick={() =>
                                            updateStatus(
                                                application.id,
                                                "HIRED"
                                            )
                                        }
                                    >
                                        ★ Hire
                                    </button>
                                )}

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default Applicants;