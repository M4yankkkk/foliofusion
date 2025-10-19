import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import '../../globals.css'; // ensure global styles are imported

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
    .select('*')
    .ilike('username', usernameDecoded.trim())
    .maybeSingle();

  if (error || !data) return notFound();

  const portfolio = data;

  return (
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
        <p>{portfolio.experience || 'No experience listed.'}</p>
      </section>
    </div>
  );
}
