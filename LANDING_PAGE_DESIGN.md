# FolioFusion Landing Page Design v2.0
## "Organic Modernism" + Feature-Rich Bento Grid

## 🎯 Overall Strategy
**Goal:** Position FolioFusion as a *career cultivation platform*, not a resume hack. Transform static PDFs into living, growing professional ecosystems.

**Core Message:** "Cultivate Your Career. Automate the Rest."

**Design Philosophy:** Blend **Attio's** modular Bento grid layout with an **organic, earthy aesthetic** inspired by architecture, craft, and natural growth. The resume becomes a carefully curated professional blueprint—not a game to beat algorithms.

---

## 🌱 Design Philosophy: "Organic Modernism"

Instead of the standard SaaS "AI Purple/Blue," FolioFusion adopts **Organic Modernism**—a blend of:

### **Aesthetic Foundations**
- **Attio / Linear / Bento:** Modular grid layout, clear hierarchy, professional structure
- **Kinfolk / Architectural Digest:** Generous whitespace, serif headlines, natural materials
- **Paper & Ink:** Tactile textures, earth-inspired colors, a sense of *craftsmanship*

### **Why This Approach?**
This signals **trust, longevity, and professionalism**—positioning the resume not as a "hack" to beat algorithms, but as a **carefully curated professional blueprint**. The user is *cultivating* their career, not *gaming* a system.

### **Key Visual Characteristics**
1. **Warm, Off-White Backgrounds** (`#FAFAF8`) - Feels like quality paper, not harsh digital white
2. **Earthy Color Accents:**
   - Sage Green (`#6B9F7F`) - Growth, success, AI optimization
   - Terracotta (`#C9824A`) - Warmth, precision, PDFs, CTAs
   - Slate Blue (`#5B7C99`) - Depth, analytics, data, links
3. **Soft Shadows & Borders** - No harsh lines, diffused light
4. **Serif Headlines** - Signals craft and tradition (Plus Jakarta Sans or Merriweather)
5. **Ample Whitespace** - Breathing room, premium feel
6. **Organic Shapes** - Curves, flowing visualizations (seeds, funnels, nodes)

### **User Journey Metaphor: "Cultivation"**
1. **Plant** (Master Profile) - User inputs all raw data (the roots)
2. **Tend** (AI Tailor) - AI selects relevant branches for each job
3. **Harvest** (Export/Share) - Generate PDFs or share living links (the fruit)

This shifts the mindset from "rushing to apply" to "thoughtfully growing" your professional presence.

---

### 1. **Navigation Bar** (Sticky)
```
Logo (left) | Features | Pricing | Templates | [Login] [Get Started →]
```
- **Micro-interactions:**
  - Blur background on scroll (backdrop-filter)
  - Smooth shadow appearance after 50px scroll
  - Nav links: underline animation on hover (slide in from left)
  - CTA button: subtle scale (1.02) + glow on hover
  - Mobile: hamburger → slide-in drawer with stagger animation

---

### 2. **Hero Section** (Above the fold - "The Seed")
```
[Organic gradient background - paper texture overlay]

        Cultivate Your Career

    Stop editing resumes for every job.
    Build a living blueprint, then let AI
        handle the repetition.

    [Start Free →]  [See How It Works ▶]

    [Floating seed → expands into grid animation]
```

**Components:**
- **Headline:** 
  - "Cultivate Your Career" (serif, warm tone)
  - Subtle animation: Text appears with slight fade + scale (1.02→1)
- **Subheadline:** 
  - Focus on *cultivation* not *hacking*
  - Fade in with 0.3s delay
  - Max-width 600px, centered
- **CTAs:**
  - Primary (Terracotta): "Start Free" with subtle glow
  - Secondary (Slate): "See How It Works" ghost button
- **Background:**
  - Soft gradient mesh (cream to light sage)
  - Subtle paper texture overlay (adds tactile feel)
  - Floating organic shapes (seed, circles, curves)
  - Parallax on scroll (0.5x speed)
