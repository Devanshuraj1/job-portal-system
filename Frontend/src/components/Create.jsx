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
    companyName: "",
    salary: "",
    workplace: "REMOTE",
    jobType: "FULL_TIME",
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
      !job.postTechStack.trim() ||
      !job.companyName.trim() ||
      !job.salary.trim() ||
      !job.workplace ||
      !job.jobType
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
            .filter(
              (skill) => skill.length > 0
            ),

        companyName:
          job.companyName.trim(),

        salary:
          job.salary.trim(),

        workplace:
          job.workplace,

        jobType:
          job.jobType,

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


            {/* =========================
                ERROR
            ========================= */}

            {errorMessage && (

              <div className="create-error">
                {errorMessage}
              </div>

            )}


            {/* =========================
                COMPANY NAME
            ========================= */}

            <div className="create-field">

              <label htmlFor="companyName">
                Company Name
              </label>

              <input
                id="companyName"
                type="text"
                name="companyName"
                placeholder="e.g. Google, Microsoft, Infosys"
                value={job.companyName}
                onChange={handleChange}
                required
              />

            </div>


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
                required
              />

            </div>


            {/* =========================
                JOB TYPE + WORKPLACE
            ========================= */}

            <div className="create-form-row">


              {/* JOB TYPE */}

              <div className="create-field">

                <label htmlFor="jobType">
                  Job Type
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                >

                  <option value="FULL_TIME">
                    Full Time
                  </option>

                  <option value="INTERNSHIP">
                    Internship
                  </option>

                </select>

              </div>


              {/* WORKPLACE */}

              <div className="create-field">

                <label htmlFor="workplace">
                  Workplace
                </label>

                <select
                  id="workplace"
                  name="workplace"
                  value={job.workplace}
                  onChange={handleChange}
                >

                  <option value="REMOTE">
                    Remote
                  </option>

                  <option value="ON_SITE">
                    On-site
                  </option>

                  <option value="HYBRID">
                    Hybrid
                  </option>

                </select>

              </div>

            </div>


            {/* =========================
                SALARY + EXPERIENCE
            ========================= */}

            <div className="create-form-row">


              {/* SALARY */}

              <div className="create-field">

                <label htmlFor="salary">
                  Salary
                </label>

                <input
                  id="salary"
                  type="text"
                  name="salary"
                  placeholder="e.g. ₹8-12 LPA"
                  value={job.salary}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* EXPERIENCE */}

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
                  required
                />

                <small>
                  Enter experience in years.
                </small>

              </div>

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
                placeholder="Describe the role, responsibilities, requirements and qualifications..."
                value={job.postDesc}
                onChange={handleChange}
                rows="7"
                required
              />

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
                required
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