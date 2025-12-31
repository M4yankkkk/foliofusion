'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Card, { CardHeader, CardBody } from './ui/Card'
import Button from './ui/Button'
import Input, { Textarea } from './ui/Input'
import Badge from './ui/Badge'

export default function ProfileForm({ initialData = null, userId }) {
  const router = useRouter()
  const supabase = createClient()
  const isEditMode = !!initialData

  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    name: initialData?.name || '',
    title: initialData?.title || '',
    bio: initialData?.bio || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    github: initialData?.github || '',
    linkedin: initialData?.linkedin || '',
    twitter: initialData?.twitter || '',
    university: initialData?.university || '',
    degree: initialData?.degree || '',
    graduation_date: initialData?.graduation_date || '',
    projects: initialData?.projects || [{ name: '', description: '', link: '', tech_stack: '' }],
    skills: initialData?.skills || [],
    experience: initialData?.experience || [{ 
      company: '', 
      role: '', 
      description: '', 
      location: '',
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
      projects: [...formData.projects, { name: '', description: '', link: '', tech_stack: '' }],
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
        location: '',
        startMonthYear: '', 
        endMonthYear: '' 
      }],
    })
  }

  const removeExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index)
    setFormData({ ...formData, experience: newExperience })
  }

  const addSkill = (e) => {
    e?.preventDefault()
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
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .ilike('username', formData.username)
        .neq('id', userId)
        .single()

      if (existingUser) {
        setMessage('Username already taken. Please choose another.')
        setLoading(false)
        return
      }

      const { error: usernameError } = await supabase
        .from('users')
        .update({ username: formData.username.toLowerCase() })
        .eq('id', userId)

      if (usernameError) {
        setMessage(`Error saving username: ${usernameError.message}`)
        setLoading(false)
        return
      }

      const profileData = {
        user_id: userId,
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        university: formData.university,
        degree: formData.degree,
        graduation_date: formData.graduation_date,
        projects: formData.projects,
        skills: formData.skills,
        experience: formData.experience,
        theme: formData.theme,
        custom_color: formData.customColor,
      }

      let error

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('master_profiles')
          .update(profileData)
          .eq('user_id', userId)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('master_profiles')
          .insert([profileData])
        error = insertError
      }

      if (error) {
        setMessage(`Error saving profile: ${error.message}`)
      } else {
        setMessage(`Profile ${isEditMode ? 'updated' : 'created'} successfully!`)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1000)
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`)
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your core profile details</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johnsmith"
              helper="Used in your public profile URL"
              required
            />
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Smith"
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              helper="Used in resume exports"
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              helper="Used in resume exports"
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
            />
            <div className="md:col-span-2">
              <Input
                label="Professional Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Software Engineer | Frontend Specialist"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief professional summary..."
                rows={4}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your academic background</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="University"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Stanford University"
            />
            <Input
              label="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="Bachelor of Science in Computer Science"
            />
            <Input
              label="Graduation Date"
              name="graduation_date"
              value={formData.graduation_date}
              onChange={handleChange}
              placeholder="May 2024"
            />
          </div>
        </CardBody>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
          <p className="text-sm text-gray-500 mt-0.5">Connect your online profiles</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="username"
              prefix={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="username"
              prefix={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
            />
            <Input
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="@username"
              prefix={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>}
            />
          </div>
        </CardBody>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add your technical and soft skills</p>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2 mb-3">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="e.g., React, TypeScript, AWS"
              className="flex-1"
              containerClassName="flex-1"
            />
            <Button type="button" onClick={addSkill} variant="secondary">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} variant="primary" className="pl-3 pr-1 py-1.5 flex items-center gap-1.5">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <p className="text-sm text-gray-500 mt-0.5">Showcase your work</p>
            </div>
            <Button type="button" onClick={addProject} size="sm" variant="outline">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <Input
                    label="Project Name"
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    placeholder="My Awesome Project"
                  />
                  <Input
                    label="Project Link"
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Tech Stack"
                      value={project.tech_stack || ''}
                      onChange={(e) => handleProjectChange(index, 'tech_stack', e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      helper="Comma-separated list of technologies"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      label="Description"
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                      placeholder="Brief description of the project..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
              <p className="text-sm text-gray-500 mt-0.5">Your professional history</p>
            </div>
            <Button type="button" onClick={addExperience} size="sm" variant="outline">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
                {formData.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                  <Input
                    label="Role"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                    placeholder="Software Engineer"
                  />
                  <Input
                    label="Location"
                    value={exp.location || ''}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    placeholder="Remote / San Francisco, CA"
                  />
                  <div></div>
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startMonthYear}
                    onChange={(e) => handleExperienceChange(index, 'startMonthYear', e.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endMonthYear}
                    onChange={(e) => handleExperienceChange(index, 'endMonthYear', e.target.value)}
                    helper="Leave blank if current"
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="Key responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Theme</h2>
          <p className="text-sm text-gray-500 mt-0.5">Customize your profile appearance</p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {Object.entries(themeColors).map(([name, color]) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={name}
                  checked={formData.theme === name}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{name}</span>
                </div>
              </label>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
        <div>
          {message && (
            <div className={`text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </div>
        <Button type="submit" disabled={loading} size="lg">
          {loading ? 'Saving...' : isEditMode ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </form>
  )
}