- **Hero Image:**
  - 3D seed morphing into Bento grid (Rive animation)
  - Matte finish, earthy tones
  - Slow float animation (breathing effect)

**Micro-interactions:**
- Scroll → seed expands, hero fades
- CTA hover → subtle glow (terracotta), 1.02 scale
- Mouse move → gradient follows cursor (slow, 10% movement max)

---

### 3. **Social Proof Bar** (Logos)
```
   "Trusted by professionals at"
   [Google] [Meta] [Netflix] [Stripe] [Vercel]
```
- Infinite horizontal scroll animation (duplicate set)
- Grayscale logos, color on hover
- Pause on hover

---

### 4. **Problem Statement** (Dark section with contrast)
```
         The Old Way is Broken

[Icon] Generic Templates    [Icon] Manual Tailoring    [Icon] ATS Black Holes
  Same resume for every      Hours spent rewriting      90% rejected before
  job application            for each position          human sees them

[Icon] No Visibility        [Icon] Outdated Sharing
  Can't track who sees       Emails PDFs that get
  your resume                lost in inboxes

         ↓ There's a better way ↓
```

**Micro-interactions:**
- Icons: scale + rotate on scroll into view
- Text: fade up with stagger (0.1s delay each)
- Arrows: animated path draw

---

### 5. **Solution/Features Grid** (The Bento Grid - "Organic Modernism" Attio-inspired)

```
┌─────────────────┬──────────────┐
│                 │              │
│  Master Root    │  LaTeX       │
│  (Profile)      │  Precision   │
│  2x2 (HERO)     │  1x2 (TALL)  │
│                 │              │
├─────────────────┴──────────────┤
│                                │
│  AI Pruning (Tailor)           │
│  2x1 (WIDE - "Only what matters")
│                                │
├─────────┬────────┬─────────────┤
│  Growth │Share-  │Integrations │
│Analytics│ able   │(GitHub,etc) │
│  1x1    │ Links  │ 1x1         │
│         │ 1x1    │             │
└─────────┴────────┴─────────────┘
```

**Card Styling:**
- **Border:** 1px soft sand color (`#E8E6E2`)
- **Radius:** 12px (gentle, rounded)
- **Shadow:** Diffused, soft (0 8px 20px rgba(0,0,0,0.08))
- **Hover:** 
  - Lift 2px up
  - Shadow increase (0 16px 40px rgba(0,0,0,0.12))
  - Border subtle glow (sage green for growth, terracotta for warmth)
  - Background transitions to `#F5F3F0`
- **Color Accents:**
  - Growth features: Sage green (`#6B9F7F`)
  - Warmth/Action: Terracotta (`#C9824A`)
  - Depth/Analytics: Slate blue (`#5B7C99`)

**Animation on Scroll Into View:**
- Cards appear with stagger (100ms between each)
- Fade in + slide up (20px)
- Easing: ease-out, 0.6s duration

---

### **Card 1: The Master Root (Master Profile) - 2x2 (HERO CARD)**
- **Headline:** "One Source of Truth" (serif, charcoal)
- **Tagline:** "Never edit a resume again." (sans-serif, muted)
- **Visual:** Central node (avatar) connecting to radiating rings
  - Rings pulse gently (2s cycle, sage green glow on hover)
  - Animated labels: "Skills," "Experience," "Projects"
  - Interactive: Rings expand on hover, showing data count
- **Description:** "Store everything once. Reuse everywhere. All your skills, projects, and experience organized in one place."
- **Demo/Interaction:**
  - User types into form field (animated typing)
  - Data flows visually into central node
  - Radiates outward as rings expand
  - Color: Sage green (`#6B9F7F`) for growth theme
  - Influence: Attio's "Objects" / database-like structure

---

