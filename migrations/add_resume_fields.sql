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

-- Add tech_stack field to projects (if stored in JSONB)
-- Projects JSONB structure should include: name, description, link, tech_stack
-- Example: {"name": "Project", "description": "...", "link": "url", "tech_stack": "React, Node.js"}

-- Add location field to experience (if stored in JSONB)
-- Experience JSONB structure should include: company, role, description, start_month_year, end_month_year, location
-- Example: {"company": "Company", "role": "Developer", "description": "...", "start_month_year": "2023-01", "end_month_year": "2024-01", "location": "Remote"}
