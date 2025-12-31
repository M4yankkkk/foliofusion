# FolioFusion Copilot Instructions

## Project Overview
**FolioFusion** is a dynamic career acceleration platform that evolves from static portfolio generation to an AI-powered resume customization and professional export system. Current state: one-time form to public profile. Target: authenticated dashboard with Master Resume, AI tailor, rich media embeds, and LaTeX PDF export.

**Repository:** M4yankkkk/foliofusion (branch: `customization`)  
**Tech Stack:** Next.js 15 (App Router) + React 19 + Supabase + Tailwind CSS  
**Hosting:** Vercel (frontend) + Supabase (database) + Render (serverless backend)

---

## Architecture Overview

### Current Data Model (`portfolios` table)
```
username (unique), name, title, bio, github, linkedin, twitter,
projects[] {name, description, link},
skills[] (comma-separated string, split on client),
experience[] {company, role, description, startMonthYear, endMonthYear},
theme (preset: blue/green/purple/red/orange or "custom"),
customColor (hex string for custom theme)
```

### Key File Map
- **Landing Page:** `app/page.js` (renders `Landingpage.jsx`)
- **Profile Page:** `app/profile/[username]/page.js` (server component, fetches Supabase, SSR)
- **Theme System:** `ThemeSetter.js` (client component, sets CSS variables dynamically)
- **Form Component:** `components/PortfolioForm.jsx` (client component, handles multi-section form with dynamic arrays)
- **Global Styles:** `app/globals.css` (785 lines, includes hero section, profile layout, floating icon animations)
- **API Route:** `app/api/saveProfile/route.js` (currently unused; new features should extend this)
- **Supabase Client:** `lib/supabaseClient.js` (instantiates client with anon key)

### Design System (CSS Variables)
Theme colors are stored in `globals.css` and applied as:
- `--accent-color`: Theme hex
- `--accent-color-rgb`: RGB tuple (for rgba backgrounds)
- `--accent-dark`: Darkened variant
- `--accent-text`: Auto-determined white/dark for contrast

**Important:** Color manipulation functions exist in profile page (`hexToRgb`, `darkenColor`, `getBrightness`). Refactor these into `lib/colorUtils.ts` when adding new color features.

---

## Critical Workflows & Patterns

### Form State Management (Multi-Section Pattern)
- **Location:** `PortfolioForm.jsx` (373 lines)
- **Pattern:** `formData` state object with nested arrays (`projects[]`, `experience[]`)
- **Array Operations:** Use `handleProjectChange()` / `handleExperienceChange()` as template; create handler for skills, achievements, etc.
- **Example:** Adding new section (e.g., "Certifications"):
  ```jsx
  const [formData, setFormData] = useState({ 
    ...formData,
    certifications: [{ name: "", issuer: "", date: "" }] 
  });
  const handleCertificationChange = (index, field, value) => {
    const newCerts = [...formData.certifications];
    newCerts[index][field] = value;
    setFormData({ ...formData, certifications: newCerts });
  };
  ```

### Database Operations
- **Read:** Server-side SSR in `[username]/page.js` using `supabase.from('portfolios').select(...).ilike()`
- **Write:** Client-side form submission via `.insert()` in `PortfolioForm.jsx`
- **Pattern for Upsert:** Use `.upsert()` when implementing Master Profile edits (requires CONFLICT policy on DB)
- **Important:** Profile page uses `ilike` for case-insensitive username lookup; maintain this in new queries

### Styling & Responsive Design
- **Approach:** Hybrid of Tailwind (`tailwind.config.js`) and Global CSS (`globals.css`)
- **Color Application:** CSS variables injected at runtime via `ThemeSetter.js`
- **Responsive Layout:** Mobile-first breakpoints in `globals.css` (search for `@media max-width`)
- **Hero Section:** Fixed background with floating animated icons (`Squares.jsx` from React Bits)

### Authentication & Authorization
- **Current State:** None (public profile pages, form-based creation)
- **Plan for 2.0:** Supabase Auth (Google/Email OAuth)
- **New Tables Needed:** `users` (linked to auth), `master_profiles`, `tailored_resumes`

---

## Implementation Priorities (Phased Approach)

### Phase 1: Foundation (Week 1-2)
1. **Schema Creation:** Create `users`, `master_profiles`, `tailored_resumes` tables in fresh Supabase project
2. **Auth Setup:** Integrate Supabase Auth (Google + Email) into layout
3. **Dashboard Shell:** Create `/app/dashboard` (protected route) with basic layout
4. **Note:** Starting fresh with new Supabase project—no data migration needed from old `portfolios` table

