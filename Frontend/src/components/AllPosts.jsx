import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./AllPosts.css";

const AllPosts = () => {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =========================
  // FETCH ALL JOBS
  // =========================

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobPosts");

      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH JOBS
  // =========================

  const fetchSearchPosts = async (keyword) => {
    try {
      setLoading(true);

      const response = await api.get(
        `/jobPosts/keyword/${keyword}`
      );

      setPosts(response.data);
    } catch (error) {
      console.error("Error searching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD + SEARCH
  // =========================

  useEffect(() => {
    if (query.trim().length === 0) {
      fetchPosts();
    } else if (query.trim().length > 2) {
      fetchSearchPosts(query.trim());
    }
  }, [query]);

  // =========================
  // EDIT JOB
  // =========================

  const handleEdit = (id) => {
    navigate("/edit", {
      state: {
        id: id,
      },
    });
  };

  // =========================
  // DELETE JOB
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/jobPost/${id}`);

      setPosts((previousPosts) =>
        previousPosts.filter(
          (job) => job.postId !== id
        )
      );

      alert("Job Deleted Successfully!");
    } catch (error) {
      console.error("Delete error:", error);

      alert("Unable to delete job.");
    }
  };

  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="jobs-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="jobs-hero">

        <div className="hero-content">

          <div className="hero-small-title">
            CAREER OPPORTUNITIES
          </div>

          <h1>
            Find your next
            <span> opportunity.</span>
          </h1>

          <p className="hero-description">
            Explore exciting job opportunities, discover
            companies, and take the next step in your
            professional career.
          </p>

        </div>

      </section>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="search-container">

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search jobs by title, skills or technology..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              className="clear-search"
              onClick={clearSearch}
              type="button"
            >
              ×
            </button>
          )}

        </div>

      </div>


      {/* =========================
          JOB HEADER
      ========================= */}

      <div className="jobs-header">

        <div>

          <h2>
            Latest Opportunities
          </h2>

          <p>
            Discover roles that match your skills and experience.
          </p>

        </div>

      </div>


      {/* =========================
          JOB GRID
      ========================= */}

      <div className="jobs-container">

        {/* Loading */}

        {loading && (
          <div className="jobs-message">

            <div className="loader"></div>

            <p>
              Loading jobs...
            </p>

          </div>
        )}


        {/* Empty */}

        {!loading && posts.length === 0 && (
          <div className="jobs-message">

            <div className="empty-icon">
              🔎
            </div>

            <h3>
              No jobs found
            </h3>

            <p>
              Try searching with another keyword.
            </p>

          </div>
        )}


        {/* =========================
            JOB CARDS
        ========================= */}

        {!loading &&
          posts.map((p) => (

            <div
              className="job-card"
              key={p.postId}
            >

              {/* CARD TOP */}

              <div className="job-card-top">

                <div className="company-logo">
                  {p.postProfile
                    ? p.postProfile
                        .charAt(0)
                        .toUpperCase()
                    : "J"}
                </div>

                <div className="job-heading">

                  {/* Dynamic Job Role */}

                  <h3 className="job-title">
                    {p.postProfile}
                  </h3>

                  <p className="job-type">
                    Full Time · Job Opportunity
                  </p>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="job-description-section">

                <p className="job-description">
                  {p.postDesc}
                </p>

              </div>


              {/* JOB INFO */}

              <div className="job-info">

                <div className="info-item">

                  <span className="info-icon">
                    💼
                  </span>

                  <div>

                    <small>
                      Experience
                    </small>

                    <strong>
                      {p.reqExperience} years
                    </strong>

                  </div>

                </div>


                <div className="info-item">

                  <span className="info-icon">
                    📍
                  </span>

                  <div>

                    <small>
                      Workplace
                    </small>

                    <strong>
                      Remote / On-site
                    </strong>

                  </div>

                </div>

              </div>


              {/* SKILLS */}

              <div>

                <div className="skills-title">
                  TECHNICAL SKILLS
                </div>

                <div className="skills-list">

                  {Array.isArray(p.postTechStack) &&
                    p.postTechStack.map(
                      (skill, index) => (

                        <span
                          className="skill-tag"
                          key={index}
                        >
                          {skill}
                        </span>

                      )
                    )}

                </div>

              </div>


              {/* ACTIONS */}

              <div className="job-actions">

                <button
                  className="details-btn"
                  type="button"
                >
                  View Details
                  <span>→</span>
                </button>


                <div className="admin-actions">

                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() =>
                      handleEdit(p.postId)
                    }
                  >
                    Edit
                  </button>


                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() =>
                      handleDelete(p.postId)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

      </div>

    </div>
  );
};

export default AllPosts;