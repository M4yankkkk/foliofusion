import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import '../../../globals.css'
import ThemeSetter from '../ThemeSetter'
import ProjectEmbed from '@/components/ProjectEmbed'

export default async function TailoredProfilePage({ params }) {
  const resolvedParams = await params
  const username = resolvedParams?.username
  const slug = resolvedParams?.slug

  if (!username || !slug) return notFound()

  const usernameDecoded = decodeURIComponent(username)
  const slugDecoded = decodeURIComponent(slug)

  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return notFound()

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Fetch user by username
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, username, email')
    .ilike('username', usernameDecoded.trim())
    .maybeSingle()

  if (userError || !userData) {
    console.log('No user found with username:', usernameDecoded)
    return notFound()
  }

  // Fetch master profile
  const { data: masterProfile, error: masterError } = await supabase
    .from('master_profiles')
    .select('*')
    .eq('user_id', userData.id)
    .maybeSingle()

  if (masterError || !masterProfile) {
    console.log('No master profile found for user:', userData.id)
    return notFound()
  }

  // Fetch tailored resume by slug
  const { data: tailoredResume, error: tailoredError } = await supabase
    .from('tailored_resumes')
    .select('*')
    .eq('master_profile_id', masterProfile.id)
    .eq('public_url', slugDecoded)
    .maybeSingle()

  if (tailoredError || !tailoredResume) {
    console.log('No tailored resume found with slug:', slugDecoded)
    return notFound()
  }

  // Use tailored content
  const tailoredContent = tailoredResume.tailored_content || {}
  
  const portfolio = {
    username: userData.username,
    name: masterProfile.name,
    title: tailoredContent.title || masterProfile.title,
    bio: tailoredContent.bio || masterProfile.bio,
    github: masterProfile.github,
    linkedin: masterProfile.linkedin,
    twitter: masterProfile.twitter,
    projects: tailoredContent.projects || masterProfile.projects || [],
    skills: tailoredContent.skills || masterProfile.skills || [],
    experience: tailoredContent.experience || masterProfile.experience || [],
    theme: tailoredContent.theme || masterProfile.theme,
    customColor: tailoredContent.custom_color || masterProfile.custom_color,
  }

  const formatMonthYear = (my) => {
    if (!my) return ""
    const [year, month] = my.split("-")
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })
    return `${monthName} ${year}`
  }

  function hexToRgb(hex) {
    if (!hex) return '59, 130, 246'
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '59, 130, 246'
  }

  function darkenColor(hex, percent) {
    if (!hex) return '#2563eb'
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = ((num >> 8) & 0x00ff) - amt
    const B = (num & 0x0000ff) - amt
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    )
  }

  function getBrightness(hex) {
    if (!hex) return 128
    const rgb = parseInt(hex.replace('#', ''), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    return 0.299 * r + 0.587 * g + 0.114 * b
  }

  const themeColors = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    orange: '#f97316',
  }

  const accentColor = portfolio.theme === 'custom' 
    ? portfolio.customColor 
    : themeColors[portfolio.theme] || themeColors.blue

  const accentRgb = hexToRgb(accentColor)
  const accentDark = darkenColor(accentColor, 50)
  const isDark = getBrightness(accentColor) < 128
  const accentText = isDark ? '#ffffff' : accentDark

  return (
    <>
      <ThemeSetter accentColor={accentColor} accentRgb={accentRgb} accentDark={accentDark} accentText={accentText} />
      <div style={{ display: 'none' }}>Accent: {accentColor}</div>
      <div className="profile-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-avatar">
              {portfolio.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <h1 className="hero-name">{portfolio.name}</h1>
            <p className="hero-title">{portfolio.title}</p>
            {portfolio.bio && <p className="hero-bio">{portfolio.bio}</p>}
            <div className="hero-socials">
              {portfolio.github && (
                <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
              {portfolio.linkedin && (
                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {portfolio.twitter && (
                <a href={portfolio.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="section projects-section">
          <h2>Featured Projects</h2>
          {portfolio.projects && portfolio.projects.length > 0 ? (
            <div className="projects-grid">
              {portfolio.projects.map((proj, i) => (
                <div key={i} className="project-card">
                  {proj.link ? (
                    <ProjectEmbed url={proj.link} name={proj.name || 'Untitled Project'} />
                  ) : (
                    <>
                      <h3 className="project-title">{proj.name || 'Untitled Project'}</h3>
                      <p className="project-description">{proj.description}</p>
                    </>
                  )}
                  {proj.link && proj.description && (
                    <p className="project-description mt-3">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No projects added.</p>
          )}
        </section>

        {/* Skills Section */}
        <section className="section skills-section">
          <h2>Skills & Technologies</h2>
          {portfolio.skills && portfolio.skills.length > 0 ? (
            <div className="skills-list">
              {portfolio.skills.map((skill, i) => (
                <span key={i} className="skill-item">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No skills added.</p>
          )}
        </section>

        {/* Experience Section */}
        <section className="section experience-section">
          <h2>Experience</h2>
          {portfolio.experience && portfolio.experience.length > 0 ? (
            <div className="experience-list">
              {portfolio.experience.map((exp, i) => (
                <div key={i} className="experience-card">
                  <div className="experience-header">
                    <h3>{exp.role}</h3>
                    <span className="experience-date">
                      {formatMonthYear(exp.startMonthYear)} - {exp.endMonthYear ? formatMonthYear(exp.endMonthYear) : 'Present'}
                    </span>
                  </div>
                  <p className="experience-company" style={{ color: accentColor }}>
                    {exp.company}
                  </p>
                  <p className="experience-description">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No experience added.</p>
          )}
        </section>
      </div>
    </>
  )
}
