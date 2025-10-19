"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
// import "./PortfolioForm.css"; // Import the CSS file

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PortfolioForm() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
    projects: [{ name: "", description: "", link: "" }],
    skills: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", description: "", link: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("portfolios").insert([
      {
        username: formData.username,
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        projects: formData.projects,
        skills: formData.skills.split(",").map((s) => s.trim()),
        experience: formData.experience,
      },
    ]);

    setLoading(false);
    if (error) {
      console.error(error);
      setMessage("❌ Error saving portfolio.");
    } else {
      setMessage("✅ Portfolio created successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Basic Information */}
      <section>
        <h2>Basic Information</h2>
        <p>Let's start with the essentials. You can add more details later.</p>

        <div className="grid-2">
          <div>
            <label>Username *</label>
            <div className="input-group">
              <span className="input-prefix">foliofusion.com/profile/</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="johndoe"
              />
            </div>
            <p className="helper-text">This will be your unique portfolio URL.</p>
          </div>

          <div>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div>
            <label>Professional Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Full Stack Developer"
            />
          </div>

          <div className="full-width">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your passion for development..."
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section>
        <h2>Social Links</h2>
        <p>Add your developer profiles below.</p>

        <div className="grid-2">
          <div>
            <label>GitHub</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label>Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        <p>Showcase your best work. Add project name, short description, and link.</p>

        {formData.projects.map((project, index) => (
          <div key={index} className="project-card">
            <input
              type="text"
              placeholder="Project Name"
              value={project.name}
              onChange={(e) =>
                handleProjectChange(index, "name", e.target.value)
              }
            />
            <textarea
              placeholder="Short Description"
              rows={2}
              value={project.description}
              onChange={(e) =>
                handleProjectChange(index, "description", e.target.value)
              }
            />
            <input
              type="url"
              placeholder="Project Link"
              value={project.link}
              onChange={(e) =>
                handleProjectChange(index, "link", e.target.value)
              }
            />
          </div>
        ))}
        <button type="button" onClick={addProject} className="add-project-btn">
          + Add Another Project
        </button>
      </section>

      {/* Skills */}
      <section>
        <h2>Skills & Technologies</h2>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, TypeScript, Docker"
        />
      </section>

      {/* Experience */}
      <section>
        <h2>Experience</h2>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Share your professional experience..."
          rows={4}
        />
      </section>

      {/* Submit */}
      <div className="submit-section">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Portfolio"}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </form>
  );
}
