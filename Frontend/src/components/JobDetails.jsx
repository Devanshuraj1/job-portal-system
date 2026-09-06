import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./JobDetails.css";

function JobDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // APPLY STATES
  // =========================

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [showResumePicker, setShowResumePicker] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(null);


  // =========================
  // FETCH JOB
  // =========================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get(`/jobPost/${id}`);

        console.log(
          "Job Details:",
          response.data
        );

        setJob(response.data);

      } catch (err) {

        console.error(
          "Failed to fetch job:",
          err
        );

        setError(
          "Unable to load job details."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchJob();

  }, [id]);


  // =========================
  // APPLY FOR JOB
  // =========================

  const handleApply = async () => {
    if (!resumeFile) {
      setShowResumePicker(true);
      setApplyMessage("Please select your resume (PDF or DOCX) before applying.");
      return;
    }
    try {
      setApplying(true); setApplyMessage("");
      const formData = new FormData();
      formData.append("resume", resumeFile);
      const response = await api.post(`/applications/apply/${job.postId}`, formData);
      setApplied(true);
      setMatchPercentage(response.data?.matchPercentage ?? null);
      setApplyMessage("Application submitted successfully!");
      setShowResumePicker(false);
    } catch (err) {
      if (err.response?.status === 401) setApplyMessage("Please login before applying for a job.");
      else if (err.response?.status === 403) setApplyMessage("You are not authorized to apply for this job.");
      else setApplyMessage(err.response?.data || "Failed to submit application. Please try again.");
    } finally { setApplying(false); }
  };


  // =========================
  // FORMAT WORKPLACE
  // =========================

  const formatWorkplace = (workplace) => {

    if (!workplace) {
      return "Not specified";
    }

    if (workplace === "ON_SITE") {
      return "On-site";
    }

    if (workplace === "REMOTE") {
      return "Remote";
    }

    if (workplace === "HYBRID") {
      return "Hybrid";
    }

    return workplace;

  };


  // =========================
  // FORMAT JOB TYPE
  // =========================

  const formatJobType = (jobType) => {

    if (!jobType) {
      return "Not specified";
    }

    if (jobType === "FULL_TIME") {
      return "Full Time";
    }

    if (jobType === "INTERNSHIP") {
      return "Internship";
    }

    return jobType;

  };


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
            The job you're looking for may have
            been removed or is no longer available.
          </p>

          <button
            className="back-button"
            onClick={() =>
              navigate("/")
            }
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


        {/* BACK */}

        <button
          className="job-back-link"
          onClick={() =>
            navigate(-1)
          }
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

              {job.companyName

                ? job.companyName
                    .charAt(0)
                    .toUpperCase()

                : job.postProfile

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
                {job.companyName ||
                  "Company not specified"}
              </p>

            </div>

          </div>


          {/* =========================
              JOB META
          ========================= */}

          <div className="job-meta">


            {/* EXPERIENCE */}

            <div className="job-meta-item">

              <span className="meta-icon">
                💼
              </span>

              <div>

                <span className="meta-label">
                  Experience
                </span>

                <strong>

                  {job.reqExperience !==
                    undefined &&
                   job.reqExperience !==
                    null

                    ? `${job.reqExperience} years`

                    : "Not specified"}

                </strong>

              </div>

            </div>


            {/* SALARY */}

            <div className="job-meta-item">

              <span className="meta-icon">
                💰
              </span>

              <div>

                <span className="meta-label">
                  Salary
                </span>

                <strong>
                  {job.salary ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* WORKPLACE */}

            <div className="job-meta-item">

              <span className="meta-icon">
                📍
              </span>

              <div>

                <span className="meta-label">
                  Workplace
                </span>

                <strong>
                  {formatWorkplace(
                    job.workplace
                  )}
                </strong>

              </div>

            </div>


            {/* JOB TYPE */}

            <div className="job-meta-item">

              <span className="meta-icon">
                🏷️
              </span>

              <div>

                <span className="meta-label">
                  Job Type
                </span>

                <strong>
                  {formatJobType(
                    job.jobType
                  )}
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

              {Array.isArray(
                job.postTechStack
              ) &&
              job.postTechStack.length >
                0 ? (

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
              POSTED INFORMATION
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
                Posted By
              </span>

              <strong>
                {job.postedBy ||
                  "JobPortal"}
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
              APPLY ACTION
          ========================= */}

          <div className="job-details-actions">

            {!applied && (
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => { setResumeFile(e.target.files?.[0] || null); setApplyMessage(""); }}
                className="resume-input"
              />
            )}

            <button
              className="apply-button"
              onClick={handleApply}
              disabled={applying || applied}
            >

              {applying
                ? "Applying..."
                : applied
                  ? "Applied ✓"
                  : "Apply Now"}

            </button>

          </div>


          {/* =========================
              APPLY MESSAGE
          ========================= */}

          {resumeFile && !applied && (
            <div className="resume-selected">Resume: {resumeFile.name}</div>
          )}

          {applyMessage && (
            <div className="apply-message">{applyMessage}</div>
          )}

          {matchPercentage !== null && (
            <div className="match-result">Your resume match: <strong>{matchPercentage}%</strong></div>
          )}

        </div>

      </div>

    </div>

  );
}

export default JobDetails;