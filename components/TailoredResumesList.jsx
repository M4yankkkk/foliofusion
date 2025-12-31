'use client'

import Link from 'next/link'

export default function TailoredResumesList({ resumes, username }) {
  if (!resumes || resumes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tailored resumes yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => {
        const barColor = resume.match_score >= 80 ? 'bg-green-500' : resume.match_score >= 60 ? 'bg-amber-500' : 'bg-red-500'
        const bgTint = resume.match_score >= 80 ? 'bg-green-50' : resume.match_score >= 60 ? 'bg-amber-50' : 'bg-red-50'

        return (
          <div
            key={resume.id}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white/90 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${barColor}`} />
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900 text-base leading-tight truncate">{resume.job_title}</h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 shrink-0">
                      {new Date(resume.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {resume.public_url && (
                    <p className="text-xs text-blue-600 truncate">/profile/{username}/{resume.public_url}</p>
                  )}
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${bgTint} text-gray-900 min-w-[88px] text-center`}> 
                  {resume.match_score >= 85 ? 'Great fit' : resume.match_score >= 65 ? 'Good fit' : 'Needs work'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Match</span>
                  <span className="font-semibold text-gray-900">{resume.match_score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full ${barColor} transition-all`} style={{ width: `${resume.match_score}%` }} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/tailor/edit/${resume.id}`}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Edit
                </Link>
                {resume.public_url && (
                  <Link
                    href={`/profile/${username}/${resume.public_url}`}
                    target="_blank"
                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                  >
                    View Public
                  </Link>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
