import { NextResponse } from 'next/server'
import { calculateMatchScores, extractTopKeywords } from '@/lib/scoreUtils'

/**
 * POST /api/tailor
 * Tailors a master profile for a specific job using AI
 *
 * Request body:
 * {
 *   masterProfile: {...},
 *   jobDescription: string,
 *   jobTitle: string
 * }
 *
 * Response:
 * {
 *   tailoredProfile: {...},
 *   matchScores: {...}
 * }
 */

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY
const GOOGLE_AI_MODEL = 'gemini-2.5-flash'

async function callGemini(prompt) {
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('Google AI API key not configured')
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_AI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GOOGLE_AI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Gemini API error')
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

function parseTailoredResponse(responseText = '') {
  try {
    let text = responseText

    // If the model wrapped output in a code fence, pull the inner block
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
    if (fenced && fenced[1]) {
      text = fenced[1].trim()
    }

    // Try JSON first (first {...} block)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch (err) {
        console.warn('Tailor JSON parse failed, falling back to regex extraction:', err?.message || err)
      }
    }

    // Regex-extract common fields even if JSON parse failed
    const titleJson = text.match(/"title"\s*:\s*"([^"]+)"/i)
    const bioJson = text.match(/"bio"\s*:\s*"([\s\S]*?)"\s*(?:,|\n|$)/i)
    const skillsJson = text.match(/"skills"\s*:\s*\[(.*?)\]/is)

    const titleMatch = titleJson?.[1]?.trim() || text.match(/Title:\s*(.+?)(?:\n|$)/i)?.[1]?.trim() || ''
    const bioMatch = bioJson?.[1]?.trim() || text.match(/Bio:\s*(.+?)(?:\n\n|$)/is)?.[1]?.trim() || ''

    let skills = []
    if (skillsJson?.[1]) {
      skills = skillsJson[1]
        .split(',')
        .map((s) => s.replace(/^[\s\"]+|[\s\"]+$/g, '').trim())
        .filter(Boolean)
    } else {
      const skillsLine = text.match(/Skills:\s*(.+?)(?:\n|$)/i)?.[1]
      if (skillsLine) {
        skills = skillsLine.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      }
    }

    return {
      title: titleMatch,
      bio: bioMatch,
      skills,
    }
  } catch (error) {
    console.error('Error parsing Gemini response:', error)
    return {
      title: '',
      bio: '',
      skills: [],
    }
  }
}

// Deterministic fallback tailoring when AI returns little or API key is missing
function heuristicTailor(masterProfile, jobDescription, jobTitle) {
  const jobKeywords = extractTopKeywords(jobDescription || '', 30)

  const matchCount = (text = '') => {
    const lower = text.toLowerCase()
    return jobKeywords.reduce((count, kw) => (lower.includes(kw) ? count + 1 : count), 0)
  }

  const skills = (masterProfile.skills || [])
    .filter((skill) => jobDescription?.toLowerCase().includes(skill.toLowerCase()))
    .slice(0, 8)
  const skillsFilled = skills.length > 0 ? skills : (masterProfile.skills || []).slice(0, 8)

  const experienceSorted = (masterProfile.experience || [])
    .map((exp, idx) => ({ exp, score: matchCount(`${exp.role} ${exp.company} ${exp.description}`), idx }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map(({ exp }) => exp)

  const projectsSorted = (masterProfile.projects || [])
    .map((proj, idx) => ({ proj, score: matchCount(`${proj.name} ${proj.description}`), idx }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map(({ proj }) => proj)

  const title = jobTitle
    ? `${jobTitle}`
    : masterProfile.title

  const bio = `Focused on ${jobTitle || masterProfile.title || 'your role'} with strengths in ${skillsFilled
    .slice(0, 5)
    .join(', ')}. Experienced across ${experienceSorted[0]?.company || 'multiple teams'} delivering impact with the right tools.`

  return {
    title,
    bio,
    skills: skillsFilled,
    experienceReorder: experienceSorted.map((_, i) => i),
    projectHighlights: projectsSorted.slice(0, 4).map((p) => p.name),
  }
}

export async function POST(request) {
  try {
    const { masterProfile, jobDescription, jobTitle } = await request.json()

    if (!masterProfile || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate match scores (this works without API)
    const matchScores = calculateMatchScores(masterProfile, jobDescription)

    // Format experience entries
    const experienceText = masterProfile.experience
      ?.map(
        exp =>
          `${exp.role} at ${exp.company} (${exp.startMonthYear} - ${exp.endMonthYear}): ${exp.description}`
      )
      .join('\n') || 'None'

    // Format projects
    const projectsText = masterProfile.projects
      ?.map(proj => `${proj.name}: ${proj.description}`)
      .join('\n') || 'None'

    // Create prompt for AI tailoring
    const prompt = `You are an expert resume writer. Tailor the following resume for this specific job.

MASTER RESUME:
Name: ${masterProfile.name}
Title: ${masterProfile.title}
Bio: ${masterProfile.bio}
Skills: ${masterProfile.skills?.join(', ') || 'None'}
Experience: ${experienceText}
Projects: ${projectsText}

TARGET JOB:
Position: ${jobTitle}
Description: ${jobDescription}

Please provide a tailored version that:
1. Updates the professional title to better match the job
2. Rewrites the bio to highlight relevant experience and skills
3. Lists the top 8 most relevant skills in order of importance
4. Reorders experience entries by relevance to this job
5. Highlights projects that demonstrate required skills

Respond in this JSON format:
{
  "title": "new professional title",
  "bio": "tailored bio paragraph",
  "skills": ["skill1", "skill2", ...],
  "experienceReorder": [0, 2, 1],
  "projectHighlights": ["project name", ...]
}`

    // Try AI first; if it fails or returns nothing, fall back to deterministic tailoring
    let tailoredData = {}
    try {
      const aiResponse = await callGemini(prompt)
      console.log('Tailor AI raw response:', aiResponse)
      tailoredData = parseTailoredResponse(aiResponse) || {}
      console.log('Tailor parsed data:', tailoredData)
    } catch (aiError) {
      console.warn('AI tailoring skipped/fell back:', aiError?.message || aiError)
      tailoredData = {}
    }

    // If AI returned nothing useful, build a heuristic tailored suggestion
    const hasAiContent = Boolean(
      (tailoredData.title && tailoredData.title.trim()) ||
      (tailoredData.bio && tailoredData.bio.trim()) ||
      (Array.isArray(tailoredData.skills) && tailoredData.skills.length > 0)
    )

    if (!hasAiContent) {
      tailoredData = heuristicTailor(masterProfile, jobDescription, jobTitle)
    }

    // Construct tailored profile
    // Reorder experience if AI or heuristic suggests an ordering
    const baseExperience = masterProfile.experience || []
    const tailoredExperience = Array.isArray(tailoredData.experienceReorder) && tailoredData.experienceReorder.length > 0
      ? tailoredData.experienceReorder
          .map((idx) => baseExperience[idx])
          .filter(Boolean)
      : baseExperience

    // Highlight projects if AI or heuristic suggests a subset
    const baseProjects = masterProfile.projects || []
    const tailoredProjects = Array.isArray(tailoredData.projectHighlights) && tailoredData.projectHighlights.length > 0
      ? baseProjects.filter((proj) =>
          tailoredData.projectHighlights.some((name) => name?.toLowerCase() === (proj.name || '').toLowerCase())
        )
      : baseProjects

    const tailoredProfile = {
      title: tailoredData.title || masterProfile.title,
      bio: tailoredData.bio || masterProfile.bio,
      skills: tailoredData.skills && tailoredData.skills.length > 0 
        ? tailoredData.skills 
        : masterProfile.skills,
      experience: tailoredExperience,
      projects: tailoredProjects,
    }

    return NextResponse.json({
      tailoredProfile,
      matchScores,
    })
  } catch (error) {
    console.error('Tailor API error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to tailor resume',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
