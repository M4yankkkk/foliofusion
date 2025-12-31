/**
 * LLM Service for enhancing resume content with quantifiable metrics
 * Uses Google Gemini API (free tier) for ATS-optimized bullet points
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Enhances a single bullet point with quantifiable metrics and action verbs
 */
async function enhanceBulletPoint(bulletPoint, role, company) {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, skipping enhancement');
    return bulletPoint;
  }

  const prompt = `You are an expert resume writer specializing in ATS (Applicant Tracking System) optimization.

Rewrite the following bullet point for a ${role} position at ${company} to make it more impactful and ATS-friendly:

Original: "${bulletPoint}"

Requirements:
1. Start with a strong action verb (e.g., Developed, Implemented, Optimized, Led, Architected)
2. Include quantifiable metrics when possible (%, numbers, time saved, users impacted)
3. Highlight technical skills and tools used
4. Keep it concise (1-2 lines maximum)
5. Use industry-standard keywords for ATS scanning
6. Focus on impact and results, not just responsibilities

Return ONLY the enhanced bullet point, nothing else.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.statusText);
      return bulletPoint;
    }

    const data = await response.json();
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    return enhancedText || bulletPoint;
  } catch (error) {
    console.error('Error enhancing bullet point:', error);
    return bulletPoint;
  }
}

/**
 * Enhances all experience descriptions with ATS-optimized bullet points
 */
export async function enhanceExperience(experiences) {
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return experiences;
  }

  const enhanced = await Promise.all(
    experiences.map(async (exp) => {
      if (!exp.description) return exp;

      // Split description into bullet points
      const bullets = exp.description.split(/\n|\./).filter(b => b.trim());
      
      // Enhance each bullet point
      const enhancedBullets = await Promise.all(
        bullets.map(bullet => enhanceBulletPoint(bullet.trim(), exp.role, exp.company))
      );

      return {
        ...exp,
        description: enhancedBullets.join('\n'),
        enhanced: true
      };
    })
  );

  return enhanced;
}

/**
 * Enhances all project descriptions with ATS-optimized bullet points
 */
export async function enhanceProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return projects;
  }

  const enhanced = await Promise.all(
    projects.map(async (project) => {
      if (!project.description) return project;

      // Split description into bullet points
      const bullets = project.description.split(/\n|\./).filter(b => b.trim());
      
      // Enhance each bullet point
      const enhancedBullets = await Promise.all(
        bullets.map(bullet => enhanceBulletPoint(bullet.trim(), 'Project', project.name))
      );

      return {
        ...project,
        description: enhancedBullets.join('\n'),
        enhanced: true
      };
    })
  );

  return enhanced;
}

/**
 * Enhances complete profile for PDF generation
 */
export async function enhanceProfileForPDF(profile, options = {}) {
  const { enhanceContent = true } = options;

  if (!enhanceContent || !GEMINI_API_KEY) {
    console.log('Content enhancement disabled or API key missing');
    return profile;
  }

  console.log('Enhancing profile content with LLM...');

  const [enhancedExperience, enhancedProjects] = await Promise.all([
    enhanceExperience(profile.experience || []),
    enhanceProjects(profile.projects || [])
  ]);

  return {
    ...profile,
    experience: enhancedExperience,
    projects: enhancedProjects,
  };
}
