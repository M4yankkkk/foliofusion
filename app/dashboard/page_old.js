import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import TailoredResumesList from '@/components/TailoredResumesList'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's master profile
  const { data: profile } = await supabase
    .from('master_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get username from users table
  const { data: userData } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .single()

  // Fetch tailored resumes for this user
  const { data: tailoredResumes } = await supabase
    .from('tailored_resumes')
    .select('*')
    .eq('master_profile_id', profile?.id || '')
    .order('created_at', { ascending: false })

  const publicProfileUrl = userData ? `/profile/${userData.username}` : null

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-gray-900">
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/90 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="space-y-0.5">
              <p className="text-xs uppercase tracking-[0.08em] text-gray-500">Dashboard</p>
              <h1 className="text-xl font-bold">FolioFusion</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-gray-500">Welcome back</p>
              <h2 className="text-2xl font-bold">Manage your master and tailored resumes</h2>
            </div>
            {profile && (
              <a
                href="/dashboard/tailor"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-500 hover:to-indigo-500"
              >
                + New Tailored Resume
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
          {/* Master Profile Card */}
          <div className="xl:col-span-1 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Master Profile</h3>
                <p className="text-sm text-gray-500">Your source of truth</p>
              </div>
              {profile && (
                <div className="flex gap-2">
                  {publicProfileUrl && (
                    <a
                      href={publicProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      View Public
                    </a>
                  )}
                  <a
                    href="/dashboard/profile/edit"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit
                  </a>
                </div>
              )}
            </div>

            {profile ? (
              <div className="space-y-3 text-sm divide-y divide-gray-100">
                <div className="flex items-center justify-between pb-2">
                  <span className="font-semibold text-gray-600">Name</span>
                  <span className="text-gray-900">{profile.name}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold text-gray-600">Title</span>
                  <span className="text-gray-900">{profile.title || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-semibold text-gray-600">Theme</span>
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    {profile.theme}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">You haven't created your master profile yet.</p>
                <a
                  href="/dashboard/profile/create"
                  className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Create Master Profile
                </a>
              </div>
            )}
          </div>

          {/* Tailored Resumes Section */}
          <div className="xl:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-start mb-4 gap-3">
              <div>
                <h3 className="text-lg font-semibold">Tailored Resumes</h3>
                <p className="text-sm text-gray-500">Optimized for specific roles</p>
              </div>
              {profile && (
                <a
                  href="/dashboard/tailor"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold shadow hover:from-green-500 hover:to-emerald-500"
                >
                  + Create Tailored Resume
                </a>
              )}
            </div>

            <TailoredResumesList resumes={tailoredResumes} username={userData?.username} />
          </div>
        </div>
      </main>
    </div>
  )
}
