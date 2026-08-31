import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./AllPosts.css";

const AllPosts = () => {

  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");


  // =========================
  // FETCH ALL JOBS
  // =========================

  const fetchPosts = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/jobPosts");

      console.log("ALL JOBS:", response.data);

      setPosts(response.data || []);

    } catch (error) {

      console.error(
        "Error fetching jobs:",
        error
      );

      setPosts([]);

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

      const response =
        await api.get(
          `/jobPosts/keyword/${encodeURIComponent(
            keyword
          )}`
        );

      console.log(
        "SEARCH JOBS:",
        response.data
      );

      setPosts(response.data || []);

    } catch (error) {

      console.error(
        "Error searching jobs:",
        error
      );

      setPosts([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // LOAD + SEARCH
  // =========================

  useEffect(() => {

    if (query.trim().length === 0) {

      fetchPosts();

    } else if (query.trim().length > 2) {

      fetchSearchPosts(
        query.trim()
      );

    }

  }, [query]);


  // =========================
  // VIEW DETAILS
  // =========================

  const handleViewDetails = (id) => {

    navigate(`/job/${id}`);

  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (id) => {

    navigate("/edit", {
      state: {
        id: id,
      },
    });

  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/jobPost/${id}`
      );

      setPosts(
        (previousPosts) =>
          previousPosts.filter(
            (job) =>
              job.postId !== id
          )
      );

      alert(
        "Job Deleted Successfully!"
      );

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        error?.response?.data ||
        "Unable to delete job."
      );

    }

  };


  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {

    setQuery("");

  };


  // =========================
  // OWNERSHIP
  // =========================

  const canManageJob = (job) => {

    // ADMIN can manage every job
    if (role === "ADMIN") {

      return true;

    }


    // RECRUITER can manage
    // only their own jobs
    if (
      role === "RECRUITER" &&
      username &&
      job.postedBy &&
      username === job.postedBy
    ) {

      return true;

    }

    return false;

  };


  // =========================
  // TECH STACK
  // =========================

  const getTechStack = (job) => {

    if (
      Array.isArray(
        job.postTechStack
      )
    ) {

      return job.postTechStack;

    }

    if (
      typeof job.postTechStack ===
      "string"
    ) {

      return job.postTechStack
        .split(",")
        .map(
          (skill) =>
            skill.trim()
        )
        .filter(
          (skill) =>
            skill.length > 0
        );

    }

    return [];

  };


  // =========================
  // FORMAT WORKPLACE
  // =========================

  const formatWorkplace = (
    workplace
  ) => {

    if (!workplace) {
      return "Not specified";
    }

    switch (workplace) {

      case "REMOTE":
        return "Remote";

      case "ON_SITE":
        return "On-site";

      case "HYBRID":
        return "Hybrid";

      default:
        return workplace;

    }

  };


  // =========================
  // FORMAT JOB TYPE
  // =========================

  const formatJobType = (
    jobType
  ) => {

    if (!jobType) {
      return "Not specified";
    }

    switch (jobType) {

      case "FULL_TIME":
        return "Full Time";

      case "INTERNSHIP":
        return "Internship";

      default:
        return jobType;

    }

  };


  // =========================
  // RENDER
  // =========================

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

            <span>
              {" "}
              opportunity.
            </span>

          </h1>

          <p className="hero-description">

            Explore exciting job opportunities,
            discover companies, and take the next
            step in your professional career.

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
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
          />

          {query && (

            <button
              className="clear-search"
              onClick={
                clearSearch
              }
              type="button"
            >
              ×
            </button>

          )}

        </div>

      </div>


      {/* =========================
          HEADER
      ========================= */}

      <div className="jobs-header">

        <div>

          <h2>
            Latest Opportunities
          </h2>

          <p>
            Discover roles that match your
            skills and experience.
          </p>

        </div>

        <div className="job-count">

          {posts.length} Jobs

        </div>

      </div>


      {/* =========================
          JOB CONTAINER
      ========================= */}

      <div className="jobs-container">


        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div className="jobs-message">

            <div className="loader"></div>

            <p>
              Loading jobs...
            </p>

          </div>

        )}


        {/* =========================
            EMPTY
        ========================= */}

        {!loading &&
          posts.length === 0 && (

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
          posts.map((p) => {

            const skills =
              getTechStack(p);

            return (

              <div
                className="job-card"
                key={p.postId}
              >


                {/* =========================
                    HEADER
                ========================= */}

                <div className="job-card-top">

                  <div className="company-logo">

                    {p.companyName

                      ? p.companyName
                          .charAt(0)
                          .toUpperCase()

                      : p.postProfile

                        ? p.postProfile
                            .charAt(0)
                            .toUpperCase()

                        : "J"}

                  </div>


                  <div className="job-heading">

                    <h3 className="job-title">

                      {p.postProfile ||
                        "Untitled Job"}

                    </h3>


                    <p className="job-company-name">

                      {p.companyName ||
                        "Company not specified"}

                    </p>


                    <p className="job-type">

                      {formatJobType(
                        p.jobType
                      )}

                      {" · "}

                      {formatWorkplace(
                        p.workplace
                      )}

                    </p>

                  </div>

                </div>


                {/* =========================
                    POSTED BY
                ========================= */}

                <div className="posted-by-box">

                  <div className="posted-by-left">

                    <div className="posted-avatar">

                      {p.postedBy

                        ? p.postedBy
                            .charAt(0)
                            .toUpperCase()

                        : "A"}

                    </div>


                    <div className="posted-by-content">

                      <span>
                        Posted By
                      </span>

                      <strong>

                        {p.postedBy ||
                          "JobPortal"}

                      </strong>

                    </div>

                  </div>


                  <div className="job-id">

                    Job #{p.postId}

                  </div>

                </div>


                {/* =========================
                    JOB INFO
                ========================= */}

                <div className="job-info">


                  {/* COMPANY */}

                  <div className="info-item">

                    <span className="info-icon">
                      🏢
                    </span>

                    <div>

                      <small>
                        Company
                      </small>

                      <strong>

                        {p.companyName ||
                          "Not specified"}

                      </strong>

                    </div>

                  </div>


                  {/* SALARY */}

                  <div className="info-item">

                    <span className="info-icon">
                      💰
                    </span>

                    <div>

                      <small>
                        Salary
                      </small>

                      <strong>

                        {p.salary ||
                          "Not specified"}

                      </strong>

                    </div>

                  </div>


                  {/* EXPERIENCE */}

                  <div className="info-item">

                    <span className="info-icon">
                      💼
                    </span>

                    <div>

                      <small>
                        Experience
                      </small>

                      <strong>

                        {p.reqExperience !==
                          undefined &&
                        p.reqExperience !==
                          null

                          ? `${p.reqExperience} years`

                          : "Not specified"}

                      </strong>

                    </div>

                  </div>


                  {/* WORKPLACE */}

                  <div className="info-item">

                    <span className="info-icon">
                      📍
                    </span>

                    <div>

                      <small>
                        Workplace
                      </small>

                      <strong>

                        {formatWorkplace(
                          p.workplace
                        )}

                      </strong>

                    </div>

                  </div>


                  {/* JOB TYPE */}

                  <div className="info-item">

                    <span className="info-icon">
                      🕐
                    </span>

                    <div>

                      <small>
                        Job Type
                      </small>

                      <strong>

                        {formatJobType(
                          p.jobType
                        )}

                      </strong>

                    </div>

                  </div>

                </div>


                {/* =========================
                    DESCRIPTION
                ========================= */}

                <div className="job-description-section">

                  <h4>
                    About this role
                  </h4>

                  <p className="job-description">

                    {p.postDesc ||
                      "No description available."}

                  </p>

                </div>


                {/* =========================
                    TECH STACK
                ========================= */}

                <div className="tech-stack-section">

                  <div className="skills-title">

                    TECHNICAL SKILLS

                  </div>


                  {skills.length > 0 ? (

                    <div className="skills-list">

                      {skills.map(
                        (
                          skill,
                          index
                        ) => (

                          <span
                            className="skill-tag"
                            key={index}
                          >

                            {skill}

                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="no-skills">

                      No technical skills specified.

                    </p>

                  )}

                </div>


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="job-actions">


                  {/* VIEW DETAILS */}

                  <button
                    className="details-btn"
                    type="button"
                    onClick={() =>
                      handleViewDetails(
                        p.postId
                      )
                    }
                  >

                    View Details

                    <span>
                      →
                    </span>

                  </button>


                  {/* ADMIN / OWNER */}

                  {canManageJob(p) && (

                    <div className="admin-actions">

                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() =>
                          handleEdit(
                            p.postId
                          )
                        }
                      >

                        Edit

                      </button>


                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() =>
                          handleDelete(
                            p.postId
                          )
                        }
                      >

                        Delete

                      </button>

                    </div>

                  )}

                </div>

              </div>

            );

          })}

      </div>

    </div>

  );

};

export default AllPosts;