### **Card 2: LaTeX Precision (PDF Export) - 1x2 (TALL)**
- **Headline:** "Code to Perfection" (serif, charcoal)
- **Tagline:** "Typographically flawless." (sans-serif, muted)
- **Visual:** Split screen slider effect
  - Left: LaTeX code snippet (monospace, transparent dark background)
  - Right: Rendered PDF preview (warm cream `#E8D9C8` background)
  - Vertical slider in middle for interactivity
  - User can drag slider to see transition from code → rendered output
- **Description:** "Generate professionally typeset PDFs using LaTeX. Perfect kerning, spacing, and formatting every time. Multiple templates: Ivy League, Modern Sans, Classic Serif."
- **Demo/Interaction:**
  - Slider animates left → right (shows LaTeX code → PDF)
  - Smooth transition over 1s
  - Template badges visible (selectable)
  - Color: Terracotta (`#C9824A`) for precision/quality
  - **Power User Mode:** "View Raw .tex" button to show code editing

---

### **Card 3: AI Pruning (Tailor) - 2x1 (WIDE)**
- **Headline:** "Designed to be Read" (serif, charcoal)
- **Tagline:** "Only what matters, for each job." (sans-serif, muted)
- **Visual:** Organic funnel shape (flowing visualization)
  - Top: Job description text block (fades downward)
  - Middle: Funnel narrows with animated flow
  - Sage green highlight shows filtered keywords
  - Bottom: Tailored resume emerges (green highlight indicates changes)
- **Description:** "Paste a job description. AI reads your Master Profile and crafts a tailored version that speaks directly to the role."
- **Demo/Interaction:**
  - User types/pastes JD in left panel
  - Real-time preview updates on right panel
  - Keywords match highlighted in green
  - Metrics shown: "45 bullets → 12 most relevant" / "ATS: 45% → 92%"
  - Before/After toggle to compare versions
  - Color: Sage green (`#6B9F7F`) for growth/optimization

---

### **Card 4: Growth Analytics - 1x1**
- **Headline:** "See What Resonates" (serif, charcoal)
- **Tagline:** "Know who's viewing." (sans-serif, muted)
- **Visual:** Minimalist line graph
  - Single slate blue line (`#5B7C99`) on cream background
  - Real-time data blip animation (dot appears on line)
  - Timestamp label: "Recruiter from Google viewed 2m ago"
  - Heatmap overlay option (expandable)
- **Description:** "Track profile views, downloads, and hover behavior. Understand what catches recruiters' eyes."
- **Demo/Interaction:**
  - Live counter incrementing (view count updates)
  - Line graph animates to show trend
  - Hover tooltip shows source location + time
  - Color: Slate blue (`#5B7C99`) for data depth

---

### **Card 5: Shareable Links - 1x1**
- **Headline:** "Share Your Story" (serif, charcoal)
- **Tagline:** "Live profiles, not PDFs." (sans-serif, muted)
- **Visual:** Glowing URL pill + QR code preview
  - Example URL: `foliofusion.com/sarah-chen` (clickable, copy-to-clipboard)
  - QR code appears on hover (fade-in animation)
  - Mini browser window preview (shows what link opens to)
- **Description:** "Generate a shareable link to your interactive portfolio. Embeds, analytics, and live updates included."
- **Demo/Interaction:**
  - Click URL → toast notification "Copied!"
  - QR code animates in (scale + fade, 0.3s)
  - Click QR → downloads PNG
  - Link preview opens profile in new tab
  - Color: Slate blue (`#5B7C99`) for links

---

### **Card 6: Integrations - 1x1**
- **Headline:** "Built to Connect" (serif, charcoal)
- **Tagline:** "Your whole presence." (sans-serif, muted)
- **Visual:** Logo grid (GitHub, Figma, LinkedIn, etc.)
  - Logos: Grayscale by default, muted tones
  - Hover: Individual logo highlights in earthy color
  - Connected lines between logos (suggest integration)
