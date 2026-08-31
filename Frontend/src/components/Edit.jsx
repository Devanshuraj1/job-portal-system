import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Edit.css";

const Edit = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const id = location.state?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [techStackInput, setTechStackInput] = useState("");

    const [form, setForm] = useState({
        postId: "",
        companyName: "",
        postProfile: "",
        postDesc: "",
        reqExperience: "",
        salary: "",
        workplace: "",
        jobType: "",
        postTechStack: [],
        postedBy: ""
    });


    // =====================================================
    // GET JOB
    // =====================================================

    useEffect(() => {

        if (!id) {
            setError("Job ID not found.");
            setLoading(false);
            return;
        }

        const fetchJob = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    `/jobPost/${id}`
                );

                const job = response.data;

                const skills =
                    Array.isArray(job.postTechStack)
                        ? job.postTechStack
                        : [];

                setForm({
                    postId: job.postId,
                    companyName: job.companyName || "",
                    postProfile: job.postProfile || "",
                    postDesc: job.postDesc || "",
                    reqExperience:
                        job.reqExperience ?? "",
                    salary: job.salary || "",
                    workplace: job.workplace || "",
                    jobType: job.jobType || "",
                    postTechStack: skills,
                    postedBy: job.postedBy || ""
                });

                // Existing skills input
                setTechStackInput(
                    skills.join(", ")
                );

            } catch (err) {

                console.error(
                    "GET JOB ERROR:",
                    err
                );

                if (err.response?.status === 403) {

                    setError(
                        "You are not authorized to access this job."
                    );

                } else if (err.response?.status === 401) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else {

                    setError(
                        "Unable to load job."
                    );
                }

            } finally {

                setLoading(false);
            }
        };

        fetchJob();

    }, [id]);


    // =====================================================
    // NORMAL INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // TECH STACK
    // COMMA + SPACE SUPPORT
    // =====================================================

    const handleTechStackChange = (e) => {

        const value = e.target.value;

        setTechStackInput(value);

        /*
         * Examples:
         *
         * Java, Spring Boot, React
         *
         * Java Spring Boot React
         *
         * Java,Spring Boot,React
         *
         * All supported.
         */

        const skills = value
            .split(",")
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        setForm(previous => ({
            ...previous,
            postTechStack: skills
        }));
    };


    // =====================================================
    // UPDATE JOB
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");

        try {

            const updatedJob = {

                postId: Number(form.postId),

                companyName:
                    form.companyName.trim(),

                postProfile:
                    form.postProfile.trim(),

                postDesc:
                    form.postDesc.trim(),

                reqExperience:
                    form.reqExperience === ""
                        ? null
                        : Number(form.reqExperience),

                salary:
                    form.salary.trim(),

                workplace:
                    form.workplace,

                jobType:
                    form.jobType,

                postTechStack:
                    form.postTechStack,

                postedBy:
                    form.postedBy
            };


            console.log(
                "UPDATED JOB:",
                updatedJob
            );


            await api.put(
                "/jobPost",
                updatedJob
            );


            alert(
                "Job updated successfully!"
            );

            navigate("/");

        } catch (err) {

            console.error(
                "UPDATE JOB ERROR:",
                err
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "DATA:",
                err.response?.data
            );


            if (err.response?.status === 403) {

                setError(
                    err.response?.data ||
                    "You are not authorized to edit this job."
                );

            } else if (err.response?.status === 401) {

                setError(
                    "You are not logged in. Please login again."
                );

            } else {

                setError(
                    err.response?.data ||
                    "Failed to update job."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="edit-page">

                <div className="edit-loading">

                    <div className="edit-spinner"></div>

                    <h2>
                        Loading Job...
                    </h2>

                    <p>
                        Please wait while we load the job details.
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && !form.postId) {

        return (

            <div className="edit-page">

                <div className="edit-error-card">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Load Job
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // FORM
    // =====================================================

    return (

        <div className="edit-page">

            <div className="edit-container">

                {/* HEADER */}

                <div className="edit-header">

                    <div>

                        <span className="edit-label">
                            JOB MANAGEMENT
                        </span>

                        <h1>
                            Edit Job Posting
                        </h1>

                        <p>
                            Update the information below to keep
                            your job posting accurate and up to date.
                        </p>

                    </div>

                    <button
                        className="back-btn"
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={saving}
                    >
                        ← Back
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="edit-form-error">

                        <span>⚠</span>

                        {error}

                    </div>

                )}


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="edit-form"
                >

                    {/* BASIC INFORMATION */}

                    <div className="form-section">

                        <div className="section-heading">

                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Enter the basic details of the job.
                            </p>

                        </div>


                        <div className="form-grid">

                            {/* COMPANY */}

                            <div className="form-group">

                                <label>
                                    Company Name
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Google"
                                    required
                                />

                            </div>


                            {/* JOB TITLE */}

                            <div className="form-group">

                                <label>
                                    Job Title
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="postProfile"
                                    value={form.postProfile}
                                    onChange={handleChange}
                                    placeholder="e.g. Python Developer"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-section">

                        <div className="section-heading">

                            <h2>
                                Job Description
                            </h2>

                            <p>
                                Describe the responsibilities and requirements.
                            </p>

                        </div>


                        <div className="form-group">

                            <label>
                                Description
                                <span>*</span>
                            </label>

                            <textarea
                                name="postDesc"
                                value={form.postDesc}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Write a detailed description of the role..."
                                required
                            />

                        </div>

                    </div>


                    {/* JOB DETAILS */}

                    <div className="form-section">

                        <div className="section-heading">

                            <h2>
                                Job Details
                            </h2>

                            <p>
                                Specify salary, experience and working conditions.
                            </p>

                        </div>


                        <div className="form-grid">


                            {/* EXPERIENCE */}

                            <div className="form-group">

                                <label>
                                    Required Experience
                                </label>

                                <input
                                    type="number"
                                    name="reqExperience"
                                    value={form.reqExperience}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="e.g. 2"
                                />

                            </div>


                            {/* SALARY */}

                            <div className="form-group">

                                <label>
                                    Salary
                                </label>

                                <input
                                    type="text"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. ₹8 - ₹12 LPA"
                                />

                            </div>


                            {/* WORKPLACE */}

                            <div className="form-group">

                                <label>
                                    Workplace
                                </label>

                                <select
                                    name="workplace"
                                    value={form.workplace}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Workplace
                                    </option>

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


                            {/* JOB TYPE */}

                            <div className="form-group">

                                <label>
                                    Job Type
                                </label>

                                <select
                                    name="jobType"
                                    value={form.jobType}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Job Type
                                    </option>

                                    <option value="FULL_TIME">
                                        Full Time
                                    </option>

                                    <option value="INTERNSHIP">
                                        Internship
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* TECH STACK */}

                    <div className="form-section">

                        <div className="section-heading">

                            <h2>
                                Technical Skills
                            </h2>

                            <p>
                                Add the technologies required for this role.
                            </p>

                        </div>


                        <div className="form-group">

                            <label>
                                Tech Stack
                            </label>

                            <input
                                type="text"
                                value={techStackInput}
                                onChange={handleTechStackChange}
                                placeholder="Java, Spring Boot, React, PostgreSQL"
                            />

                            <div className="input-help">
                                Separate skills using commas.
                                Example: Java, Spring Boot, React
                            </div>


                            {/* SKILL PREVIEW */}

                            {form.postTechStack.length > 0 && (

                                <div className="skill-preview">

                                    {form.postTechStack.map(
                                        (skill, index) => (

                                            <span
                                                className="skill-chip"
                                                key={index}
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* POSTED BY */}

                    <div className="form-section posted-section">

                        <div className="section-heading">

                            <h2>
                                Job Owner
                            </h2>

                            <p>
                                This job is currently posted by.
                            </p>

                        </div>


                        <div className="owner-display">

                            <div className="owner-avatar">

                                {form.postedBy
                                    ? form.postedBy
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}

                            </div>

                            <div>

                                <span>
                                    Posted By
                                </span>

                                <strong>
                                    {form.postedBy ||
                                        "JobPortal"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="edit-actions">

                        <button
                            className="cancel-btn"
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            className="update-btn"
                            type="submit"
                            disabled={saving}
                        >

                            {saving ? (

                                <>
                                    <span className="button-spinner"></span>
                                    Updating...
                                </>

                            ) : (

                                <>
                                    Save Changes
                                    <span>→</span>
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Edit;