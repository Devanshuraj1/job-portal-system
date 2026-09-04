import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Applicants.css";

const Applicants = () => {

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =====================================================
  // AXIOS CONFIG
  // =====================================================

  const api = axios.create({
    baseURL: "http://localhost:8084",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // =====================================================
  // LOAD RECRUITER JOBS
  // =====================================================

  const loadApplications = async () => {

    try {

      setLoading(true);
      setError("");
      setMessage("");

      // Get recruiter's own jobs
      const jobsResponse =
        await api.get("/jobPosts/my");

      const myJobs = jobsResponse.data;

      setJobs(myJobs);

      // No jobs
      if (myJobs.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // =================================================
      // GET APPLICANTS FOR EVERY JOB
      // =================================================

      const applicationRequests =
        myJobs.map(job =>
          api.get(
            `/applications/job/${job.postId}`
          )
        );

      const responses =
        await Promise.all(applicationRequests);

      // =================================================
      // COMBINE ALL APPLICATIONS
      // =================================================

      const allApplications = [];

      responses.forEach((response, index) => {

        const job = myJobs[index];

        response.data.forEach(application => {

          allApplications.push({
            ...application,
            jobTitle: job.postProfile,
            companyName: job.companyName,
          });

        });

      });

      setApplications(allApplications);

    } catch (err) {

      console.error(
        "Error loading applications:",
        err
      );

      if (err.response) {

        setError(
          err.response.data ||
          "Unable to load applications"
        );

      } else {

        setError(
          "Unable to connect to server"
        );
      }

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {

    loadApplications();

  }, []);


  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateStatus = async (
    applicationId,
    newStatus
  ) => {

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

      // Success message
      setMessage(
        `Application status updated to ${newStatus}`
      );

      // Refresh applications
      await loadApplications();

    } catch (err) {

      console.error(
        "Status update error:",
        err
      );

      if (err.response) {

        setError(
          err.response.data ||
          "Unable to update application status"
        );

      } else {

        setError(
          "Unable to connect to server"
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


      {/* SUCCESS */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}


      {/* ERROR */}

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

          {applications.map(application => (

            <div
              className="application-card"
              key={application.id}
            >

              {/* TOP */}

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
                  className={`status-badge ${application.status
                    ?.toLowerCase()}`}
                >
                  {application.status}
                </span>

              </div>


              {/* DETAILS */}

              <div className="application-details">

                <div className="detail-item">

                  <span className="detail-label">
                    🏢 Company
                  </span>

                  <span>
                    {application.companyName}
                  </span>

                </div>


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


                <div className="detail-item">

                  <span className="detail-label">
                    🆔 Application ID
                  </span>

                  <span>
                    #{application.id}
                  </span>

                </div>

              </div>


              {/* ACTIONS */}

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
                    ✓ Accept
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