- **Description:** "Embed GitHub repos, Figma prototypes, and more. Or pull data directly from LinkedIn."
- **Demo/Interaction:**
  - Logo hover: Color fills in (GitHub → orange, Figma → purple, etc.)
  - Click example: Shows embedded GitHub repo card render
  - Connected line animation (draws on hover)
  - Color: Neutral with accent-on-hover

---

**Card 5: Shareable Links (THE DIFFERENTIATING POINT)**
- "Share Your Story, Your Way"
- Key features:
  - Generate public profile link instantly
  - QR code for easy sharing (email, LinkedIn, resume)
  - View tracking & analytics (who viewed, when, from where)
  - Custom domain support (Pro tier)
  - Embed-rich profiles (Figma, YouTube, GitHub)
  - One link, infinite tailored versions
- Demo: 
  - Link copy animation
  - QR code generation
  - Profile opens in new tab with embeds
  - Real-time view counter

---

**Card 4: ATS-Optimized PDFs**
- "Beat the Bots, Impress Humans"
- Demo: Side-by-side ATS score 45% → 92%

**Card 5: Shareable Links (NEW - DIFFERENTIATING POINT)**
- "Share Your Story, Your Way"
- Demo: Link generated → QR code appears → profile opens in browser with embeds
- Highlight: Public profile URL, custom domain support, view tracking

---

### 6. **Shareable Links Deep Dive** (Full narrative section - "The Harvest")
```
          Share Your Work, Live

Instead of emailing static PDFs that get buried,
    your profile lives online—growing, updating, tracking.

One Link = Infinite Opportunity

┌──────────────────────────────────────────────────────────┐
│                                                          │
│ Your Link: foliofusion.com/sarah-chen                   │
│ (or use custom domain: sarah-chen.dev)                  │
│                                                          │
│ ✓ Generate QR Code   [QR ICON]  Instant sharing        │
│ ✓ View Analytics     [📊]       See who cares          │
│ ✓ Live Embeds        [🎨]       Showcase your work     │
│ ✓ "Hire Me" Button   [📅]       Book a call            │
│                                                          │
└──────────────────────────────────────────────────────────┘

Why Living > Static PDF

Email PDF → Static snapshot, no tracking, outdated in weeks
Share Link → Live, interactive, analytics, always current, embeds included
```

**Micro-interactions:**
- Copy link: Toast notification "Copied!"
- QR code: Appears with smooth scale + fade animation
- Analytics panel: Real-time view counter updates
- "Hire Me" button: Floating CTA on the shared profile

---

### 7. **Interactive Demo Section** (Full-width, light bg)
```
           See It In Action

[Left: Job Description Textarea]  [Right: Live Preview Panel]
          ↓ AI Magic ↓
     [Tailored Resume Preview]

         [Try It Now →]
```

**Micro-interactions:**
- Textarea: Character count, typing triggers "analyzing..." badge
- Preview: Shimmer loading skeleton → content fades in
- Highlight changed words (green underline)
- ATS score gauge animates from 0 to final value
- Hover keywords → tooltip showing "Added by AI"

---

### 8. **Template Showcase** (Horizontal scroll)
```
           Beautiful Templates

  ← [Jake's Resume] [Modern] [Minimal] [Creative] →
        (currently active template highlighted)
```

- Scroll snap for each template
- Hover: Preview PDF opens in modal with zoom animation
- Active template: subtle glow border
- Drag to scroll (custom cursor: grab → grabbing)

---

### 8. **Testimonials** (Animated cards)
```
    "Landed 3 interviews in one week"
    - Sarah Chen, Software Engineer

    [Rotate through 5-6 testimonials]
```

- Auto-rotate every 5s with fade transition
- Dots navigation
- Hover: pause auto-rotate
- Avatar images with border glow in accent color

---

