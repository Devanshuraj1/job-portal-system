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

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jobData = {
        ...job,
        reqExperience: Number(job.reqExperience),
        postTechStack: job.postTechStack
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await api.post("/jobPost", jobData);

      alert("Job Posted Successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Unable to create job.");
    }
  };

  return (
    <div className="create-page">

      <div className="create-container">

        <div className="create-header">
          <h1>Post a Job</h1>

          <p>
            Create a new job opportunity and find the right candidate.
          </p>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Job Title</label>

            <input
              type="text"
              name="postProfile"
              placeholder="e.g. Java Developer"
              value={job.postProfile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Description</label>

            <textarea
              name="postDesc"
              placeholder="Describe the role, responsibilities and requirements..."
              value={job.postDesc}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label>Required Experience</label>

            <input
              type="number"
              name="reqExperience"
              placeholder="e.g. 2"
              min="0"
              value={job.reqExperience}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Technical Skills</label>

            <input
              type="text"
              name="postTechStack"
              placeholder="Java, Spring Boot, React, SQL"
              value={job.postTechStack}
              onChange={handleChange}
              required
            />

            <small>
              Separate multiple skills using commas.
            </small>
          </div>

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
              className="create-btn"
            >
              Post Job
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Create;