import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:8084/jobPost/${id}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        console.log("Job Details Response:", response.data);

        setJob(response.data);
      } catch (err) {
        console.error("Failed to fetch job:", err);

        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="job-details-page">

        <div className="job-details-loading">
          Loading job details...
        </div>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !job) {
    return (
      <div className="job-details-page">

        <div className="job-details-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Job Not Found
          </h2>

          <p>
            The job you're looking for may have been removed
            or is no longer available.
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // JOB DETAILS
  // =========================

  return (
    <div className="job-details-page">

      <div className="job-details-container">

        {/* BACK BUTTON */}

        <button
          className="job-back-link"
          onClick={() => navigate(-1)}
        >
          ← Back to Jobs
        </button>


        {/* MAIN CARD */}

        <div className="job-details-card">

          {/* =========================
              HEADER
          ========================= */}

          <div className="job-details-header">

            <div className="job-company-logo">

              {job.postProfile
                ? job.postProfile
                    .charAt(0)
                    .toUpperCase()
                : "J"}

            </div>

            <div className="job-header-content">

              <h1>
                {job.postProfile}
              </h1>

              <p>
                Job Opportunity
              </p>

            </div>

          </div>


          {/* =========================
              JOB META
          ========================= */}

          <div className="job-meta">

            <div className="job-meta-item">

              <span className="meta-icon">
                💼
              </span>

              <div>

                <span className="meta-label">
                  Experience
                </span>

                <strong>
                  {job.reqExperience !== undefined
                    ? `${job.reqExperience} years`
                    : "Not specified"}
                </strong>

              </div>

            </div>


            <div className="job-meta-item">

              <span className="meta-icon">
                📍
              </span>

              <div>

                <span className="meta-label">
                  Workplace
                </span>

                <strong>
                  {job.location || "Remote / On-site"}
                </strong>

              </div>

            </div>


            <div className="job-meta-item">

              <span className="meta-icon">
                💼
              </span>

              <div>

                <span className="meta-label">
                  Job Type
                </span>

                <strong>
                  Full Time
                </strong>

              </div>

            </div>

          </div>


          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="job-content-section">

            <h2>
              Job Description
            </h2>

            <p className="job-description">
              {job.postDesc ||
                "No description available."}
            </p>

          </div>


          {/* =========================
              TECHNICAL SKILLS
          ========================= */}

          <div className="job-content-section">

            <h2>
              Technical Skills
            </h2>

            <div className="skills-list">

              {Array.isArray(job.postTechStack) &&
              job.postTechStack.length > 0 ? (

                job.postTechStack.map(
                  (skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )

              ) : (

                <p className="job-description">
                  No technical skills specified.
                </p>

              )}

            </div>

          </div>


          {/* =========================
              JOB INFO
          ========================= */}

          <div className="job-info-box">

            <div>

              <span>
                Job ID
              </span>

              <strong>
                #{job.postId}
              </strong>

            </div>


            <div>

              <span>
                Status
              </span>

              <strong className="active-status">
                Active
              </strong>

            </div>

          </div>


          {/* =========================
              ACTIONS
          ========================= */}

          <div className="job-details-actions">

            <button
              className="apply-button"
              onClick={() =>
                alert(
                  "Application feature coming soon!"
                )
              }
            >
              Apply Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;