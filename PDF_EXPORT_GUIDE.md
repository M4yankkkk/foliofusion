# PDF Resume Export - Implementation Guide

## Overview
PDF resume export has been implemented using LaTeX template based on Jake's Resume. Users can now download professional PDF resumes from their master profile or any tailored resume with **AI-powered ATS optimization** using Google Gemini.

## Features

### ✅ Professional LaTeX PDF Generation
- Clean, single-column format based on Jake's Resume template
- Automatic formatting of dates, bullet points, and sections
- Support for both master and tailored resumes

### ✨ AI-Powered ATS Optimization (NEW)
- **Intelligent Bullet Point Enhancement**: Uses Google Gemini to rewrite experience and project descriptions
- **Quantifiable Metrics**: Adds percentages, numbers, and measurable impact
- **Action Verb Optimization**: Starts each bullet with strong action verbs (Developed, Implemented, Led, etc.)
- **Keyword Optimization**: Includes industry-standard keywords for ATS scanning
- **Impact-Focused**: Emphasizes results and achievements over responsibilities

## Database Migration

Run this SQL migration in your Supabase SQL Editor:

```sql
-- Add phone and email fields to master_profiles for resume generation
ALTER TABLE master_profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add optional education fields for resume
ALTER TABLE master_profiles
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS degree TEXT,
ADD COLUMN IF NOT EXISTS graduation_date TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;
```

## New Files Created

### 1. LaTeX Template
- **Path:** `templates/resume-template.tex`
- **Description:** Professional resume template based on Jake's Resume
- **Placeholders:** `{{NAME}}`, `{{EMAIL}}`, `{{PHONE}}`, `{{SOCIAL_LINKS}}`, `{{EDUCATION}}`, `{{EXPERIENCE}}`, `{{PROJECTS}}`, `{{SKILLS}}`

### 2. LaTeX Generator Utility
- **Path:** `lib/latexGenerator.js`
- **Functions:**
  - `generateLatexResume(profile)` - Converts profile data to LaTeX
  - `compileLatexToPdf(latexContent)` - Compiles LaTeX to PDF using latexonline.cc API
  - Helper functions for formatting and escaping LaTeX special characters
- **Updates:** Fixed date field name handling for both camelCase and snake_case

### 3. LLM Service for ATS Enhancement (NEW)
- **Path:** `lib/llmService.js`
- **Functions:**
  - `enhanceBulletPoint(bullet, role, company)` - Enhances single bullet with Gemini API
  - `enhanceExperience(experiences)` - Enhances all experience descriptions
  - `enhanceProjects(projects)` - Enhances all project descriptions
  - `enhanceProfileForPDF(profile, options)` - Main function for profile enhancement
- **Features:**
  - Uses Google Gemini Pro (free tier)
  - Adds quantifiable metrics (%, numbers, impact)
  - Optimizes for ATS keyword matching
  - Parallel processing for speed

### 3. PDF Export API Endpoint
- **Path:** `app/api/export/pdf/route.js`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "resumeId": "uuid-string",  // Optional, for tailored resumes
    "type": "master" | "tailored",
    "enhance": true  // NEW: Enable AI enhancement (default: true)
  }
  ```
- **Response:** PDF file download
- **Process Flow:**
  1. Authenticate user
  2. Fetch profile data
  3. **AI Enhancement** (if `enhance=true` and `GEMINI_API_KEY` set)
  4. Generate LaTeX
  5. Compile to PDF via latexonline.cc
  6. Return PDF download

### 4. Download Resume Button Component
- **Path:** `components/DownloadResumeButton.jsx`
- **Props:**
  - `resumeId` (optional) - ID of tailored resume
  - `type` - "master" or "tailored"
  - `variant` - Button style variant
  - `enhance` (NEW) - Enable AI enhancement (default: true)
- **Features:**
  - Loading state while generating PDF
  - Error handling and display
  - Automatic filename from server
  - Shows "Download ATS Resume" when enhancement enabled

## Updated Components

### ProfileForm.jsx
Added new fields:
- **Contact Info:** email, phone, location
- **Education:** university, degree, graduation_date
- **Projects:** tech_stack field
- **Experience:** location field

### Dashboard Page
- Download button added to Master Profile card
- Download button added to each Tailored Resume card

## How to Test

### 0. Setup Google Gemini API (Optional but Recommended)
```bash
# 1. Get free API key from Google AI Studio
# Visit: https://makersuite.google.com/app/apikey

# 2. Add to your .env.local file
echo "GEMINI_API_KEY=your_api_key_here" >> .env.local

