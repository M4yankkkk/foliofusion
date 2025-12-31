# FolioFusion 2.0 Implementation Plan

## Overview
This document provides a detailed, step-by-step roadmap to implement FolioFusion 2.0 features as outlined in the PRD. The plan is structured in 6 phases over 10 weeks, prioritizing a "zero-budget" approach using free tier services.

---

## Phase 1: Foundation & Authentication (Week 1-2)

### Goals
- Set up user authentication with Supabase Auth
- Create new database schema to support multi-user, versioned resumes
- Start fresh with new Supabase project (no migration needed)

### Deliverables

#### 1.1 Database Schema Setup

**Create new tables in fresh Supabase project:**

```sql
-- Users table (auto-synced with Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' -- 'free' or 'pro'
);

-- Master Profiles (Source of Truth)
CREATE TABLE master_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  projects JSONB DEFAULT '[]', -- True JSON array
  skills JSONB DEFAULT '[]', -- Array of strings
  experience JSONB DEFAULT '[]', -- Array of experience objects
  theme TEXT DEFAULT 'blue',
  custom_color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- One master profile per user
);

-- Tailored Resumes (Derived from Master Profile)
CREATE TABLE tailored_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_profile_id UUID REFERENCES master_profiles(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL, -- e.g., "Frontend Dev @ Google"
  job_description TEXT, -- The JD pasted by user
  tailored_content JSONB, -- Modified version of master profile
  match_score INT, -- 0-100 ATS score
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  public_url TEXT UNIQUE, -- e.g., "foliofusion.com/u/arjun-google"
  view_count INT DEFAULT 0
);

-- Analytics/Views tracking
CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tailored_resume_id UUID REFERENCES tailored_resumes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  referrer TEXT
);
```

**Row Level Security (RLS) Policies:**
```sql
-- Users can only read their own data
CREATE POLICY "Users can read own data" ON master_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiles" ON master_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles" ON master_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

#### 1.2 Supabase Auth Setup

**Steps:**
1. Enable Google OAuth in Supabase dashboard:
   - Go to `Authentication > Providers > Google`
   - Add Google OAuth credentials
2. Enable Email/Password auth for fallback
3. Create auth trigger to auto-populate `users` table:

```sql
-- Trigger to create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 1.3 Update Layout with Auth UI

**File:** `app/layout.js`

Add:
- Supabase Auth state provider
- Navigation bar with Login/Sign Up buttons
- User menu (when authenticated)

```jsx
// Pseudo-code
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import AuthButton from '@/components/AuthButton';

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html>
      <body>
        <nav>
          {session ? <UserMenu /> : <LoginButton />}
        </nav>
        {children}
      </body>
    </html>
  );
}
```

#### 1.4 Create Protected Route Middleware

**File:** `middleware.js` (new)

```javascript
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  // Redirect unauthenticated users from /dashboard to /
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```

### Tasks Breakdown

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Create database schema in new Supabase | Dev | 1.5 hours | Fresh Supabase project created |
| Set up RLS policies | Dev | 1 hour | Schema deployed |
| Set up OAuth provider (Google) | Dev | 1 hour | Google Cloud credentials |
| Create auth trigger for users table | Dev | 1 hour | Schema deployed |
| Build AuthButton component | Dev | 3 hours | OAuth configured |
| Update layout with auth UI | Dev | 2 hours | AuthButton ready |
| Create middleware for protected routes | Dev | 2 hours | Auth setup complete |
| Test end-to-end auth flow | Dev | 2 hours | All auth complete |

**Total: ~13.5 hours (~2 days)**

---

## Phase 2: Master Profile Management (Week 3-4)

### Goals
- Build authenticated dashboard for users to view and manage their Master Profile
- Create edit form for updating Master Profile
- Implement database read/write operations with proper auth

### Deliverables

#### 2.1 Dashboard Shell

**File:** `app/dashboard/page.js` (Server component)

```javascript
// Fetch user's master profile, display summary
const Dashboard = async () => {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('master_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="dashboard-container">
      <h1>Welcome, {profile?.name}</h1>
      <MasterProfileCard profile={profile} />
      <TailoredResumesSection userId={user.id} />
      <AnalyticsSection userId={user.id} />
    </div>
  );
};
```

#### 2.2 Master Profile Card Component

**File:** `components/MasterProfileCard.jsx`

Displays:
- User's name, title, bio
- Quick stats (Total Tailored Resumes, Total Views)
- Buttons: [Edit Profile] [View Public Page] [Share]