### 9. **Stats Section** (Big numbers)
```
  [10,000+]        [500K+]          [95%]
  Resumes Created  ATS Keywords     Success Rate
```

- Count-up animation on scroll into view (using CountUp.js)
- Numbers in gradient text
- Icons above each stat (animated)

---

### 10. **Pricing** (3-tier cards)
```
┌───────────────────┬────────────────────┬────────────────┐
│      Free         │        Pro         │  Enterprise    │
│      $0/mo        │      $12/mo        │    Custom      │
│                   │                    │                │
│ • Master Profile  │ • Everything in    │ • Everything   │
│ • 3 Tailored      │   Free, plus:      │   in Pro,      │
│   Resumes         │ • Unlimited PDFs   │   plus:        │
│ • Basic Embeds    │ • All Embeds       │ • Custom       │
│ • Shareable Link  │ • Analytics        │   Domain       │
│ • Public Profile  │ • Custom Domain    │ • SSO          │
│ • View Analytics  │ • Priority Support │ • API Access   │
│                   │                    │ • Dedicated    │
│ [Start Free]      │ [Upgrade Now]      │   Support      │
│                   │ ⭐ Most Popular   │                │
│                   │                    │ [Contact Sales]│
└───────────────────┴────────────────────┴────────────────┘

Highlights:
• Shareable links with QR codes (ALL tiers)
• View tracking included (FREE tier)
• Custom domain unlocks at Pro tier
```

**Micro-interactions:**
- Hover: Card lifts with shadow
- Pro card: "Most Popular" badge with pulse animation
- Toggle: Monthly/Annual (slide animation)
- Annual: "Save 20%" badge bounces on toggle
- Feature checkmarks: appear with stagger on scroll

---

### 11. **FAQ** (Accordion)
```
▼ How does AI tailoring work?
▶ Is my data secure?
▶ Can I cancel anytime?
```

- Click: Smooth expand with height animation
- Icon rotates 180° on expand
- Content fades in
- Only one open at a time

---

### 12. **Final CTA** (Full-width, gradient bg)
```
          Ready to Land Your Dream Job?

      Join 10,000+ professionals who upgraded
            their career with FolioFusion

           [Get Started Free →]

        No credit card required • 5-min setup
```

- Background: Animated gradient (same as hero)
- Button: Large, glowing, pulsing shadow
- Trust badges below (lock icon + "Secure" text)

---

### 13. **Footer**
```
FolioFusion

Product          Resources        Company
Features         Docs             About
Pricing          Blog             Careers
Templates        Support          Contact

© 2026 • Terms • Privacy
[Twitter] [LinkedIn] [GitHub]
```

- Social icons: Hover → color + slight lift
- Links: Hover → underline slide-in
- Minimal, dark background

---

## 🎨 Design System (Organic Modernism)

### **Color Palette**
```css
/* Backgrounds & Neutrals */
--background-primary: #FAFAF8 (Off-white / Alabaster - warm, paper-like)
--background-secondary: #F5F3F0 (Soft sand)
--text-primary: #2C2C2A (Deep charcoal / Graphite)
--text-secondary: #6B6B68 (Muted gray)
--border-color: #E8E6E2 (Sand / Beige - soft borders)

/* Accents - Organic Colors */
--accent-growth: #6B9F7F (Sage green / Moss - Success, AI, active states)
--accent-warmth: #C9824A (Terracotta / Clay - CTAs, highlights, PDFs)
--accent-depth: #5B7C99 (Slate blue / River - Analytics, links)
--accent-light: #E8D9C8 (Warm cream - hover states)

/* Shadows - Diffused light, organic feel */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08)
--shadow-md: 0 8px 20px rgba(0, 0, 0, 0.12)
--shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.15)
```

### **Typography**
```css
--font-display: "Plus Jakarta Sans" or "Merriweather" (Serif for headings - craft)
--font-body: "Inter" (Clean sans-serif for body - 400-600 weight)
--font-mono: "JetBrains Mono" (For code snippets)

Weights:
- Headings: 700-900
- Body: 400-500
- Callouts: 600
```

