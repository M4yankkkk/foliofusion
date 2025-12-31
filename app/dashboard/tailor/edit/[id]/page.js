import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TailoredProfileForm from '@/components/TailoredProfileForm'
import Button from '@/components/ui/Button'

export default async function EditTailoredResumePage({ params }) {
  const supabase = await createClient()
  const { id } = await params

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

  if (!profile) {
    redirect('/dashboard/profile/create')
  }

  const { data: tailoredResume } = await supabase
    .from('tailored_resumes')
    .select('*')
    .eq('id', id)
    .eq('master_profile_id', profile.id)
    .single()

  if (!tailoredResume) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Edit Tailored Resume</h1>
                <p className="text-xs text-gray-500">{tailoredResume.job_title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TailoredProfileForm 
          tailoredResume={tailoredResume}
          masterProfile={profile} 
          userId={user.id}
        />
      </main>
    </div>
  )
}
