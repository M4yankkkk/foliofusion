'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from './ui/Button'
import { useState } from 'react'

export default function DeleteResumeButton({ resumeId, jobTitle }) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Not authenticated')
      }

      // First verify the resume belongs to the user via master_profile
      const { data: resume, error: fetchError } = await supabase
        .from('tailored_resumes')
        .select('master_profile_id, master_profiles(user_id)')
        .eq('id', resumeId)
        .single()

      if (fetchError) {
        console.error('Fetch error:', fetchError)
        throw new Error('Resume not found')
      }

      if (resume.master_profiles?.user_id !== user.id) {
        throw new Error('Unauthorized')
      }

      // Now delete the resume
      const { error } = await supabase
        .from('tailored_resumes')
        .delete()
        .eq('id', resumeId)

      if (error) {
        console.error('Delete error:', error)
        throw error
      }

      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert(err.message || 'Failed to delete resume')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </Button>
  )
}