### **Spacing & Borders**
```
Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
Border Radius: 8px (Soft, modern rounded corners)
Card Radius: 12px (Slightly more pronounced for feature cards)
```

### **Key Visual Elements**
- Soft drop shadows (no harsh borders)
- Paper-like textures (subtle grain overlay on hero)
- Muted, earthy color accents
- Generous whitespace
- Organic shapes (curves, flowing lines in backgrounds)

---

---

## ⚡ Micro-interactions Library

### **1. Magnetic Buttons**
- Cursor within 50px → button moves toward cursor (subtle, 20% distance)
- On click → ripple effect from click point

### **2. Scroll Progress**
- Thin line at top of page fills as user scrolls
- Color matches accent

### **3. Parallax Sections**
- Background moves slower than foreground (0.5x speed)
- Apply to hero, final CTA

### **4. Cursor Effects**
- Custom cursor: small circle follows mouse
- On hover interactive elements → circle expands
- On click → circle contracts then expands (ripple)

### **5. Section Transitions**
- Fade in + slide up when 20% visible (Intersection Observer)
- Stagger children by 0.05s

### **6. Card Hovers**
```css
.card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  border-color: var(--primary);
}
```

### **7. Loading States**
- Skeleton screens (shimmer animation)
- Button loading: spinner replaces text
- Progress bars: smooth fill animation

### **8. Toast Notifications**
- Slide in from top-right
- Auto-dismiss after 3s
- Swipe right to dismiss

### **9. Modal Animations**
```
Open: Scale from 0.95 → 1, opacity 0 → 1 (0.2s ease-out)
Close: Scale 1 → 0.95, opacity 1 → 0 (0.15s ease-in)
Backdrop: Fade in/out
```

### **10. Number Counters**
- Trigger on scroll into view
- Count from 0 to target over 1.5s
- Easing: ease-out

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Phone landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

**Mobile Changes:**
- Hero: Stack vertically, smaller mockup
- Features: Single column grid
- Pricing: Horizontal scroll snap
- Navigation: Hamburger menu
- Reduce animations (prefers-reduced-motion)

---

## 🚀 Performance Optimizations

1. **Lazy load images** below fold
2. **Code split** by section (dynamic imports)
3. **Preload critical fonts** (Inter woff2)
4. **Optimize animations** (transform/opacity only, no layout thrashing)
5. **Debounce scroll handlers** (use requestAnimationFrame)
6. **Use CSS containment** for isolated sections
7. **Intersection Observer** for scroll animations (not scroll events)
8. **Prefetch** on link hover

---

## 🛠 Tech Stack Recommendations

**Animations:**
- Framer Motion (React)
- GSAP (ScrollTrigger plugin)
- Lottie for complex animations

**UI Components:**
- Radix UI primitives (accessible)
- Tailwind CSS for styling
- shadcn/ui components

**3D/Graphics:**
- Spline for 3D mockups
- Three.js for WebGL effects (optional)

**Utilities:**
- react-intersection-observer
- react-countup
- react-fast-marquee (logo scroll)

---

## 📊 Conversion Optimization

1. **Above-fold CTA** (hero section)
2. **Social proof** early (logo bar)
3. **Interactive demo** (reduces friction)
4. **Clear pricing** (transparent, no hidden fees)
5. **Trust signals** (testimonials, stats, secure badges)
6. **Multiple CTAs** (hero, after features, pricing, final)
7. **Exit intent popup** (offer discount/guide)

---

## ✅ Checklist Before Launch

- [ ] Mobile responsive (test on real devices)
- [ ] Fast load time (<3s LCP)
- [ ] Accessibility audit (WCAG AA)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Analytics tracking (Vercel Analytics + Plausible)
- [ ] A/B test hero copy
- [ ] Heatmap tracking (Hotjar)
- [ ] Browser compatibility (Chrome, Safari, Firefox)

