import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import '../../globals.css'; // ensure global styles are imported
import ThemeSetter from './ThemeSetter';

export default async function ProfilePage({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams?.username;
  if (!username) return notFound();

  const usernameDecoded = decodeURIComponent(username);

  const SUPABASE_URL =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return notFound();

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from('portfolios')
    .select('username, name, title, bio, github, linkedin, twitter, projects, skills, experience, theme, customColor')
    .ilike('username', usernameDecoded.trim())
    .maybeSingle();

  if (error || !data) return notFound();

  const portfolio = data;

  const formatMonthYear = (my) => {
    if (!my) return "";
    const [year, month] = my.split("-");
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    return `${monthName} ${year}`;
  };

  const currentMonthYear = new Date().toISOString().slice(0, 7);

  const themeColors = {
    blue: "#3b82f6",
    green: "#10b981",
    purple: "#8b5cf6",
    red: "#ef4444",
    orange: "#f97316",
  };

  const accentColor = portfolio.theme === "custom" ? (portfolio.customColor || "#3b82f6") : (themeColors[portfolio.theme] || "#3b82f6");

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "59, 130, 246";
  };

  const accentRgb = hexToRgb(accentColor);

  const darkenColor = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const getBrightness = (hex) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const accentDark = darkenColor(accentColor, 50);
  const isDark = getBrightness(accentColor) < 128;
  const accentText = isDark ? '#ffffff' : accentDark;

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
                <a
                  href={proj.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-title"
                >
                  {proj.name || 'Untitled Project'}
                </a>
                <p className="project-description">{proj.description}</p>
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
                  <div className="experience-left">
                    <h3 className="company-name">{exp.company}</h3>
                    <p className="role">{exp.role}</p>
                  </div>
                  <div className="experience-right">
                    <p className="experience-dates">
                      {formatMonthYear(exp.startMonthYear)} - {exp.endMonthYear === currentMonthYear ? "present" : formatMonthYear(exp.endMonthYear)}
                    </p>
                  </div>
                </div>
                <p className="experience-description">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No experience listed.</p>
        )}
      </section>
    </div>
    </>
  );
}