# 3. Restart your dev server
npm run dev
```

**Note:** If you skip this step, PDFs will still generate but won't have AI-enhanced bullet points.

### 1. Update Your Database
```sql
-- Run migration in Supabase SQL Editor
-- Copy contents from migrations/add_resume_fields.sql
```

### 2. Update Your Profile
1. Go to Dashboard → Edit Master Profile
2. Fill in the new fields:
   - Email (required for resume)
   - Phone (optional but recommended)
   - Location (optional)
   - University, Degree, Graduation Date (optional)
3. Add tech stack to projects (e.g., "React, Node.js, MongoDB")
4. Add location to experience entries (e.g., "Remote", "San Francisco, CA")
5. Save profile

### 3. Download Resume
1. Navigate to Dashboard
2. Click "Download Resume" in Master Profile card
3. PDF will generate and download automatically
4. For tailored resumes, click the download icon next to each resume

## External Dependencies

### LaTeX.online API
- **URL:** https://latexonline.cc/compile
- **Method:** GET with `text` parameter
- **Free tier:** No API key required
- **Rate limits:** Reasonable for personal use
- **Alternative:** Can self-host LaTeX compiler on Render if needed

### Google Gemini API (NEW)
- **URL:** https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
- **Free tier:** 60 requests per minute
- **Get API key:** https://makersuite.google.com/app/apikey
- **Cost:** FREE for personal use
- **Usage:** Enhances bullet points for better ATS scores

## ATS Enhancement Examples

### Before AI Enhancement:
```
• Worked on the frontend using React
• Fixed bugs in the codebase
• Helped the team with code reviews
```

### After AI Enhancement:
```
• Architected and developed responsive web applications using React, TypeScript, and Tailwind CSS, serving 10,000+ monthly active users
• Resolved 50+ critical bugs and improved application stability by 40% through comprehensive testing and debugging
• Led code review process for 15-member engineering team, improving code quality metrics by 35% and reducing production incidents
```

### Key Improvements:
✅ **Action verbs**: Architected, Resolved, Led  
✅ **Quantifiable metrics**: 10,000+ users, 50+ bugs, 40% improvement, 35% increase  
✅ **Technical keywords**: React, TypeScript, Tailwind CSS, testing, debugging  
✅ **Impact focus**: Stability, quality metrics, production incidents  
✅ **ATS-friendly**: Natural keyword placement for algorithm scanning

## Resume Format

The generated PDF follows this structure:

```
┌─────────────────────────────────────┐
│  JOHN SMITH                         │
│  Phone | Email | LinkedIn | GitHub  │
├─────────────────────────────────────┤
│  EDUCATION                          │
│  University Name                    │
│  Bachelor of Science in CS          │
├─────────────────────────────────────┤
│  EXPERIENCE                         │
│  Company Name          Jan 2023 - Present │
│  Software Engineer                  │
│  • Bullet point 1                   │
│  • Bullet point 2                   │
├─────────────────────────────────────┤
│  PROJECTS                           │
│  Project Name | React, Node.js      │
│  • Description bullet points        │
├─────────────────────────────────────┤
│  TECHNICAL SKILLS                   │
│  JavaScript, Python, React, etc.    │
└─────────────────────────────────────┘
```

## Known Limitations

1. **LaTeX Special Characters:** The generator escapes special characters (&, %, $, #, _, {}, ~, ^) but complex Unicode might need additional handling

2. **Bullet Points:** Descriptions are automatically split by newlines or periods into bullet points

3. **Education:** Currently single education entry - could be extended to array like projects/experience

4. **Compilation Time:** PDF generation takes 2-5 seconds depending on latex.online API response

## Future Improvements

1. **Template Selection:** Allow users to choose from multiple LaTeX templates
2. **Custom Styling:** Let users customize fonts, colors, spacing
3. **Preview Before Download:** Show PDF preview in modal before download
4. **Multiple Education Entries:** Support for multiple degrees
5. **Self-Hosted LaTeX:** Deploy own LaTeX compiler for faster generation
6. **HTML Preview:** Generate HTML version that matches PDF for instant preview

## Troubleshooting

### PDF Generation Fails
- Check browser console for API errors
- Verify all required fields (name, email) are filled
- Check latex.online API status
- Verify profile data doesn't have corrupt JSONB

### Missing Fields in PDF
- Ensure database migration ran successfully
- Check profile form saved new fields correctly
- Verify LaTeX template placeholders match generator

### LaTeX Compilation Errors
- Check for special characters in user input
- Verify escaping function works correctly
- Test with minimal profile data first

## Code Examples

### Using Download Button in Custom Page
```jsx
import DownloadResumeButton from '@/components/DownloadResumeButton'

// For master profile
<DownloadResumeButton type="master" variant="primary" />

// For tailored resume
<DownloadResumeButton 
  resumeId={resume.id} 
  type="tailored" 
  variant="outline" 
/>
```

### Calling API Directly
```javascript
const response = await fetch('/api/export/pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resumeId: 'uuid-here', // optional
    type: 'master' // or 'tailored'
  })
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
// Create download link...
```

## Phase Complete! ✅

PDF resume export is now fully functional. Users can:
- ✅ Fill in contact info, education, tech stacks
- ✅ Generate professional PDF from master profile
- ✅ Download tailored resume PDFs
- ✅ Get proper filename based on name and type
- ✅ See loading states and error messages

**Next Phase Ideas:**
- Monetization with Stripe (Pro tier for unlimited PDFs)
- Custom domain support
- More LaTeX template options
- Resume analytics (views, downloads)