### Phase 2: Master Profile Management (Week 3-4)
1. **Dashboard View:** Display user's Master Profile + list of tailored versions
2. **Edit Form:** Refactor `PortfolioForm` into editable component at `/dashboard/profile/edit`
3. **Upsert Logic:** Update API route to support profile edits (not just inserts)

### Phase 3: AI Tailor Engine (Week 5-6)
1. **Tailor Form UI:** New page at `/dashboard/tailor` with JD input + split-view preview
2. **Backend Endpoint:** New API route `/api/tailor` that:
   - Accepts `masterProfileId` + `jobDescription` text
   - Calls Google Gemini API (free tier) with rewriting prompt
   - Calculates keyword match score (before/after)
   - Saves result as record in `tailored_resumes` table
3. **Match Score Algorithm:** Simple cosine similarity or keyword overlap (see: `lib/scoreUtils.ts`)

### Phase 4: Rich Media Embeds (Week 7)
1. **Embed Detection:** Utility in `lib/embedUtils.ts` that detects URL patterns:
   - `figma.com/file/` → Figma iframe
   - `youtube.com/watch?v=` → YouTube embed
   - `github.com/` → GitHub Repo Card (fetch via API)
   - Fallback → Open Graph preview card
2. **Portfolio Display:** Refactor project rendering in profile to use embed library
3. **GitHub API Integration:** Add rate-limited GitHub API client in backend

### Phase 5: PDF Export (Week 8-9)
1. **LaTeX Template:** Store "Jake's Resume" template (`.tex` file) in `/templates`
2. **Backend Route:** New endpoint `/api/export/pdf` that:
   - Receives profile JSON
   - Injects data into template using string replacement
   - Calls `latex.online` API or self-hosted Render container
   - Returns PDF blob
3. **Frontend Trigger:** Add "Download PDF" button in profile/dashboard

### Phase 6: Monetization & Custom Domain (Week 10+)
1. **Stripe Integration:** Add payment processing for Pro tier
2. **Custom Domain Logic:** Verify DNS CNAME, auto-provision SSL via Caddy/Let's Encrypt
3. **Feature Gating:** Middleware to check `subscription_tier` before allowing embeds, PDFs, etc.

---

## Key Dependencies & APIs

- **Google Gemini API (Free):** Prompt-based AI rewriting for resume tailor
- **GitHub API (Free):** Repository data (stars, language) for repo cards
- **LaTeX.online (Free):** PDF generation from `.tex` → PDF
- **Supabase Auth:** Built-in, no cost
- **Render (Free Tier):** Serverless backend if needed

---

## Common Gotchas & Patterns to Preserve

1. **Username Case-Insensitivity:** Always use `.ilike('username', user_input.trim())` not `.eq()`
2. **Month-Year Format:** Stored as `YYYY-MM` strings; format for display using `new Date()` locale (see `formatMonthYear()` in profile page)
3. **Skills Array Handling:** Currently stored as CSV string in DB, split on client (`split(",").map(s => s.trim())`)—consider moving to true JSON array in Phase 1 schema upgrade
4. **Theme Color Calculation:** Hex → RGB conversion needed for CSS `rgb()` backgrounds; use existing `hexToRgb()` function from profile page
5. **Server vs. Client Components:**
   - Profile page must be server component for SSR (SEO)
   - Forms and interactive elements must be client components (`"use client"`)
   - Dashboard will mix both (e.g., server wrapper + client children)

---

## Testing Strategy

- **Unit Tests:** Utility functions (`colorUtils.ts`, `scoreUtils.ts`, `embedUtils.ts`)
- **Integration Tests:** API routes + Supabase queries (use Supabase Test Client)
- **E2E Tests:** Playwright for auth flow, form submission, profile view
- **Manual Testing:** Always test on mobile (responsive design is critical)

---

## Code Quality Standards

- **Linting:** ESLint configured in `eslint.config.mjs`
- **Naming:** camelCase for JS variables/functions, kebab-case for CSS classes
- **Comments:** Use JSDoc for complex functions; avoid over-commenting obvious code
- **Error Handling:** Always wrap Supabase queries in try-catch; return 404/500 appropriately
- **Performance:** Lazy-load components with `React.lazy()` where appropriate; optimize images with `next/image`

---

## Development Commands

```bash
npm run dev      # Start Next.js dev server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Run production build locally
npm run lint     # Run ESLint
```

---

## Quick Reference: Adding a New Feature

1. **Schema:** Add columns to `master_profiles` table (or new table)
2. **Form:** Add input field to `PortfolioForm.jsx` component + handler
3. **API:** Create/update route in `app/api/*` to handle the data
4. **Display:** Update profile page (`[username]/page.js`) to render new field
5. **Styling:** Add CSS in `globals.css` or component-specific CSS module
6. **Test:** Verify form → API → DB → Display flow end-to-end

