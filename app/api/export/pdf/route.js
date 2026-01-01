import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLatexResume, compileLatexToPdf } from '@/lib/latexGenerator';
import { enhanceProfileForPDF } from '@/lib/llmService';

export async function POST(request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { profileId, resumeId, type = 'master', enhance = true } = body;
    
    console.log('PDF Export request:', { profileId, resumeId, type, enhance, userId: user.id });

    let profileData;

    if (type === 'tailored' && resumeId) {
      // Fetch tailored resume
      const { data: resume, error: resumeError } = await supabase
        .from('tailored_resumes')
        .select('*, master_profiles(*)')
        .eq('id', resumeId)
        .single();

      if (resumeError || !resume) {
        console.error('Resume fetch error:', resumeError);
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      // Verify user owns this resume through master profile
      if (resume.master_profiles?.user_id !== user.id) {
        console.error('Unauthorized: Resume belongs to different user');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      console.log('Fetched tailored resume:', resume.id);
      
      // Use tailored content if available, otherwise fall back to master
      profileData = {
        ...resume.master_profiles,
        // Override with tailored content
        bio: resume.tailored_content?.bio || resume.master_profiles.bio,
        experience: resume.tailored_content?.experience || resume.master_profiles.experience,
        projects: resume.tailored_content?.projects || resume.master_profiles.projects,
        skills: resume.tailored_content?.skills || resume.master_profiles.skills,
      };
    } else {
      // Fetch master profile
      const { data: profile, error: profileError } = await supabase
        .from('master_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      console.log('Fetched master profile:', profile.name);
      profileData = profile;
    }

    // Enhance profile content with LLM for better ATS scores
    console.log('Enhancing profile content for ATS optimization...');
    profileData = await enhanceProfileForPDF(profileData, { enhanceContent: enhance });
    console.log('Profile enhancement complete');

    console.log('Generating LaTeX...');
    // Generate LaTeX content
    const latexContent = generateLatexResume(profileData);
    console.log('LaTeX generated, length:', latexContent.length);

    console.log('Compiling PDF...');
    // Compile to PDF
    const pdfBuffer = await compileLatexToPdf(latexContent);
    console.log('PDF compiled, size:', pdfBuffer.length);

    // Return PDF
    const filename = type === 'tailored' 
      ? `resume-${profileData.name?.replace(/\s/g, '-')}-tailored.pdf`
      : `resume-${profileData.name?.replace(/\s/g, '-')}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