#### 2.3 Edit Profile Page

**File:** `app/dashboard/profile/edit/page.js`

Refactor `PortfolioForm` into reusable component that handles:
- **Create mode:** Insert new Master Profile (current behavior)
- **Edit mode:** Update existing Master Profile using `.upsert()`

```jsx
// Pseudo-code for upsert
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const { error } = await supabase
    .from('master_profiles')
    .upsert({
      user_id: user.id,
      ...formData,
      projects: JSON.stringify(projects), // Ensure JSON
      skills: JSON.stringify(skills),
      experience: JSON.stringify(experience),
    }, {
      onConflict: 'user_id' // Update if user_id exists
    });

  if (!error) {
    router.push('/dashboard');
  }
};
```

#### 2.4 Public Profile URL

Update `app/profile/[username]/page.js` to:
- Query new `master_profiles` table (via `users` -> `email` lookup)
- Display with theme + styling as before
- Add "View Count" badge

#### 2.5 API Route for Profile Operations

**File:** `app/api/profile/route.js` (new)

```javascript
// GET: Fetch user's master profile
export async function GET(req) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('master_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return Response.json(data);
}

// POST: Create new master profile
export async function POST(req) {
  const body = await req.json();
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { error, data } = await supabase
    .from('master_profiles')
    .insert([{ user_id: user.id, ...body }])
    .select();

  return Response.json(data?.[0], { status: error ? 400 : 201 });
}

// PATCH: Update existing master profile
export async function PATCH(req) {
  const body = await req.json();
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { error, data } = await supabase
    .from('master_profiles')
    .update(body)
    .eq('user_id', user.id)
    .select();

  return Response.json(data?.[0]);
}
```

### Tasks Breakdown

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Design dashboard layout | Designer/Dev | 2 hours | Phase 1 complete |
| Build MasterProfileCard | Dev | 3 hours | Dashboard design |
| Refactor PortfolioForm (create/edit modes) | Dev | 4 hours | Form component analysis |
| Create edit profile page | Dev | 3 hours | Form refactored |
| Update public profile page | Dev | 3 hours | Schema updated |
| Build profile API route | Dev | 3 hours | Auth complete |
| Test create/edit/view flows | Dev | 3 hours | All features built |

**Total: ~21 hours (~2.5 days)**

---

## Phase 3: AI Resume Tailor Engine (Week 5-6)

### Goals
- Build UI for comparing Master Profile vs. Job Description
- Implement AI-powered resume rewriting using Google Gemini
- Calculate ATS match score (before/after optimization)
- Save tailored resume as unique public link

### Deliverables

#### 3.1 Match Score Algorithm

**File:** `lib/scoreUtils.ts` (new)

```typescript
// Simple keyword overlap scoring
export function calculateMatchScore(
  masterProfile: string,
  jobDescription: string
): number {
  const profileWords = new Set(
    masterProfile.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  );
  
  const jdWords = jobDescription.toLowerCase().split(/\s+/);
  const matches = jdWords.filter(w => profileWords.has(w)).length;
  
  return Math.round((matches / jdWords.length) * 100);
}
```

#### 3.2 AI Tailor Prompt Engineering

**File:** `lib/aiPrompts.ts` (new)

```typescript
export function getTailorPrompt(
  masterProfileText: string,
  jobDescription: string
): string {
  return `You are an expert resume writer. Your task is to rewrite the following resume to maximize ATS match for this job description.

RULES:
- Do NOT hallucinate skills or experiences not in the original resume
- Prioritize keywords found in the job description
- Preserve factual accuracy
- Make bullet points more impactful and achievement-focused
- Keep the same structure (no major reorganization)

ORIGINAL RESUME:
${masterProfileText}

TARGET JOB DESCRIPTION:
${jobDescription}

OUTPUT: Return ONLY the rewritten resume in the same format as the input. Do not add explanations or comments.`;
}
```

#### 3.3 Backend Tailor Endpoint

