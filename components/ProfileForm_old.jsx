'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProfileForm({ initialData = null, userId }) {
  const router = useRouter()
  const supabase = createClient()
  const isEditMode = !!initialData

  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    name: initialData?.name || '',
    title: initialData?.title || '',
    bio: initialData?.bio || '',
    github: initialData?.github || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    projects: initialData?.projects || [{ name: '', description: '', link: '' }],
    skills: initialData?.skills || [],
    experience: initialData?.experience || [{ 
      company: '', 
      role: '', 
      description: '', 
      startMonthYear: '', 
      endMonthYear: '' 
    }],
    theme: initialData?.theme || 'blue',
    customColor: initialData?.custom_color || '',
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
      // First, check if username is already taken (if changed or new)
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .ilike('username', formData.username)
        .neq('id', userId)
        .single()

      if (existingUser) {
        setMessage('❌ Username already taken. Please choose another.')
        setLoading(false)
        return
      }

      // Update username in users table
      const { error: usernameError } = await supabase
        .from('users')
        .update({ username: formData.username.toLowerCase() })
        .eq('id', userId)

      if (usernameError) {
        console.error(usernameError)
        setMessage(`❌ Error saving username: ${usernameError.message}`)
        setLoading(false)
        return
      }

      const profileData = {
        user_id: userId,
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        projects: formData.projects,
        skills: formData.skills,
        experience: formData.experience,
        theme: formData.theme,
        custom_color: formData.customColor,
      }

      let error

      if (isEditMode) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('master_profiles')
          .update(profileData)
          .eq('user_id', userId)
        error = updateError
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('master_profiles')
          .insert([profileData])
        error = insertError
      }

      if (error) {
        console.error(error)
        setMessage(`❌ Error saving profile: ${error.message}`)
      } else {
        setMessage(`✅ Profile ${isEditMode ? 'updated' : 'created'} successfully!`)
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Basic Info */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username * <span className="text-xs text-gray-500">(used for your public profile URL)</span>
          </label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g., johndoe"
            pattern="[a-z0-9_-]+"
            title="Username can only contain lowercase letters, numbers, hyphens, and underscores"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Social Links */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter URL
            </label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add a skill (press Enter)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            + Add Project
          </button>
        </div>

        <div className="space-y-4">
          {formData.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 relative">
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                  placeholder="Project Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  placeholder="Project Description"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                  placeholder="Project Link (URL)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            + Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 relative">
              {formData.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    placeholder="Role/Position"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  placeholder="Description"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="month"
                    value={exp.startMonthYear}
                    onChange={(e) => handleExperienceChange(index, 'startMonthYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="month"
                    value={exp.endMonthYear}
                    onChange={(e) => handleExperienceChange(index, 'endMonthYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Theme Selection */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Theme</h2>
        
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {Object.entries(themeColors).map(([name, color]) => (
              <button
                key={name}
                type="button"
                onClick={() => setFormData({ ...formData, theme: name })}
                className={`px-4 py-2 rounded-md border-2 ${
                  formData.theme === name
                    ? 'border-gray-900'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color, color: 'white' }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, theme: 'custom' })}
              className={`px-4 py-2 rounded-md border-2 ${
                formData.theme === 'custom'
                  ? 'border-gray-900 bg-gray-100'
                  : 'border-gray-300 bg-white'
              }`}
            >
              Custom
            </button>
          </div>

          {formData.theme === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Color
              </label>
              <input
                type="color"
                name="customColor"
                value={formData.customColor}
                onChange={handleChange}
                className="h-10 w-20"
              />
            </div>
          )}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
        <div>
          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </div>
    </form>
  )
}
