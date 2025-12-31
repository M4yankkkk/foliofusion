import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import DeleteResumeButton from '@/components/DeleteResumeButton'
import DownloadResumeButton from '@/components/DownloadResumeButton'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('master_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: userData } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single()

  const { data: tailoredResumes } = await supabase
    .from('tailored_resumes')
    .select('*')
    .eq('master_profile_id', profile?.id || '')
    .order('created_at', { ascending: false })

  const publicProfileUrl = userData ? `/profile/${userData.username}` : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">FolioFusion</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardBody className="py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                  <p className="text-gray-600 mt-1">
                    Manage your master profile and create tailored resumes
                  </p>
                </div>
                {profile && (
                  <Link href="/dashboard/tailor">
                    <Button size="lg" className="whitespace-nowrap">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Tailored Resume
                    </Button>
                  </Link>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Master Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Master Profile</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Your base resume</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </CardHeader>

              <CardBody>
                {profile ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</p>
                      <p className="text-sm text-gray-900 font-medium mt-1">{profile.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</p>
                      <p className="text-sm text-gray-900 mt-1">{profile.title || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Theme</p>
                      <Badge variant="primary" className="mt-1">{profile.theme}</Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href="/dashboard/profile/edit" className="flex-1">
                        <Button variant="primary" className="w-full">Edit</Button>
                      </Link>
                      {publicProfileUrl && (
                        <Link href={publicProfileUrl} target="_blank" className="flex-1">
                          <Button variant="outline" className="w-full">View Public</Button>
                        </Link>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <DownloadResumeButton type="master" variant="outline" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-4">No master profile yet</p>
                    <Link href="/dashboard/profile/create">
                      <Button>Create Master Profile</Button>
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Tailored Resumes Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tailored Resumes</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {tailoredResumes?.length || 0} tailored {tailoredResumes?.length === 1 ? 'resume' : 'resumes'}
                    </p>
                  </div>
                  {profile && (
                    <Link href="/dashboard/tailor">
                      <Button size="sm">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>

              <CardBody>
                {tailoredResumes && tailoredResumes.length > 0 ? (
                  <div className="space-y-3">
                    {tailoredResumes.map((resume) => {
                      const scoreColor = resume.match_score >= 80 ? 'success' : resume.match_score >= 60 ? 'warning' : 'danger'
                      const scoreLabel = resume.match_score >= 85 ? 'Excellent' : resume.match_score >= 65 ? 'Good' : 'Needs Work'
                      
                      return (
                        <div key={resume.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">{resume.job_title}</h4>
                                <Badge variant={scoreColor}>{resume.match_score}%</Badge>
                              </div>
                              {resume.public_url && (
                                <p className="text-xs text-gray-500 truncate">
                                  /profile/{userData.username}/{resume.public_url}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                Created {new Date(resume.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <DownloadResumeButton resumeId={resume.id} type="tailored" variant="ghost" />
                              <Link href={`/dashboard/tailor/edit/${resume.id}`}>
                                <Button size="sm" variant="outline">Edit</Button>
                              </Link>
                              {resume.public_url && (
                                <Link href={`/profile/${userData.username}/${resume.public_url}`} target="_blank">
                                  <Button size="sm" variant="ghost">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </Button>
                                </Link>
                              )}
                              <DeleteResumeButton resumeId={resume.id} jobTitle={resume.job_title} />
                            </div>
                          </div>

                          {/* Match Score Bar */}
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Match Quality</span>
                              <span className="font-medium">{scoreLabel}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  resume.match_score >= 80 ? 'bg-green-500' : 
                                  resume.match_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${resume.match_score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-1">No tailored resumes yet</p>
                    <p className="text-sm text-gray-500 mb-4">Create your first tailored resume for a specific job</p>
                    {profile && (
                      <Link href="/dashboard/tailor">
                        <Button>Create Tailored Resume</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