**File:** `app/api/tailor/route.js` (new)

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(req) {
  const { masterProfileId, jobDescription } = await req.json();
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch master profile
  const { data: profile } = await supabase
    .from('master_profiles')
    .select('*')
    .eq('id', masterProfileId)
    .eq('user_id', user.id)
    .single();

  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });

  // Calculate pre-optimization score
  const preScore = calculateMatchScore(JSON.stringify(profile), jobDescription);

  // Call Gemini API
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = getTailorPrompt(JSON.stringify(profile), jobDescription);

  const result = await model.generateContent(prompt);
  const tailoredText = result.response.text();
  const tailoredContent = JSON.parse(tailoredText); // Assume AI returns JSON

  // Calculate post-optimization score
  const postScore = calculateMatchScore(tailoredText, jobDescription);

  // Save to DB
  const { data: tailored, error } = await supabase
    .from('tailored_resumes')
    .insert([{
      master_profile_id: masterProfileId,
      job_description: jobDescription,
      tailored_content: tailoredContent,
      match_score: postScore,
      public_url: generateUniqueUrl(profile.username),
    }])
    .select()
    .single();

  return Response.json({
    preScore,
    postScore,
    tailored,
  });
}

function calculateMatchScore(text, jd) {
  // Implement scoreUtils logic
}

function generateUniqueUrl(username) {
  return `${username}-${Date.now().toString(36)}`;
}
```

#### 3.4 Tailor Page UI

**File:** `app/dashboard/tailor/page.js` (new)

Three-column layout:
1. **Left:** Master Profile (read-only preview)
2. **Center:** JD input + score gauge + buttons
3. **Right:** Tailored result (editable)

```jsx
// Pseudo-code structure
export default function TailorPage() {
  const [jd, setJd] = useState('');
  const [preScore, setPreScore] = useState(0);
  const [postScore, setPostScore] = useState(0);
  const [tailored, setTailored] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    const res = await fetch('/api/tailor', {
      method: 'POST',
      body: JSON.stringify({ masterProfileId, jobDescription: jd })
    });
    const { preScore, postScore, tailored } = await res.json();
    setPreScore(preScore);
    setPostScore(postScore);
    setTailored(tailored);
    setLoading(false);
  };

  return (
    <div className="tailor-page">
      <div className="left-column">
        <h3>Master Profile</h3>
        <ProfilePreview profile={masterProfile} />
      </div>

      <div className="center-column">
        <textarea 
          placeholder="Paste job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <ScoreGauge preScore={preScore} postScore={postScore} />
        <button onClick={handleOptimize} disabled={loading}>
          {loading ? 'Optimizing...' : '✨ Optimize with AI'}
        </button>
      </div>

      <div className="right-column">
        <h3>Tailored Result</h3>
        {tailored && <EditableProfilePreview profile={tailored.tailored_content} />}
        <button>Save as New Link</button>
        <button>Download PDF</button>
      </div>
    </div>
  );
}
```

#### 3.5 ScoreGauge Component

**File:** `components/ScoreGauge.jsx` (new)

Animated circular gauge showing:
- Pre-optimization score (gray)
- Post-optimization score (green, animates on load)
- Text: "45% → 92% Match"

Use libraries like `react-circular-progressbar` or canvas-based custom implementation.

### Tasks Breakdown

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Implement score algorithm | Dev | 2 hours | Phase 2 complete |
| Design AI prompt strategy | Product/Dev | 2 hours | PRD review |
| Build Gemini API integration | Dev | 3 hours | Google API key setup |
| Create tailor API endpoint | Dev | 3 hours | Gemini integrated |
| Design tailor page UI | Designer/Dev | 3 hours | UX review |
| Build three-column layout | Dev | 4 hours | UI design finalized |
| Build ScoreGauge component | Dev | 3 hours | Component design |
| Test AI rewriting quality | QA/Dev | 4 hours | API integrated |
| Handle edge cases (empty JD, API failures) | Dev | 2 hours | Core feature done |

**Total: ~26 hours (~3 days)**

---

## Phase 4: Rich Media Embeds (Week 7)

### Goals
- Detect specific URL patterns in project links
- Render interactive embeds (Figma, YouTube, GitHub repo cards)
- Fall back to Open Graph preview cards for standard links

### Deliverables

#### 4.1 Embed Detection Utility

**File:** `lib/embedUtils.ts` (new)

```typescript
export type EmbedType = 'figma' | 'youtube' | 'github' | 'generic';

export interface EmbedData {
  type: EmbedType;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  embedCode?: string;
}

export function detectEmbedType(url: string): EmbedType {
  if (url.includes('figma.com/file')) return 'figma';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('github.com')) return 'github';
  return 'generic';
}

