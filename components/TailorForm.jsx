'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Card, { CardHeader, CardBody } from './ui/Card'
import Button from './ui/Button'
import Input, { Textarea } from './ui/Input'
import Badge from './ui/Badge'

export default function TailorForm({ masterProfile, userId, initialData = null, isEditMode = false }) {
  const router = useRouter()
  const supabase = createClient()

  const [jobDescription, setJobDescription] = useState(initialData?.job_description || '')
  const [loading, setLoading] = useState(false)
  const [tailoredContent, setTailoredContent] = useState(initialData?.tailored_content || null)
  const [matchScore, setMatchScore] = useState(initialData?.match_score || null)
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
      setMatchScore(data.matchScores?.overall || 0)
    } catch (err) {
      console.error('Tailor error:', err)
      setError(err.message || 'Error tailoring resume')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!tailoredContent || !matchScore) return

    setLoading(true)
    setError('')

    try {
      if (!masterProfile.id) {
        throw new Error('Master profile ID missing')
      }

      const saveData = {
        master_profile_id: masterProfile.id,
        job_title: jobTitle,
        job_description: jobDescription,
        tailored_content: tailoredContent,
        match_score: matchScore,
        public_url: urlSlug,
      }

      let data, saveError

      if (isEditMode && initialData?.id) {
        const result = await supabase
          .from('tailored_resumes')
          .update(saveData)
          .eq('id', initialData.id)
          .select()
        
        data = result.data
        saveError = result.error
      } else {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel: Input Form */}
      <div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
            <p className="text-sm text-gray-500 mt-0.5">Enter the role and description</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleTailor} className="space-y-4">
              <Input
                label="Job Title"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Engineer"
                helper="The position you're applying for"
              />

              <Input
                label="Public URL Slug"
                required
                value={urlSlug}
                onChange={(e) => setUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g., frontend-engineer-google"
                helper={`Will be: /profile/username/${urlSlug || 'your-slug'}`}
              />

              <Textarea
                label="Job Description"
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                helper="Include requirements, responsibilities, and qualifications"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !jobDescription.trim() || !jobTitle.trim() || !urlSlug.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze & Tailor with AI
                  </>
                )}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Master Profile Reference */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-sm font-semibold text-gray-700">Master Profile Reference</h3>
          </CardHeader>
          <CardBody className="py-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500 font-medium">Name</p>
                <p className="text-gray-900">{masterProfile.name}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Title</p>
                <p className="text-gray-900">{masterProfile.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 font-medium mb-1">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {masterProfile.skills?.slice(0, 6).map((skill, idx) => (
                    <Badge key={idx} variant="default" className="text-xs">{skill}</Badge>
                  ))}
                  {masterProfile.skills?.length > 6 && (
                    <Badge variant="default">+{masterProfile.skills.length - 6}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right Panel: Preview */}
      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tailored Resume</h3>
                <p className="text-sm text-gray-500 mt-0.5">AI-optimized preview</p>
              </div>
              {matchScore && (
                <Badge variant={matchScore >= 80 ? 'success' : matchScore >= 60 ? 'warning' : 'danger'} className="text-base px-3 py-1">
                  {matchScore}%
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardBody>
            {tailoredContent ? (
              <div className="space-y-6">
                {/* Match Score Visualization */}
                {matchScore && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Match Quality</span>
                      <span className="font-semibold text-gray-900">
                        {matchScore >= 85 ? 'Excellent' : matchScore >= 65 ? 'Good' : 'Needs Work'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          matchScore >= 80 ? 'bg-green-500' : 
                          matchScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tailored Content */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {tailoredContent.title || masterProfile.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</p>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                      {tailoredContent.bio || masterProfile.bio}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tailoredContent.skills?.map((skill, idx) => (
                        <Badge key={idx} variant="success">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {tailoredContent.experience && tailoredContent.experience.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Experience</p>
                      <div className="space-y-3">
                        {tailoredContent.experience.map((exp, idx) => (
                          <div key={idx} className="border-l-2 border-blue-200 pl-3">
                            <p className="text-sm font-semibold text-gray-900">{exp.role}</p>
                            <p className="text-xs text-gray-600">{exp.company}</p>
                            {exp.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tailoredContent.projects && tailoredContent.projects.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Projects</p>
                      <div className="space-y-2">
                        {tailoredContent.projects.map((proj, idx) => (
                          <div key={idx}>
                            <p className="text-sm font-semibold text-gray-900">{proj.name}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  variant="success"
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Saving...' : 'Save Tailored Resume'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-sm">
                  Fill in the job details and click<br />"Analyze & Tailor" to see your<br />optimized resume here
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
