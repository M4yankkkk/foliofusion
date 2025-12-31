'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TailoredProfileForm({ tailoredResume, masterProfile, userId }) {
  const router = useRouter()
  const supabase = createClient()

  // Initialize with tailored content
  const tailoredContent = tailoredResume.tailored_content || {}
  
  const [formData, setFormData] = useState({
    jobTitle: tailoredResume.job_title || '',
    urlSlug: tailoredResume.public_url || '',
    jobDescription: tailoredResume.job_description || '',
    name: masterProfile.name || '',
    title: tailoredContent.title || masterProfile.title || '',
    bio: tailoredContent.bio || masterProfile.bio || '',
    github: masterProfile.github || '',
    linkedin: masterProfile.linkedin || '',
    twitter: masterProfile.twitter || '',
    projects: tailoredContent.projects || masterProfile.projects || [{ name: '', description: '', link: '' }],
    skills: tailoredContent.skills || masterProfile.skills || [],
    experience: tailoredContent.experience || masterProfile.experience || [{ 
      company: '', 
      role: '', 
      description: '', 
      startMonthYear: '', 
      endMonthYear: '' 
    }],
    theme: masterProfile.theme || 'blue',
    customColor: masterProfile.custom_color || '',
  })

  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects]
    newProjects[index][field] = value
    setFormData({ ...formData, projects: newProjects })
  }

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', link: '' }],
    })
  }

  const removeProject = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index)
    setFormData({ ...formData, projects: newProjects })
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience]
    newExperience[index][field] = value
    setFormData({ ...formData, experience: newExperience })
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { 
        company: '', 
        role: '', 
        description: '', 
        startMonthYear: '', 
        endMonthYear: '' 
      }],
    })
  }

  const removeExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index)
    setFormData({ ...formData, experience: newExperience })
  }

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      })
      setSkillInput('')
    }
  }

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index)
    setFormData({ ...formData, skills: newSkills })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Validate URL slug
      if (!/^[a-z0-9-]+$/.test(formData.urlSlug)) {
        setMessage('❌ URL slug can only contain lowercase letters, numbers, and hyphens')
        setLoading(false)
        return
      }

      // Update tailored resume
      const { error } = await supabase
        .from('tailored_resumes')
        .update({
          job_title: formData.jobTitle,
          public_url: formData.urlSlug,
          job_description: formData.jobDescription,
          tailored_content: {
            title: formData.title,
            bio: formData.bio,
            skills: formData.skills,
            experience: formData.experience,
            projects: formData.projects,
            theme: formData.theme,
            custom_color: formData.customColor,
          },
        })
        .eq('id', tailoredResume.id)

      if (error) {
        console.error(error)
        setMessage(`❌ Error updating tailored resume: ${error.message}`)
      } else {
        setMessage('✅ Tailored resume updated successfully!')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      }
    } catch (err) {
      console.error(err)
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const themeColors = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    orange: '#f97316',
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
      {/* Job Details */}
      <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Public URL Slug *
            </label>
            <input
              type="text"
              name="urlSlug"
              required
              value={formData.urlSlug}
              onChange={(e) => setFormData({ ...formData, urlSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
              pattern="[a-z0-9-]+"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Basic Info */}
      <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (from master profile)
            </label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Frontend Developer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSkill()
              }
            }}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-500 hover:to-indigo-500 shadow"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-blue-500 hover:text-blue-700 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
        
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startMonthYear}
                  onChange={(e) => handleExperienceChange(index, 'startMonthYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.endMonthYear}
                  onChange={(e) => handleExperienceChange(index, 'endMonthYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
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
          + Add Experience
        </button>
      </section>

      {/* Projects */}
      <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
        
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link
                </label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                  placeholder="https://"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeProject(index)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
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
          + Add Project
        </button>
      </section>

      {/* Theme Customization */}
      <section className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Theme for This Resume</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a theme
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(themeColors).map(([name, color]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: name, customColor: '' })}
                  className={`flex items-center gap-2 px-4 py-2 border-2 rounded-md transition-all ${
                    formData.theme === name && formData.theme !== 'custom'
                      ? 'border-gray-900 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="capitalize">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or choose a custom color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={formData.customColor || themeColors[formData.theme]}
                onChange={(e) =>
                  setFormData({ ...formData, theme: 'custom', customColor: e.target.value })
                }
                className="h-10 w-20 border border-gray-200 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {formData.theme === 'custom' ? formData.customColor : 'Select to customize'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Submit */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 disabled:bg-gray-300 font-semibold shadow"
        >
          {loading ? 'Saving...' : 'Save Tailored Resume'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