export async function getEmbedData(url: string): Promise<EmbedData> {
  const type = detectEmbedType(url);

  switch (type) {
    case 'figma':
      return {
        type: 'figma',
        url,
        embedCode: `<iframe src="${url}" allowfullscreen></iframe>`,
      };
    
    case 'youtube':
      const videoId = extractYouTubeId(url);
      return {
        type: 'youtube',
        url,
        embedCode: `<iframe src="https://www.youtube.com/embed/${videoId}"></iframe>`,
      };
    
    case 'github':
      const { owner, repo } = parseGitHubUrl(url);
      const repoData = await fetchGitHubRepoData(owner, repo);
      return {
        type: 'github',
        url,
        title: repoData.name,
        description: repoData.description,
        image: repoData.owner.avatar_url,
        ...repoData,
      };
    
    default:
      return await fetchOpenGraphData(url);
  }
}

// Helper functions
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match?.[1] || '';
}

function parseGitHubUrl(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return { owner: match?.[1], repo: match?.[2] };
}

async function fetchGitHubRepoData(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
  });
  return res.json();
}

async function fetchOpenGraphData(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  // Parse og:title, og:description, og:image meta tags
  return parseOpenGraphTags(html);
}
```

#### 4.2 Embed Display Components

**File:** `components/EmbedCard.jsx` (new)

```jsx
export default function EmbedCard({ embed }) {
  if (embed.type === 'figma') {
    return (
      <div className="embed-card figma">
        <iframe src={embed.url} allowFullScreen />
      </div>
    );
  }

  if (embed.type === 'youtube') {
    return (
      <div className="embed-card youtube">
        <div dangerouslySetInnerHTML={{ __html: embed.embedCode }} />
      </div>
    );
  }

  if (embed.type === 'github') {
    return (
      <div className="embed-card github">
        <div className="repo-card">
          <img src={embed.image} alt="Author" className="repo-avatar" />
          <h4>{embed.title}</h4>
          <p>{embed.description}</p>
          <div className="repo-stats">
            <span>⭐ {embed.stargazers_count}</span>
            <span>Language: {embed.language}</span>
          </div>
          <a href={embed.url} target="_blank">View on GitHub →</a>
        </div>
      </div>
    );
  }

  // Generic Open Graph preview
  return (
    <div className="embed-card generic">
      {embed.image && <img src={embed.image} alt={embed.title} />}
      <h4>{embed.title}</h4>
      <p>{embed.description}</p>
      <a href={embed.url} target="_blank">Visit →</a>
    </div>
  );
}
```

#### 4.3 Update Profile Rendering

**File:** `app/profile/[username]/page.js` (update)

```javascript
// In the projects section, replace simple link rendering with embed detection
{portfolio.projects.map((project) => (
  <div key={project.name} className="project-card">
    <h4>{project.name}</h4>
    <p>{project.description}</p>
    
    {/* Add embed if link is supported */}
    {project.link && (
      <EmbedCard embed={await getEmbedData(project.link)} />
    )}
  </div>
))}
```

#### 4.4 GitHub API Rate Limiting

**File:** `lib/githubClient.ts` (new)

```typescript
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

