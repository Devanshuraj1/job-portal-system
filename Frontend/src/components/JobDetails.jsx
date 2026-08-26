import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobPost/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="details-message">
        <div className="details-loader"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="details-message">
        <div className="details-empty-icon">🔎</div>
        <h2>Job not found</h2>
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">

      {/* Header */}
      <div className="details-header">

        <button
          className="back-link"
          onClick={() => navigate("/")}
        >
          ← Back to Jobs
        </button>

        <div className="details-title-section">

          <div className="details-logo">
            {job.postProfile?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="details-label">
              JOB OPPORTUNITY
            </p>

            <h1>{job.postProfile}</h1>

            <p className="details-subtitle">
              Full-time · On-site
            </p>
          </div>

        </div>

      </div>

      {/* Main Content */}
      <div className="details-container">

        {/* Left */}
        <main className="details-main">

          <section className="details-section">

            <h2>About this role</h2>

            <p>
              {job.postDesc}
            </p>

          </section>

          <section className="details-section">

            <h2>Required Skills</h2>

            <div className="details-skills">

              {job.postTechStack?.map(
                (skill, index) => (
                  <span
                    className="details-skill"
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}

            </div>

          </section>

        </main>

        {/* Right */}
        <aside className="details-sidebar">

          <div className="details-card">

            <h3>Job Overview</h3>

            <div className="overview-item">
              <span>💼</span>

              <div>
                <small>Experience</small>
                <strong>
                  {job.reqExperience} years
                </strong>
              </div>
            </div>

            <div className="overview-item">
              <span>🧑‍💻</span>

              <div>
                <small>Employment</small>
                <strong>Full-time</strong>
              </div>
            </div>

            <div className="overview-item">
              <span>📍</span>

              <div>
                <small>Workplace</small>
                <strong>On-site</strong>
              </div>
            </div>

            <button className="apply-btn">
              Apply for this Job →
            </button>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default JobDetails;