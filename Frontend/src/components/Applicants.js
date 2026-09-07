import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Applicants.css";

const Applicants = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadApplications = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const jobsResponse = await api.get("/jobPosts/my");
            const myJobs = jobsResponse.data || [];

            setJobs(myJobs);

            if (myJobs.length === 0) {
                setApplications([]);
                return;
            }

            const applicationRequests = myJobs.map((job) =>
                api.get(`/applications/job/${job.postId}`)
            );

            const responses = await Promise.all(applicationRequests);

            const allApplications = [];

            responses.forEach((response, index) => {
                const job = myJobs[index];

                if (Array.isArray(response.data)) {
                    response.data.forEach((application) => {
                        allApplications.push({
                            ...application,
                            jobTitle: job.postProfile,
                            companyName: job.companyName,
                        });
                    });
                }
            });

            setApplications(allApplications);

        } catch (err) {
            console.error("Error loading applications:", err);

            if (err.response?.status === 401) {
                setError("Unauthorized. Please login again.");
            } else if (err.response?.status === 403) {
                setError(
                    "You don't have permission to view these applications."
                );
            } else {
                setError(
                    err.response?.data ||
                    "Unable to load applications."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
    }, []);


    // =====================================================
    // UPDATE APPLICATION STATUS
    // =====================================================

    const updateStatus = async (applicationId, newStatus) => {
        try {
            setUpdatingId(applicationId);
            setError("");
            setMessage("");

            await api.patch(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus
                },
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
            } else if (err.response?.status === 403) {
                setError(
                    "You don't have permission to update this application."
                );
            } else {
                setError(
                    err.response?.data ||
                    "Unable to update application status."
                );
            }

        } finally {
            setUpdatingId(null);
        }
    };


    // =====================================================
    // VIEW / DOWNLOAD RESUME
    // =====================================================

    const viewResume = async (applicationId) => {
        try {
            setError("");

            console.log(
                "Opening resume for application:",
                applicationId
            );

            const response = await api.get(
                `/applications/resume/${applicationId}`,
                {
                    responseType: "blob",
                }
            );

            console.log(
                "Resume status:",
                response.status
            );

            console.log(
                "Resume content type:",
                response.headers["content-type"]
            );

            const contentType =
                response.headers["content-type"] ||
                "application/octet-stream";

            const blob = new Blob(
                [response.data],
                {
                    type: contentType,
                }
            );

            const fileURL =
                window.URL.createObjectURL(blob);


            // =================================================
            // PDF
            // =================================================

            if (contentType.includes("pdf")) {

                const newWindow =
                    window.open(
                        fileURL,
                        "_blank"
                    );

                if (!newWindow) {
                    setError(
                        "Browser blocked the resume popup. Please allow popups."
                    );
                }

                setTimeout(() => {
                    window.URL.revokeObjectURL(
                        fileURL
                    );
                }, 60000);

                return;
            }


            // =================================================
            // DOCX
            // =================================================

            if (
                contentType.includes("word") ||
                contentType.includes("officedocument")
            ) {

                const link =
                    document.createElement("a");

                link.href = fileURL;

                link.download =
                    `resume-${applicationId}.docx`;

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                setTimeout(() => {
                    window.URL.revokeObjectURL(
                        fileURL
                    );
                }, 5000);

                setMessage(
                    "DOCX resume downloaded successfully."
                );

                return;
            }


            // =================================================
            // OTHER FILE
            // =================================================

            const link =
                document.createElement("a");

            link.href = fileURL;

            link.download =
                `resume-${applicationId}`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            setTimeout(() => {
                window.URL.revokeObjectURL(
                    fileURL
                );
            }, 5000);

        } catch (err) {

            console.error(
                "========== RESUME ERROR =========="
            );

            console.error(
                "Error:",
                err
            );

            console.error(
                "Status:",
                err.response?.status
            );

            console.error(
                "Headers:",
                err.response?.headers
            );

            console.error(
                "Data:",
                err.response?.data
            );

            console.error(
                "=================================="
            );


            if (err.response?.status === 401) {

                setError(
                    "Unauthorized. Please login again."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "You are not authorized to view this resume."
                );

            } else if (err.response?.status === 404) {

                setError(
                    "Resume file was not found on the server."
                );

            } else {

                setError(
                    "Unable to open resume."
                );
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
                    <div className="loading-spinner"></div>
                    <p>Loading applications...</p>
                </div>
            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="applicants-page">

            <div className="applicants-header">

                <div>
                    <span className="page-eyebrow">
                        RECRUITER PORTAL
                    </span>

                    <h1>Applications</h1>

                    <p>
                        Review candidates and manage applications
                        submitted for your jobs.
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={loadApplications}
                    disabled={loading}
                >
                    <span className="refresh-icon">↻</span>
                    Refresh
                </button>

            </div>


            {/* MESSAGES */}

            {message && (
                <div className="success-message">
                    <span>✓</span>
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span>!</span>
                    {error}
                </div>
            )}


            {/* NO JOBS */}

            {jobs.length === 0 ? (

                <div className="empty-applications">

                    <div className="empty-icon">
                        💼
                    </div>

                    <h2>No Jobs Posted</h2>

                    <p>
                        You haven't posted any jobs yet.
                    </p>

                </div>

            ) : applications.length === 0 ? (

                <div className="empty-applications">

                    <div className="empty-icon">
                        📄
                    </div>

                    <h2>No Applications Yet</h2>

                    <p>
                        No candidates have applied to your
                        job postings yet.
                    </p>

                </div>

            ) : (

                <div className="applications-list">

                    {applications.map((application) => {

                        const status =
                            application.status?.toLowerCase()
                            || "applied";

                        const isUpdating =
                            updatingId === application.id;

                        return (

                            <div
                                className="application-card"
                                key={application.id}
                            >

                                {/* HEADER */}

                                <div className="application-top">

                                    <div className="candidate-info">

                                        <div className="candidate-avatar">

                                            {application.username
                                                ? application.username
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "U"}

                                        </div>

                                        <div className="candidate-text">

                                            <h2>
                                                {application.username ||
                                                    "Unknown Candidate"}
                                            </h2>

                                            <p>
                                                Applied for{" "}
                                                <strong>
                                                    {application.jobTitle}
                                                </strong>
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={`status-badge status-${status}`}
                                    >
                                        <span className="status-dot"></span>

                                        {application.status ||
                                            "APPLIED"}

                                    </span>

                                </div>


                                {/* DETAILS */}

                                <div className="application-details">

                                    {/* COMPANY */}

                                    <div className="detail-item">

                                        <span className="detail-label">
                                            <span className="detail-icon">
                                                🏢
                                            </span>
                                            Company
                                        </span>

                                        <span className="detail-value">
                                            {application.companyName ||
                                                "N/A"}
                                        </span>

                                    </div>


                                    {/* MATCH */}

                                    <div className="detail-item match-item">

                                        <span className="detail-label">
                                            <span className="detail-icon">
                                                🎯
                                            </span>
                                            Resume Match
                                        </span>

                                        <div className="match-wrapper">

                                            <strong className="match-score">
                                                {application.matchPercentage ??
                                                    0}%
                                            </strong>

                                            <div className="match-bar">

                                                <div
                                                    className="match-bar-fill"
                                                    style={{
                                                        width: `${Math.min(
                                                            application.matchPercentage ??
                                                                0,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* RESUME */}

                                    <div className="detail-item">

                                        <span className="detail-label">

                                            <span className="detail-icon">
                                                📄
                                            </span>

                                            Resume

                                        </span>

                                        {application.resumeFile ? (

                                            <button
                                                type="button"
                                                className="resume-link"
                                                onClick={() =>
                                                    viewResume(
                                                        application.id
                                                    )
                                                }
                                            >
                                                View Resume
                                                <span>↗</span>
                                            </button>

                                        ) : (

                                            <span className="not-uploaded">
                                                Not uploaded
                                            </span>

                                        )}

                                    </div>


                                    {/* DATE */}

                                    <div className="detail-item">

                                        <span className="detail-label">

                                            <span className="detail-icon">
                                                📅
                                            </span>

                                            Applied On

                                        </span>

                                        <span className="detail-value">

                                            {application.appliedAt
                                                ? new Date(
                                                    application.appliedAt
                                                ).toLocaleDateString()
                                                : "N/A"}

                                        </span>

                                    </div>


                                    {/* ID */}

                                    <div className="detail-item">

                                        <span className="detail-label">

                                            <span className="detail-icon">
                                                #
                                            </span>

                                            Application ID

                                        </span>

                                        <span className="detail-value">
                                            #{application.id}
                                        </span>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="application-footer">

                                    <div className="footer-info">
                                        Candidate application
                                    </div>

                                    <div className="application-actions">

                                        {/* SHORTLIST */}

                                        {application.status !== "SHORTLISTED" &&
                                            application.status !== "REJECTED" &&
                                            application.status !== "HIRED" && (

                                                <button
                                                    className="action-btn shortlist-btn"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        updateStatus(
                                                            application.id,
                                                            "SHORTLISTED"
                                                        )
                                                    }
                                                >
                                                    <span>✓</span>
                                                    Shortlist
                                                </button>
                                            )}


                                        {/* REJECT */}

                                        {application.status !== "REJECTED" &&
                                            application.status !== "HIRED" && (

                                                <button
                                                    className="action-btn reject-btn"
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        updateStatus(
                                                            application.id,
                                                            "REJECTED"
                                                        )
                                                    }
                                                >
                                                    <span>×</span>
                                                    Reject
                                                </button>
                                            )}


                                        {/* HIRE */}

                                        {application.status === "SHORTLISTED" && (

                                            <button
                                                className="action-btn hire-btn"
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    updateStatus(
                                                        application.id,
                                                        "HIRED"
                                                    )
                                                }
                                            >
                                                <span>★</span>
                                                Hire
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default Applicants;