---

## 🎬 Implementation Phases (Organic Modernism + Bento Grid)

### **Phase 1: Foundation & Design System**
- [ ] Color palette implementation (earthy tones in CSS)
- [ ] Typography setup (serif headlines, clean body)
- [ ] Navigation bar (sticky, minimalist)
- [ ] Paper texture assets (subtle overlay)
- [ ] Soft shadow system

### **Phase 2: Hero Section**
- [ ] Gradient background (cream to light sage)
- [ ] Organic shapes / floating seeds (SVG or CSS)
- [ ] Serif headline with subtle animation
- [ ] Seed morphing animation (Rive / Framer Motion)
- [ ] CTA buttons with terracotta/slate accents

### **Phase 3: Social Proof & Problem Statement**
- [ ] Logo bar (marquee, earthy logos)
- [ ] Problem statement section (dark background option)
- [ ] Icons with craft aesthetic

### **Phase 4: Bento Grid (CORE)**
- [ ] Card component (soft border, diffused shadow)
- [ ] Card 1: Master Root (node animation, radiating rings)
- [ ] Card 2: LaTeX Precision (slider interaction, code ↔ PDF)
- [ ] Card 3: AI Pruning (funnel visualization, keyword highlights)
- [ ] Card 4: Growth Analytics (line graph, real-time counter)
- [ ] Card 5: Shareable Links (URL pill, QR code)
- [ ] Card 6: Integrations (logo grid, hover animations)
- [ ] Stagger animations on scroll

### **Phase 5: Additional Sections**
- [ ] Shareable Links Deep Dive (full explanation)
- [ ] Interactive Demo (textarea + preview)
- [ ] Template Showcase (horizontal scroll)
- [ ] Testimonials (carousel, organic testimonial cards)
- [ ] Stats Section (count-up numbers)

### **Phase 6: Pricing & Closing**
- [ ] Pricing cards (3-tier, emphasis on shareable links in all tiers)
- [ ] FAQ accordion
- [ ] Final CTA (gradient background)
- [ ] Footer

### **Phase 7: Polish & Optimization**
- [ ] Micro-interactions refinement
- [ ] Mobile responsiveness
- [ ] Performance optimization (lazy load, code split)
- [ ] Accessibility audit (WCAG AA)
- [ ] Cross-browser testing

---

## 📝 Copy Strategy - "Craft" Language (Not "Hustle")

**Philosophy:** Move away from "optimization hacks" to "career craftsmanship."

### **DON'T Say:**
- ❌ "Crush the ATS"
- ❌ "Generate resumes fast"
- ❌ "Get hired instantly"
- ❌ "Beat the bots"

### **DO Say:**
- ✅ "Designed to be read"
- ✅ "Curate your professional narrative"
- ✅ "Find your next environment"
- ✅ "Cultivate your career"
- ✅ "Built for growth"

---

### **Hero Variations (A/B Test)**
1. "Cultivate Your Career. Automate the Rest."
2. "One Profile. Infinite Opportunities."
3. "Your Resume, Tailored for Every Role."
4. "Stop Editing. Start Growing."
5. "From Resume to Career Ecosystem."

### **Subheadline Variations**
1. "Stop editing resumes for every job. Build a living blueprint, then let AI handle the repetition."
2. "Create once. Tailor for each role. Track who cares. Share everywhere."
3. "A master profile that grows with your career. AI does the heavy lifting."
4. "One source of truth. AI knows what matters. Recruiters see your best self."

### **Feature Copy (Craft Language)**

| **Feature** | **Don't Say** | **Do Say** |
| --- | --- | --- |
| **Master Profile** | "Store all your data" | "Curate your professional narrative in one place" |
| **AI Tailor** | "Keyword optimization" | "Designed to be read for each role" |
| **LaTeX PDF** | "Generate formatted docs" | "Typographically perfect, always" |
| **Shareable Links** | "Share your resume link" | "Your career lives online" |
| **Analytics** | "Track PDF downloads" | "See what resonates with recruiters" |

