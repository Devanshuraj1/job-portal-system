import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Edit.css";

function Edit() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state?.id;

  const [job, setJob] = useState({
    postProfile: "",
    postDesc: "",
    reqExperience: "",
    postTechStack: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing job
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobPost/${id}`);

        const data = response.data;

        setJob({
          postProfile: data.postProfile || "",
          postDesc: data.postDesc || "",
          reqExperience: data.reqExperience ?? "",
          postTechStack: Array.isArray(data.postTechStack)
            ? data.postTechStack.join(", ")
            : "",
        });
      } catch (error) {
        console.error("Error loading job:", error);
        alert("Unable to load job.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // Update job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedJob = {
        postId: Number(id),
        postProfile: job.postProfile,
        postDesc: job.postDesc,
        reqExperience: Number(job.reqExperience),
        postTechStack: job.postTechStack
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      console.log("Updating job:", updatedJob);

      // Backend endpoint is PUT /jobPost
      await api.put("/jobPost", updatedJob);

      alert("Job Updated Successfully!");

      navigate("/");
    } catch (error) {
      console.error("Update error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);
      }

      alert("Unable to update job.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="edit-loading">
        Loading job...
      </div>
    );
  }

  // Invalid ID
  if (!id) {
    return (
      <div className="edit-loading">
        <h2>Invalid Job</h2>

        <button onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="edit-page">

      <div className="edit-container">

        <div className="edit-header">
          <h1>Edit Job</h1>

          <p>
            Update the job information and keep the listing accurate.
          </p>
        </div>

        <form
          className="edit-form"
          onSubmit={handleSubmit}
        >

          {/* Job Title */}
          <div className="edit-form-group">
            <label>Job Title</label>

            <input
              type="text"
              name="postProfile"
              value={job.postProfile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="edit-form-group">
            <label>Job Description</label>

            <textarea
              name="postDesc"
              value={job.postDesc}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          {/* Experience */}
          <div className="edit-form-group">
            <label>Required Experience</label>

            <input
              type="number"
              name="reqExperience"
              min="0"
              value={job.reqExperience}
              onChange={handleChange}
              required
            />
          </div>

          {/* Skills */}
          <div className="edit-form-group">
            <label>Technical Skills</label>

            <input
              type="text"
              name="postTechStack"
              value={job.postTechStack}
              onChange={handleChange}
              placeholder="Java, Spring Boot, React, SQL"
              required
            />

            <small>
              Separate multiple skills using commas.
            </small>
          </div>

          {/* Buttons */}
          <div className="edit-actions">

            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
            >
              Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Edit;