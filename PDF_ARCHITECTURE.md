# PDF Export Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                             │
│                                                                 │
│  Dashboard → Click "Download Resume" Button                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 DownloadResumeButton.jsx                        │
│                    (Client Component)                           │
│                                                                 │
│  1. Show "Generating PDF..." loading state                      │
│  2. POST to /api/export/pdf                                     │
│     Body: { resumeId, type }                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  /api/export/pdf/route.js                       │
│                    (API Route Handler)                          │
│                                                                 │
│  1. Verify authentication (Supabase Auth)                       │
│  2. Fetch profile data:                                         │
│     - If type="master": Fetch master_profiles                   │
│     - If type="tailored": Fetch tailored_resumes + master       │
│  3. Merge tailored content with master (if applicable)          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               lib/latexGenerator.js                             │
│              generateLatexResume(profile)                       │
│                                                                 │
│  1. Read LaTeX template file                                    │
│  2. Escape special characters in user data                      │
│  3. Generate sections:                                          │
│     - Header (name, email, phone, social links)                 │
│     - Education (university, degree, date)                      │
│     - Experience (company, role, location, dates, bullets)      │
│     - Projects (name, tech stack, link, bullets)                │
│     - Skills (comma-separated list)                             │
│  4. Replace template placeholders                               │
│  5. Return complete LaTeX string                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               lib/latexGenerator.js                             │
│             compileLatexToPdf(latexContent)                     │
│                                                                 │
│  1. POST to https://latexonline.cc/compile                      │
│  2. Send LaTeX content as form-encoded string                   │
│  3. Wait for PDF compilation (2-5 seconds)                      │
│  4. Receive PDF binary response                                 │
│  5. Convert to Buffer and return                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  /api/export/pdf/route.js                       │
│                    (Return Response)                            │
│                                                                 │
│  1. Set Content-Type: application/pdf                           │
│  2. Set Content-Disposition: attachment                         │
│  3. Set filename: resume-{name}-{type}.pdf                      │
│  4. Return PDF buffer                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 DownloadResumeButton.jsx                        │
│                    (Handle Response)                            │
│                                                                 │
│  1. Receive PDF blob from fetch()                               │
│  2. Create object URL from blob                                 │
│  3. Create invisible <a> element                                │
│  4. Set href to object URL                                      │
│  5. Set download attribute with filename                        │
│  6. Trigger click() to start download                           │
│  7. Cleanup: revoke object URL, remove <a> element              │
│  8. Reset loading state                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      Dashboard Page                        │
│                   (Server Component)                       │
│                                                            │
│  ┌──────────────────────┐  ┌─────────────────────────┐   │
│  │  Master Profile Card │  │ Tailored Resumes Grid   │   │
│  │                      │  │                         │   │
│  │  ┌────────────────┐  │  │  ┌──────────────────┐  │   │
│  │  │ Download       │  │  │  │ Download         │  │   │
│  │  │ Resume         │  │  │  │ Resume           │  │   │
│  │  │ Button         │  │  │  │ Button (each)    │  │   │
│  │  │ (Master)       │  │  │  │ (Tailored)       │  │   │
│  │  └────────────────┘  │  │  └──────────────────┘  │   │
│  └──────────────────────┘  └─────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Database Schema Extensions

```
master_profiles
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── name (TEXT) ────────────────┐ Required for PDF
├── title (TEXT)                │
├── bio (TEXT)                  │
├── email (TEXT) ───────────────┤ NEW - Required for PDF header
├── phone (TEXT) ───────────────┤ NEW - Optional for PDF header
├── location (TEXT) ────────────┤ NEW - Optional for PDF header
├── university (TEXT) ──────────┤ NEW - Education section
├── degree (TEXT) ──────────────┤ NEW - Education section
├── graduation_date (TEXT) ─────┤ NEW - Education section
├── github (TEXT)               │
├── linkedin (TEXT)             │
├── twitter (TEXT)              │
├── projects (JSONB) ───────────┤ Extended with tech_stack field
│   └── [{ name, description, link, tech_stack }]
├── experience (JSONB) ─────────┤ Extended with location field
│   └── [{ company, role, description, location, 
│          start_month_year, end_month_year }]
├── skills (JSONB)              │
├── theme (TEXT)                │
└── custom_color (TEXT)         │
```

## LaTeX Template Structure

```latex
\documentclass[letterpaper,11pt]{article}

% Preamble with packages and formatting
...

\begin{document}

% HEADING
\begin{center}
    \textbf{\Huge {{NAME}}}
    \small {{PHONE}} | {{EMAIL}} {{SOCIAL_LINKS}}
\end{center}

% EDUCATION SECTION
\section{Education}
    {{EDUCATION}}  ← Generated from university/degree/grad_date

% EXPERIENCE SECTION  
\section{Experience}
    {{EXPERIENCE}}  ← Generated from experience JSONB array
    % Format: \resumeSubheading{Company}{Location}{Role}{Dates}
    %         \resumeItemListStart
    %           \resumeItem{Bullet point}
    %         \resumeItemListEnd

% PROJECTS SECTION
\section{Projects}
    {{PROJECTS}}  ← Generated from projects JSONB array
    % Format: \resumeProjectHeading{Name | Tech Stack}{Link}
    %         \resumeItemListStart
    %           \resumeItem{Description bullet}
    %         \resumeItemListEnd

% SKILLS SECTION
\section{Technical Skills}
    {{SKILLS}}  ← Generated from skills JSONB array (comma-joined)

\end{document}
```

## Error Handling Flow

```
User clicks Download
       │
       ▼
Try {
    Check auth ─────────────→ [401] Redirect to login
       │
       ▼
    Fetch profile ──────────→ [404] Profile not found error
       │
       ▼
    Generate LaTeX ─────────→ [500] Template error
       │
       ▼
    Compile PDF ────────────→ [500] LaTeX.online API error
       │                           - Network timeout
       │                           - LaTeX syntax error
       │                           - Rate limit exceeded
       ▼
    Return PDF
} Catch {
    Show error message
    Reset button state
}
```

## Performance Considerations

| Step | Time | Cacheable |
|------|------|-----------|
| Auth check | 50-100ms | ✅ Session |
| DB query | 50-200ms | ✅ Can cache profile |
| LaTeX generation | 10-50ms | ✅ Can cache per profile |
| PDF compilation | 2-5s | ✅ Can cache compiled PDF |
| Download transfer | 100-500ms | ❌ |

**Total**: ~3-6 seconds for fresh generation

### Optimization Opportunities:
1. **Cache compiled PDFs** in Supabase Storage with key `{profile_id}_{updated_at}.pdf`
2. **Pre-generate PDFs** when profile is saved
3. **Client-side PDF generation** with react-pdf (instant, but less professional)
4. **Self-hosted LaTeX compiler** on Render (faster, more control)
