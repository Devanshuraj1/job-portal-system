import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./MyJobs.css";

const MyJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/jobPosts/my");
            setJobs(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("My jobs error:", err);
            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }
            setError(err.response?.data || "Unable to load your jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) {
            return;
        }

        try {
            await api.delete(`/jobPost/${postId}`);
            setJobs((current) => current.filter((job) => job.postId !== postId));
        } catch (err) {
            console.error("Delete job error:", err);
            alert(err.response?.data || "Unable to delete this job.");
        }
    };

    return (
        <div className="my-jobs-page">
            <div className="my-jobs-header">
                <div>
                    <h1>My Jobs</h1>
                    <p>View, edit and manage your job postings.</p>
                </div>
                <button onClick={() => navigate("/create")}>+ Post New Job</button>
            </div>

            {error && <div className="my-jobs-error">⚠ {error}</div>}

            {loading ? (
                <div className="my-jobs-empty">Loading your jobs...</div>
            ) : jobs.length === 0 ? (
                <div className="my-jobs-empty">
                    <div>💼</div>
                    <h2>No Jobs Posted</h2>
                    <p>Create your first job posting to start receiving applications.</p>
                    <button onClick={() => navigate("/create")}>Post a Job</button>
                </div>
            ) : (
                <div className="my-jobs-list">
                    {jobs.map((job) => (
                        <article className="my-job-card" key={job.postId}>
                            <div className="my-job-main">
                                <div>
                                    <h2>{job.postProfile}</h2>
                                    <p className="company">🏢 {job.companyName || "Company"}</p>
                                </div>
                                <span className="job-status">ACTIVE</span>
                            </div>

                            <div className="my-job-meta">
                                <span>📍 {job.workplace || "Not specified"}</span>
                                <span>💼 {job.jobType || "Not specified"}</span>
                                <span>💰 {job.salary || "Not specified"}</span>
                                <span>🎓 {job.reqExperience ?? 0} years experience</span>
                            </div>

                            <div className="skills-row">
                                {(job.postTechStack || []).map((skill, index) => (
                                    <span key={`${job.postId}-${index}`}>{skill}</span>
                                ))}
                            </div>

                            <div className="my-job-actions">
                                <button onClick={() => navigate(`/job/${job.postId}`)}>
                                    View
                                </button>
                                <button
                                    onClick={() =>
                                        navigate("/edit", { state: { id: job.postId } })
                                    }
                                >
                                    Edit
                                </button>
                                <button onClick={() => navigate(`/applications?jobId=${job.postId}`)}>
                                    Applications
                                </button>
                                <button
                                    className="danger"
                                    onClick={() => handleDelete(job.postId)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;