### **CTA Button Text**
- Primary: "Start Free", "Cultivate Now", "Create My Blueprint"
- Secondary: "See How It Works", "Watch the Journey", "View Example"

---

## 🎨 Asset Requirements

### Images Needed
- [ ] Hero mockup (dashboard screenshot or 3D render)
- [ ] Feature demo GIFs/videos (4 total)
- [ ] Template previews (4-6 PDF screenshots)
- [ ] Company logos for social proof (5-10)
- [ ] Testimonial avatars (5-6)
- [ ] Icons for features (custom or from library)

### Illustrations/Graphics
- [ ] Problem statement icons (3)
- [ ] Stats section icons (3)
- [ ] Background patterns/meshes
- [ ] Loading animations

### Videos (Optional)
- [ ] Product demo (1-2 minutes)
- [ ] Feature explainer videos

---

## 🔗 External Integrations

- **Analytics:** Vercel Analytics, Plausible, or Google Analytics
- **Heatmaps:** Hotjar or Microsoft Clarity
- **A/B Testing:** Vercel Edge Config or PostHog
- **Forms:** Newsletter signup (Mailchimp/ConvertKit)
- **Live Chat:** Intercom or Crisp (for support)

## 🛠 Technical Craft (Why It Works)

This section can appear in footer or as expandable section on landing page.

### **Master Profile = Database**
- Not just a form. A structured database (like Attio's Objects)
- Tag-based organization (React, Leadership, Timeline)
- Drag-and-drop ordering
- Version history (revert to past profiles)

### **AI Tailoring = Context-Aware Pruning**
- LLM scans job description and Master Profile
- "Hides" irrelevant bullets, "Highlights" matching keywords
- Rewrites tone to match role (shifts from "Managed" → "Led" for leadership roles)
- Before/After diff view (green highlights for AI additions)

### **LaTeX Export = Typographic Perfection**
- Industry-standard TeX Live compiler
- Multiple templates (Ivy League, Modern Sans, Classic Serif)
- Perfect kerning, spacing, PDF optimization
- Power users can edit raw `.tex` file or export to Overleaf

### **Shareable Links = Living Ecosystem**
- React-rendered profiles (embeds, real-time updates)
- Embeds: GitHub repos, Figma prototypes, YouTube videos (not just links)
- Analytics: Heatmaps, view source, timestamp tracking
- "Hire Me" floating CTA (Calendly / Cal.com integration)

---

## ✅ Design Principles Checklist

- [x] **Organic Palette:** Warm backgrounds, earthy accents, no harsh digital blues/purples
- [x] **Craft Language:** Copy emphasizes "curation" not "hacking"
- [x] **Bento Grid Layout:** Modular, asymmetrical, professional
- [x] **Soft Shadows:** Diffused light, tactile feel
- [x] **Serif + Sans:** Headlines in serif (craft), body in clean sans
- [x] **Whitespace:** Generous spacing, premium feel
- [x] **Micro-interactions:** Smooth, purposeful animations (no unnecessary flash)
- [x] **Metaphor:** Cultivation journey (Plant → Tend → Harvest)
- [x] **Shareable Links = Hero Feature:** Emphasized throughout
- [x] **Mobile-First Responsive:** Grid adapts to mobile seamlessly

---

**Primary KPIs:**
- Sign-up conversion rate (target: 5-10%)
- Time to first sign-up
- Bounce rate (target: <40%)

**Secondary Metrics:**
- Scroll depth
- CTA click-through rate
- Demo video completion rate
- Pricing page views

**Tools:**
- Google Analytics 4
- Hotjar for behavior tracking
- Vercel Analytics for performance
