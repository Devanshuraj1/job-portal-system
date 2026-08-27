import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Create.css";

function Create() {

  const navigate = useNavigate();

  const [job, setJob] = useState({
    postProfile: "",
    postDesc: "",
    reqExperience: "",
    postTechStack: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
  };


  // =========================
  // CREATE JOB
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage("");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // =========================
    // LOGIN CHECK
    // =========================

    if (!token) {

      navigate("/login");

      return;
    }


    // =========================
    // ROLE CHECK
    // =========================

    if (
      role !== "RECRUITER" &&
      role !== "ADMIN"
    ) {

      setErrorMessage(
        "Only recruiters and admins can post jobs."
      );

      return;
    }


    // =========================
    // VALIDATION
    // =========================

    if (
      !job.postProfile.trim() ||
      !job.postDesc.trim() ||
      !job.reqExperience ||
      !job.postTechStack.trim()
    ) {

      setErrorMessage(
        "Please fill all required fields."
      );

      return;
    }


    try {

      setLoading(true);


      // =========================
      // PREPARE DATA
      // =========================

      const jobData = {

        postProfile:
          job.postProfile.trim(),

        postDesc:
          job.postDesc.trim(),

        reqExperience:
          Number(job.reqExperience),

        postTechStack:
          job.postTechStack
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0),

      };


      // =========================
      // API REQUEST
      // =========================

      const response = await api.post(
        "/jobPost",
        jobData
      );


      console.log(
        "Job Created:",
        response.data
      );


      // =========================
      // SUCCESS
      // =========================

      alert(
        "Job posted successfully!"
      );

      navigate("/");


    } catch (error) {

      console.error(
        "Create Job Error:",
        error
      );


      // =========================
      // BACKEND ERROR
      // =========================

      if (error.response) {

        if (
          typeof error.response.data ===
          "string"
        ) {

          setErrorMessage(
            error.response.data
          );

        } else {

          setErrorMessage(
            "Unable to create job."
          );
        }

      } else {

        setErrorMessage(
          "Server error. Please try again."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="create-page">

      <div className="create-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="create-header">

          <div>

            <p className="create-label">
              JOB MANAGEMENT
            </p>

            <h1>
              Post a new job
            </h1>

            <p className="create-subtitle">
              Create a job opportunity and find the
              right candidate for your organization.
            </p>

          </div>

        </div>


        {/* =========================
            FORM CARD
        ========================= */}

        <div className="create-card">

          <form onSubmit={handleSubmit}>


            {/* ERROR */}

            {errorMessage && (

              <div className="create-error">
                {errorMessage}
              </div>

            )}


            {/* =========================
                JOB TITLE
            ========================= */}

            <div className="create-field">

              <label htmlFor="postProfile">
                Job Title
              </label>

              <input
                id="postProfile"
                type="text"
                name="postProfile"
                placeholder="e.g. Java Backend Developer"
                value={job.postProfile}
                onChange={handleChange}
              />

            </div>


            {/* =========================
                DESCRIPTION
            ========================= */}

            <div className="create-field">

              <label htmlFor="postDesc">
                Job Description
              </label>

              <textarea
                id="postDesc"
                name="postDesc"
                placeholder="Describe the role, responsibilities and requirements..."
                value={job.postDesc}
                onChange={handleChange}
                rows="6"
              />

            </div>


            {/* =========================
                EXPERIENCE
            ========================= */}

            <div className="create-field">

              <label htmlFor="reqExperience">
                Required Experience
              </label>

              <input
                id="reqExperience"
                type="number"
                name="reqExperience"
                placeholder="e.g. 2"
                min="0"
                value={job.reqExperience}
                onChange={handleChange}
              />

              <small>
                Enter required experience in years.
              </small>

            </div>


            {/* =========================
                TECH STACK
            ========================= */}

            <div className="create-field">

              <label htmlFor="postTechStack">
                Technical Skills
              </label>

              <input
                id="postTechStack"
                type="text"
                name="postTechStack"
                placeholder="Java, Spring Boot, PostgreSQL, Docker"
                value={job.postTechStack}
                onChange={handleChange}
              />

              <small>
                Separate multiple skills using commas.
              </small>

            </div>


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="create-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-submit-btn"
                disabled={loading}
              >

                {loading
                  ? "Posting Job..."
                  : "Post Job"}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Create;