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
    experience: [{ company: "", role: "", description: "", startMonthYear: "", endMonthYear: "" }],
    theme: "blue",
    customColor: "",
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

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: "", role: "", description: "", startMonthYear: "", endMonthYear: "" }],
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
          theme: formData.theme,
        customColor: formData.customColor,
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
      {/* Basic Information */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          <p className="text-sm text-gray-600">Let's start with the essentials. You can add more details later.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <span className="text-xs text-gray-500 mr-2">foliofusion.vercel.app/profile/</span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="johndoe"
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">This will be your unique portfolio URL.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Full Stack Developer"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your passion for development..."
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
          <p className="text-sm text-gray-600">Add your developer profiles below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Featured Projects</h2>
          <p className="text-sm text-gray-600">Showcase your best work.</p>
        </div>

        <div className="space-y-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-3">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) =>
                  handleProjectChange(index, "name", e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Short Description"
                rows={2}
                value={project.description}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Project Link"
                value={project.link}
                onChange={(e) =>
                  handleProjectChange(index, "link", e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.projects.filter((_, i) => i !== index)
                  setFormData({ ...formData, projects: updated })
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove Project
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
          >
            + Add Another Project
          </button>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Skills & Technologies</h2>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="React, Node.js, TypeScript, Docker"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>

      {/* Experience */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
          <p className="text-sm text-gray-600">Share your professional experience.</p>
        </div>

        <div className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-3">
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                rows={2}
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="month"
                  value={exp.startMonthYear}
                  onChange={(e) => handleExperienceChange(index, "startMonthYear", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  value={exp.endMonthYear}
                  onChange={(e) => handleExperienceChange(index, "endMonthYear", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = formData.experience.filter((_, i) => i !== index)
                  setFormData({ ...formData, experience: updated })
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove Experience
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
          >
            + Add Another Experience
          </button>
        </div>
      </section>

      {/* Theme */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Theme</h2>
          <p className="text-sm text-gray-600">Choose an accent color for your profile page.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['blue','green','purple','red','orange','custom'].map((theme) => (
            <label key={theme} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer text-sm">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={formData.theme === theme}
                onChange={handleChange}
              />
              <span className="capitalize">{theme}</span>
            </label>
          ))}
          {formData.theme === "custom" && (
            <input
              type="color"
              value={formData.customColor || "#3b82f6"}
              onChange={(e) => setFormData({ ...formData, customColor: e.target.value })}
              className="h-10 w-20 border border-gray-200 rounded cursor-pointer"
            />
          )}
        </div>
      </section>

      {/* Submit */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 shadow hover:from-blue-500 hover:to-indigo-500 disabled:bg-gray-300"
        >
          {loading ? "Saving..." : "Create Portfolio"}
        </button>
        {message && (
          <p className={`text-sm font-medium ${message.includes('✅') ? 'text-green-700' : 'text-red-700'}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
