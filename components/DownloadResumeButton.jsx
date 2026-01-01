'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Button from './ui/Button';
import EnhancedPreviewModal from './EnhancedPreviewModal';
import { enhanceProfileForPDF } from '@/lib/llmService';
import { createClient } from '@/lib/supabase/client';

export default function DownloadResumeButton({ resumeId = null, type = 'master', variant = 'primary', enhance = true }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [enhancedProfile, setEnhancedProfile] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const fetchAndEnhanceProfile = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let profileData;

      if (type === 'tailored' && resumeId) {
        const { data: resume, error: resumeError } = await supabase
          .from('tailored_resumes')
          .select('*, master_profiles(*)')
          .eq('id', resumeId)
          .single();

        if (resumeError || !resume) {
          console.error('Resume fetch error:', resumeError);
          throw new Error('Resume not found');
        }

        // Verify user owns this resume through master profile
        if (resume.master_profiles?.user_id !== user.id) {
          throw new Error('Unauthorized access to resume');
        }

        profileData = {
          ...resume.master_profiles,
          bio: resume.tailored_content?.bio || resume.master_profiles.bio,
          experience: resume.tailored_content?.experience || resume.master_profiles.experience,
          projects: resume.tailored_content?.projects || resume.master_profiles.projects,
          skills: resume.tailored_content?.skills || resume.master_profiles.skills,
        };
      } else {
        const { data: profile, error: profileError } = await supabase
          .from('master_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile) throw new Error('Profile not found');
        profileData = profile;
      }

      setOriginalProfile(JSON.parse(JSON.stringify(profileData)));
      
      if (enhance) {
        setIsEnhancing(true);
        const enhanced = await enhanceProfileForPDF(profileData, { enhanceContent: true });
        setEnhancedProfile(enhanced);
        setIsEnhancing(false);
      } else {
        setEnhancedProfile(profileData);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      setIsEnhancing(false);
    }
  };

  const handlePreviewClick = async () => {
    setError(null);
    setShowPreview(true);
    await fetchAndEnhanceProfile();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: type === 'tailored' ? resumeId : null,
          type,
          enhance, // Include enhancement flag
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download resume');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `resume-${type}.pdf`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Close preview modal if open
      setShowPreview(false);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={enhance ? handlePreviewClick : handleDownload}
          disabled={isDownloading}
          variant={variant}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Generating PDF...' : enhance ? 'Download ATS Resume' : 'Download Resume'}
        </Button>
        {error && (
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}
      </div>

      <EnhancedPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleDownload}
        originalProfile={originalProfile}
        enhancedProfile={enhancedProfile}
        isLoading={isEnhancing}
      />
    </>
  );
}
