import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH PENDING RECRUITERS
  // =========================

  const fetchPendingRecruiters = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8084/admin/recruiters/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRecruiters(response.data);

    } catch (error) {

      console.error(
        "Failed to fetch pending recruiters:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchPendingRecruiters();

  }, []);


  // =========================
  // APPROVE RECRUITER
  // =========================

  const approveRecruiter = async (id) => {

    try {

      await axios.put(
        `http://localhost:8084/admin/recruiters/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Recruiter approved successfully");

      fetchPendingRecruiters();

    } catch (error) {

      console.error(
        "Approve recruiter failed:",
        error
      );

      alert("Failed to approve recruiter");
    }
  };


  // =========================
  // REJECT RECRUITER
  // =========================

  const rejectRecruiter = async (id) => {

    try {

      await axios.put(
        `http://localhost:8084/admin/recruiters/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Recruiter rejected successfully");

      fetchPendingRecruiters();

    } catch (error) {

      console.error(
        "Reject recruiter failed:",
        error
      );

      alert("Failed to reject recruiter");
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="admin-page">

        <div className="admin-loading">
          Loading Admin Dashboard...
        </div>

      </div>
    );
  }


  // =========================
  // UI
  // =========================

  return (

    <div className="admin-page">

      <div className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>

            <p className="admin-label">
              ADMIN PANEL
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p className="admin-subtitle">
              Manage recruiter applications and platform access.
            </p>

          </div>

          <div className="admin-count">

            <span>
              Pending
            </span>

            <strong>
              {recruiters.length}
            </strong>

          </div>

        </div>


        {/* PENDING RECRUITERS */}

        <div className="recruiter-section">

          <div className="section-header">

            <div>

              <h2>
                Pending Recruiters
              </h2>

              <p>
                Review recruiter applications before approval.
              </p>

            </div>

          </div>


          {/* EMPTY STATE */}

          {recruiters.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                No Pending Recruiters
              </h3>

              <p>
                There are currently no recruiter applications
                waiting for approval.
              </p>

            </div>

          ) : (

            <div className="recruiter-list">

              {recruiters.map((recruiter) => (

                <div
                  className="recruiter-card"
                  key={recruiter.id}
                >

                  <div className="recruiter-info">

                    <div className="recruiter-avatar">
                      {recruiter.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {recruiter.username}
                      </h3>

                      <p>
                        Recruiter ID: #{recruiter.id}
                      </p>

                    </div>

                  </div>


                  <div className="recruiter-details">

                    <div className="detail-item">

                      <span>
                        Role
                      </span>

                      <strong>
                        {recruiter.role}
                      </strong>

                    </div>


                    <div className="detail-item">

                      <span>
                        Status
                      </span>

                      <strong className="pending-status">
                        {recruiter.recruiterStatus}
                      </strong>

                    </div>

                  </div>


                  <div className="recruiter-actions">

                    <button
                      className="approve-btn"
                      onClick={() =>
                        approveRecruiter(recruiter.id)
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        rejectRecruiter(recruiter.id)
                      }
                    >
                      Reject
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;