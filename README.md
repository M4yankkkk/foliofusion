# FolioFusion

> FolioFusion — a customizable developer portfolio generator that creates responsive, shareable portfolio pages at URLs like `foliofusion.vercel.app/profile/<username>`.

Live at: https://foliofusion.vercel.app/

Demo: https://drive.google.com/file/d/1DxW_1x3CRGCf75kKz2JC_T-YLdjqNk6W/view?usp=sharing

## Project Overview

* **Name:** FolioFusion
* **Purpose:** Let developers quickly create, customize, and share portfolio pages with dynamic sections, themes, and a unique profile URL.
* **Target users:** Students, developers, designers, freelancers.
* **Primary goals:** Fast setup, clean responsive templates, and simple customization.

## Key Features

* User profile setup (name, title, bio, social links: GitHub, LinkedIn, Twitter).
* Dynamic sections: Projects (name, description, link), Skills (comma-separated), Experience (company, role, description, start/end month-year).
* Theme selection: 5 preset colors (Blue, Green, Purple, Red, Orange) + custom color picker.
* Generate shareable portfolio at `foliofusion.com/profile/<username>`.
* Responsive design with clean UI.
* Data stored in Supabase database.

## Tech Stack

* **Frontend & SSR:** Next.js (App Router) + React
* **Styling:** CSS Modules / Global CSS / Reactbits.dev for components
* **Database:** Supabase
* **Hosting:** Vercel
* **Design:** Figma (design files included)
* **Background Effects:** React Bits (from reactbits.dev) for animated floating icons on the landing page.

## Project Structure

```
foliofusion-next/
├── app/
│   ├── globals.css                    # Global styles and CSS variables
│   ├── layout.js                      # Root layout (if any)
│   ├── page.js                        # Landing page with form
│   └── profile/
│       └── [username]/
│           ├── page.js                # Dynamic profile page
│           
├── components/
│   ├── PortfolioForm.jsx              # Main form component
│   └── sections/
│       └── Landingpage.jsx            # Landing page section
├── Figma/                             # Design files
├── lib/                               # Utility functions
├── public/                            # Static assets
├── README.md                          # This file
└── package.json                       # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account for database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/foliofusion.git
   cd foliofusion
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_service_role_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Fill out the portfolio form on the landing page.
   - View the generated portfolio at `/profile/<username>`.

## Database Setup

1. Create a new project in [Supabase](https://supabase.com).
2. In the Supabase dashboard, go to the SQL Editor and create the `portfolios` table:

   ```sql
   CREATE TABLE portfolios (
     username TEXT PRIMARY KEY,
     name TEXT,
     title TEXT,
     bio TEXT,
     github TEXT,
     linkedin TEXT,
     twitter TEXT,
     projects JSONB,
     skills JSONB,
     experience JSONB,
     theme TEXT DEFAULT 'blue',
     customColor TEXT
   );
   ```

   Alternatively, use the Table Editor in Supabase to create the table with the following columns:
   - `username` (text, primary key)
   - `name` (text)
   - `title` (text)
   - `bio` (text)
   - `github` (text)
   - `linkedin` (text)
   - `twitter` (text)
   - `projects` (jsonb)
   - `skills` (jsonb)
   - `experience` (jsonb)
   - `theme` (text, default: 'blue')
   - `customColor` (text)

## Deployment

1. Push your code to GitHub.
2. Connect your repository to [Vercel](https://vercel.com).
3. Add the environment variables in Vercel's dashboard.
4. Deploy the application.

## How It Works

1. **Landing Page:** Users fill out a form with their details, including projects, skills, experience, and theme selection.
2. **Data Storage:** Form data is submitted to Supabase.
3. **Profile Generation:** A unique URL `/profile/<username>` displays the portfolio with the selected theme applied dynamically.
4. **Themes:** Colors are applied using CSS custom properties, with a client-side component updating them for instant theme switching.

## Future Enhancements

* Authentication for user accounts.
* Export/Import JSON of profile data.
* Additional sections: education, achievements, blogs, certifications.
* Multiple templates and advanced customization.
* Animations with Framer Motion.