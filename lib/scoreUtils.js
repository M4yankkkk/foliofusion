/**
 * Calculate keyword match score between two texts
 * Uses simple keyword overlap and cosine similarity concepts
 */

function extractKeywords(text) {
  // Remove common words and extract meaningful keywords
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'that', 'this', 'from', 'by',
    'as', 'if', 'which', 'who', 'what', 'where', 'when', 'why', 'how',
  ])

  const words = text
    .toLowerCase()
    .match(/\b\w+\b/g) || []

  return words
    .filter(word => word.length > 2 && !commonWords.has(word))
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0)
}

export function calculateMatchScores(masterProfile, jobDescription) {
  // Extract keywords from both texts
  const masterKeywords = new Set([
    ...extractKeywords(masterProfile.name || ''),
    ...extractKeywords(masterProfile.title || ''),
    ...extractKeywords(masterProfile.bio || ''),
    ...extractKeywords(masterProfile.skills?.join(' ') || ''),
    ...extractKeywords(
      masterProfile.experience?.map(exp => `${exp.role} ${exp.company} ${exp.description}`).join(' ') || ''
    ),
    ...extractKeywords(masterProfile.projects?.map(p => `${p.name} ${p.description}`).join(' ') || ''),
  ])

  const jobKeywords = new Set(extractKeywords(jobDescription))

  // Calculate skills match
  const skillMatches = (masterProfile.skills || []).filter(skill =>
    jobDescription.toLowerCase().includes(skill.toLowerCase())
  ).length
  const skillsMatch = Math.round(
    ((skillMatches / Math.max(masterProfile.skills?.length || 1, 1)) * 100)
  )

  // Calculate experience match (check if job description mentions relevant roles/companies)
  const experienceMatches = (masterProfile.experience || []).filter(exp => {
    const expText = `${exp.role} ${exp.company} ${exp.description}`.toLowerCase()
    return Array.from(jobKeywords).some(keyword => expText.includes(keyword))
  }).length
  const experienceMatch = Math.round(
    ((experienceMatches / Math.max(masterProfile.experience?.length || 1, 1)) * 100)
  )

  // Calculate keywords coverage
  const matchedKeywords = Array.from(masterKeywords).filter(keyword =>
    jobKeywords.has(keyword)
  )
  const keywordsCoverage = Math.round(
    ((matchedKeywords.length / Math.max(jobKeywords.size, 1)) * 100)
  )

  // Calculate overall score (weighted average)
  const overall = Math.round(
    (skillsMatch * 0.4 + experienceMatch * 0.3 + keywordsCoverage * 0.3)
  )

  // Find missing keywords
  const missingKeywords = Array.from(jobKeywords)
    .filter(keyword => !masterKeywords.has(keyword))
    .slice(0, 10)

  return {
    overall: Math.min(100, overall),
    skillsMatch: Math.min(100, skillsMatch),
    experienceMatch: Math.min(100, experienceMatch),
    keywordsCoverage: Math.min(100, keywordsCoverage),
    matchedKeywords: matchedKeywords.slice(0, 10),
    missingKeywords,
    totalMasterKeywords: masterKeywords.size,
    totalJobKeywords: jobKeywords.size,
  }
}

/**
 * Extract top keywords from text based on frequency
 */
export function extractTopKeywords(text, limit = 20) {
  const keywords = extractKeywords(text)
  const frequency = {}

  keywords.forEach(keyword => {
    frequency[keyword] = (frequency[keyword] || 0) + 1
  })

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword]) => keyword)
}