export async function fetchGitHubRepoDataCached(owner: string, repo: string) {
  const key = `github:${owner}:${repo}`;
  
  // Return cached if available
  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { 
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.status === 403) {
      // Rate limited; return basic data
      return { name: repo, error: 'Rate limited' };
    }

    const data = await res.json();
    cache.set(key, data);
    return data;
  } catch (err) {
    console.error(`Failed to fetch GitHub repo: ${owner}/${repo}`);
    return null;
  }
}
```

### CSS for Embeds

**File:** `app/globals.css` (append)

```css
/* Embed Cards */
.embed-card {
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;
  border: 1px solid var(--border-color, #e5e7eb);
}

.embed-card.figma iframe,
.embed-card.youtube iframe {
  width: 100%;
  height: 500px;
  border: none;
}

.embed-card.github {
  background: var(--accent-color-rgb);
  padding: 1rem;
  color: white;
}

.embed-card.github .repo-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.embed-card.github .repo-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.embed-card.generic {
  background: white;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.embed-card.generic img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .embed-card.figma iframe,
  .embed-card.youtube iframe {
    height: 300px;
  }
}
```

### Tasks Breakdown

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Design embed detection logic | Dev | 2 hours | Phase 3 complete |
| Implement URL pattern detection | Dev | 2 hours | Design finalized |
| Build GitHub API integration | Dev | 3 hours | GitHub token setup |
| Implement OG tag parsing | Dev | 2 hours | Generic embed design |
| Create EmbedCard components | Dev | 4 hours | All embed types designed |
| Integrate embeds into profile | Dev | 2 hours | Components ready |
| Set up rate limiting cache | Dev | 2 hours | GitHub API working |
| Test embed rendering (all types) | QA | 3 hours | Components integrated |

**Total: ~20 hours (~2.5 days)**

---

## Phase 5: PDF Export with LaTeX (Week 8-9)

### Goals
- Store and use "Jake's Resume" LaTeX template
- Build backend endpoint that converts profile JSON → LaTeX PDF
- Integrate download button in dashboard and profile

### Deliverables

#### 5.1 Store LaTeX Template

**File:** `templates/resume.tex` (new)

Store "Jake's Resume" template from https://www.overleaf.com/latex/templates/jakes-resume/srzjwstzjwxn

Key template variables to replace:
```latex
% Name: \textbf{\Large FIRSTNAME LASTNAME}
% Title: \large Frontend Developer
% Bio: \normalsize Bio text here
% Projects:
% \begin{itemize}
%   \item[-] \textbf{Project Name} – Description
% \end{itemize}
```

#### 5.2 Backend PDF Generation Endpoint

**File:** `app/api/export/pdf/route.js` (new)

```javascript
import { renderFile } from 'pug'; // or use template string
import fetch from 'node-fetch';

export async function POST(req) {
  const { profileId, tailoredId } = await req.json();
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch profile (master or tailored)
  let profile;
  if (tailoredId) {
    const { data } = await supabase
      .from('tailored_resumes')
      .select('*, master_profiles(*)')
      .eq('id', tailoredId)
      .single();
    profile = { ...data.master_profiles, ...data.tailored_content };
  } else {
    const { data } = await supabase
      .from('master_profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();
    profile = data;
  }

  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });

  // Fill LaTeX template
  const texContent = generateLaTeX(profile);

  // Call LaTeX.online API
  const pdfBlob = await compileLaTeX(texContent);

  return new Response(pdfBlob, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${profile.name}-resume.pdf"`,
    },
  });
}

function generateLaTeX(profile) {
  const template = fs.readFileSync('./templates/resume.tex', 'utf-8');
  
  return template
    .replace('{{NAME}}', profile.name)
    .replace('{{TITLE}}', profile.title || '')
    .replace('{{BIO}}', profile.bio || '')
    .replace('{{GITHUB}}', profile.github || '')
    .replace('{{LINKEDIN}}', profile.linkedin || '')
    .replace('{{TWITTER}}', profile.twitter || '')
    .replace('{{SKILLS}}', generateSkillsLaTeX(profile.skills))
    .replace('{{PROJECTS}}', generateProjectsLaTeX(profile.projects))
    .replace('{{EXPERIENCE}}', generateExperienceLaTeX(profile.experience));
}

async function compileLaTeX(texContent) {
  // Option 1: Use LaTeX.online (Free, no auth needed)
  const response = await fetch('https://latex.online/api/v1/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: texContent }),
  });

  if (!response.ok) {
    throw new Error('LaTeX compilation failed');
  }

  return await response.arrayBuffer();
}

function generateSkillsLaTeX(skills) {
  if (!Array.isArray(skills)) return '';
  return skills.map(skill => `  \\item ${skill}`).join('\n');
}

function generateProjectsLaTeX(projects) {
  if (!Array.isArray(projects)) return '';
  return projects
    .map(p => `  \\item \\textbf{${p.name}} -- ${p.description}`)
    .join('\n');
}

function generateExperienceLaTeX(experience) {
  if (!Array.isArray(experience)) return '';
  return experience
    .map(exp => `
  \\textbf{${exp.role}} at ${exp.company} \\hfill ${exp.startMonthYear} -- ${exp.endMonthYear}
  \\begin{itemize}
    \\item ${exp.description}
  \\end{itemize}
    `.trim())
    .join('\n\n');
}
```

#### 5.3 Add Download Button to UI

**File:** `components/DownloadPDFButton.jsx` (new)

```jsx
export default function DownloadPDFButton({ profileId, tailoredId }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        body: JSON.stringify({ profileId, tailoredId }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? '📥 Generating PDF...' : '📥 Download PDF'}
    </button>
  );
}
```

#### 5.4 Feature Gating (Free vs. Pro)

Add check in PDF endpoint:

```javascript
// Check subscription tier
const { data: user } = await supabase
  .from('users')
  .select('subscription_tier')
  .eq('id', user.id)
  .single();

