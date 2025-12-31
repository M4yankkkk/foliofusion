'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ScoreGauge from './ScoreGauge'

export default function TailorForm({ masterProfile, userId, initialData = null, isEditMode = false }) {
  const router = useRouter()
  const supabase = createClient()

  const [jobDescription, setJobDescription] = useState(initialData?.job_description || '')
  const [loading, setLoading] = useState(false)
  const [tailoredContent, setTailoredContent] = useState(initialData?.tailored_content || null)
  const [matchScores, setMatchScores] = useState(
    initialData?.match_score 
      ? { overall: initialData.match_score, skillsMatch: 0, experienceMatch: 0, keywordsCoverage: 0 }
      : null
  )
  const [error, setError] = useState('')
  const [jobTitle, setJobTitle] = useState(initialData?.job_title || '')
  const [urlSlug, setUrlSlug] = useState(initialData?.public_url || '')

  const handleTailor = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!jobDescription.trim() || !jobTitle.trim() || !urlSlug.trim()) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Validate URL slug
      if (!/^[a-z0-9-]+$/.test(urlSlug)) {
        setError('URL slug can only contain lowercase letters, numbers, and hyphens')
        setLoading(false)
        return
      }

      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterProfile,
          jobDescription: jobDescription.trim(),
          jobTitle: jobTitle.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to tailor resume')
      }

      const data = await response.json()
      setTailoredContent(data.tailoredProfile)
      setMatchScores(data.matchScores)
    } catch (err) {
      console.error('Tailor error:', err)
      setError(err.message || 'Error tailoring resume')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!tailoredContent || !matchScores) return

    setLoading(true)
    setError('')

    try {
      // Validate data
      if (!masterProfile.id) {
        throw new Error('Master profile ID missing')
      }

      const saveData = {
        master_profile_id: masterProfile.id,
        job_title: jobTitle,
        job_description: jobDescription,
        tailored_content: tailoredContent,
        match_score: matchScores.overall,
        public_url: urlSlug,
      }

      console.log('Saving tailored resume:', saveData)

      let data, saveError

      if (isEditMode && initialData?.id) {
        // Update existing resume
        const result = await supabase
          .from('tailored_resumes')
          .update(saveData)
          .eq('id', initialData.id)
          .select()
        
        data = result.data
        saveError = result.error
      } else {
        // Insert new resume
        const result = await supabase
          .from('tailored_resumes')
          .insert(saveData)
          .select()
        
        data = result.data
        saveError = result.error
      }

      if (saveError) {
        console.error('Save error:', saveError)
        throw saveError
      }

      console.log('Tailored resume saved:', data)
      setError('')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 500)
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message || 'Error saving tailored resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleTailor} className="space-y-6">
      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Column 1: Master Profile Preview */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Master Profile</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
              <p className="text-sm font-medium text-gray-900">{masterProfile.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Title</p>
              <p className="text-sm text-gray-700">{masterProfile.title || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Bio</p>
              <p className="text-sm text-gray-700 line-clamp-3">{masterProfile.bio || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Skills</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {masterProfile.skills?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {masterProfile.skills?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{masterProfile.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Job Description Input & Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Public URL Slug *
            </label>
            <input
              type="text"
              required
              value={urlSlug}
              onChange={(e) => setUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g., frontend-engineer-2025"
              pattern="[a-z0-9-]+"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be your resume URL: /profile/username/{urlSlug || 'your-slug'}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
              Job Description *
            </label>
            <textarea
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !jobDescription.trim() || !jobTitle.trim() || !urlSlug.trim()}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 disabled:bg-gray-300 font-semibold text-sm shadow"
            >
              {loading ? 'Analyzing...' : 'Analyze & Tailor'}
            </button>
          </div>
        </div>

        {/* Column 3: Tailored Result Preview */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-6">
          {tailoredContent ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Tailored Resume</h3>

              {/* Match Score Display */}
              {matchScores && (
                <div className="pb-4 border-b">
                  <ScoreGauge scores={matchScores} />
                </div>
              )}

              {/* Full Tailored Details */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{masterProfile.name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Professional Title</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {tailoredContent.title || masterProfile.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Tailored Bio</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {tailoredContent.bio || masterProfile.bio}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Top Skills</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tailoredContent.skills?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {tailoredContent.experience && tailoredContent.experience.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Experience</p>
                    <div className="mt-2 space-y-2">
                      {tailoredContent.experience.map((exp, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium text-gray-900">{exp.role}</p>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tailoredContent.projects && tailoredContent.projects.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Projects</p>
                    <div className="mt-2 space-y-2">
                      {tailoredContent.projects.map((proj, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium text-gray-900">{proj.name}</p>
                          <p className="text-gray-600 text-xs">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-500 hover:to-green-500 disabled:bg-gray-300 font-semibold text-sm shadow"
              >
                {loading ? 'Saving...' : 'Save Tailored Resume'}
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">
                Enter a job description and click "Analyze & Tailor" to see your customized resume here
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
