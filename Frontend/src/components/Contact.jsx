import React, { useState } from "react";
import "./Contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus("Message sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    subject: "General Inquiry",
                    message: ""
                });
            } else {
                setStatus("Unable to send message. Please try again.");
            }
        } catch (error) {
            setStatus("Server error. Please try again later.");
        }
    };

    return (
        <div className="contact-page">

            <div className="contact-container">

                <div className="contact-header">
                    <h1>Feedback & Support</h1>

                    <p>
                        We'd love to hear from you. Have feedback, found an issue,
                        or need help? Send us a message and we'll get back to you.
                    </p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>

                    <label>Your Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />

                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label>Subject</label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                    >
                        <option>Feedback</option>
                        <option>Report an Issue</option>
                        <option>General Inquiry</option>
                        <option>Other</option>
                    </select>

                    <label>Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message..."
                        rows="6"
                        required
                    />

                    <button type="submit">
                        Send Message
                    </button>

                    {status && (
                        <p className="contact-status">
                            {status}
                        </p>
                    )}

                </form>

            </div>

        </div>
    );
}

export default Contact;