if (user.subscription_tier === 'free') {
  return Response.json(
    { error: 'PDF export is a Pro feature. Upgrade to continue.' },
    { status: 403 }
  );
}
```

### Tasks Breakdown

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Obtain & test Jake's Resume template | Dev | 2 hours | LaTeX knowledge |
| Parse template + create placeholders | Dev | 2 hours | Template obtained |
| Build LaTeX generation function | Dev | 3 hours | Template finalized |
| Integrate LaTeX.online API | Dev | 2 hours | Free API account |
| Create PDF download endpoint | Dev | 3 hours | LaTeX working |
| Build DownloadPDFButton component | Dev | 2 hours | Endpoint ready |
| Test PDF generation | QA | 3 hours | Component integrated |
| Add Pro tier feature gating | Dev | 1 hour | Monetization schema ready |
| Handle special characters (e.g., accents) | Dev | 2 hours | PDF testing done |

**Total: ~20 hours (~2.5 days)**

---

## Phase 6: Monetization & Custom Domain (Week 10+)

### Goals
- Implement Stripe payment processing
- Add custom domain verification and SSL provisioning
- Gate Pro features behind subscription check

### Deliverables (High-level; full implementation separate)

#### 6.1 Stripe Setup

```javascript
// app/api/checkout/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { user_id } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: { name: 'FolioFusion Pro' },
        unit_amount: 29900, // ₹299
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.DOMAIN}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/pricing`,
  });

  return Response.json({ sessionId: session.id });
}
```

#### 6.2 Custom Domain CNAME Setup

Store custom domains in database:

```sql
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  cname_target TEXT DEFAULT 'foliofusion.vercel.app',
  created_at TIMESTAMP DEFAULT NOW()
);
```

Verification endpoint:

```javascript
export async function POST(req) {
  const { domain } = await req.json();
  
  // Perform DNS CNAME lookup
  const records = await resolveCname(domain);
  const isValid = records.includes('foliofusion.vercel.app');

  if (isValid) {
    // Mark as verified in DB
    await supabase
      .from('custom_domains')
      .update({ verified: true })
      .eq('domain', domain);
  }

  return Response.json({ verified: isValid });
}
```

#### 6.3 Feature Gating Middleware

Check subscription in critical endpoints:

```javascript
async function checkProFeature(user_id, feature) {
  const { data: user } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', user_id)
    .single();

  if (feature === 'pdf_export' && user.subscription_tier === 'free') {
    throw new Error('Pro feature');
  }
}
```

---

## Summary Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1: Foundation & Auth | Week 1-2 | User auth, schema upgrade, middleware |
| 2: Master Profile | Week 3-4 | Dashboard, edit form, profile API |
| 3: AI Tailor | Week 5-6 | Gemini integration, score algorithm, tailor UI |
| 4: Rich Media | Week 7 | Embed detection, GitHub API, preview cards |
| 5: PDF Export | Week 8-9 | LaTeX template, PDF generation, download |
| 6: Monetization | Week 10+ | Stripe, custom domains, feature gating |

**Total Effort:** ~120-130 hours (~4 weeks of full-time dev)

---

## Risk Mitigation

### High Risks

1. **Gemini API Rate Limiting**
   - Mitigation: Implement request queuing, cache recent prompts

2. **PDF Generation Failures (Special Characters)**
   - Mitigation: Sanitize LaTeX special characters before template injection

3. **GitHub API Rate Limits (5000 req/hour)**
   - Mitigation: Use caching, batch requests, fall back gracefully

### Medium Risks

1. **Custom Domain SSL Certificate Provisioning**
   - Use Caddy or Let's Encrypt; automate via scripts

2. **Database Migration from Old Schema**
   - Test on staging first; keep backward compatibility briefly

### Low Risks

1. **Supabase Free Tier Limits**
   - Plenty of headroom until significant user growth

---

## Testing Checklist

- [ ] Auth flow (signup, login, logout)
- [ ] Master profile create/update/delete
- [ ] Tailor workflow (upload JD, receive optimized version)
- [ ] Embed rendering (all 4 types)
- [ ] PDF generation and download
- [ ] Pro feature gating
- [ ] Mobile responsiveness
- [ ] Error handling (network, API failures)
- [ ] Performance (page load, API response times)

---

## Success Metrics

1. **Signup → 1st Tailored Resume:** < 5 min
2. **AI Optimization Response:** < 10 sec
3. **PDF Download:** < 5 sec
4. **Page Load Time:** < 2 sec (Core Web Vitals)
5. **Uptime:** 99.5%

