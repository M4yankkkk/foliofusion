-- FolioFusion 2.0 Database Schema Setup
-- Run this in Supabase SQL Editor for a fresh project

-- ============================================================
-- 1. USERS TABLE (synced with Supabase Auth)
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' -- 'free' or 'pro'
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. MASTER PROFILES TABLE (Source of Truth)
-- ============================================================

CREATE TABLE master_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  projects JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  theme TEXT DEFAULT 'blue',
  custom_color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on master_profiles
ALTER TABLE master_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. TAILORED RESUMES TABLE (Derived from Master Profile)
-- ============================================================

CREATE TABLE tailored_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_profile_id UUID REFERENCES master_profiles(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  tailored_content JSONB,
  match_score INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  public_url TEXT UNIQUE,
  view_count INT DEFAULT 0
);

-- Enable RLS on tailored_resumes
ALTER TABLE tailored_resumes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. PROFILE VIEWS ANALYTICS TABLE
-- ============================================================

CREATE TABLE profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tailored_resume_id UUID REFERENCES tailored_resumes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  referrer TEXT
);

-- Enable RLS on profile_views
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Users table policies
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Public can read usernames"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Master profiles policies
CREATE POLICY "Users can read own master profile"
  ON master_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read all master profiles"
  ON master_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own master profile"
  ON master_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own master profile"
  ON master_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own master profile"
  ON master_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Tailored resumes policies
CREATE POLICY "Users can read own tailored resumes"
  ON tailored_resumes FOR SELECT
  USING (
    master_profile_id IN (
      SELECT id FROM master_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read all tailored resumes"
  ON tailored_resumes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert tailored resumes"
  ON tailored_resumes FOR INSERT
  WITH CHECK (
    master_profile_id IN (
      SELECT id FROM master_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tailored resumes"
  ON tailored_resumes FOR UPDATE
  USING (
    master_profile_id IN (
      SELECT id FROM master_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tailored resumes"
  ON tailored_resumes FOR DELETE
  USING (
    master_profile_id IN (
      SELECT id FROM master_profiles WHERE user_id = auth.uid()
    )
  );

-- Profile views policies (anyone can insert, admins can read)
CREATE POLICY "Anyone can record profile views"
  ON profile_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read their own profile views"
  ON profile_views FOR SELECT
  USING (
    tailored_resume_id IN (
      SELECT id FROM tailored_resumes WHERE master_profile_id IN (
        SELECT id FROM master_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- 6. AUTHENTICATION TRIGGER
-- ============================================================

-- Function to auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (
    NEW.id,
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to call function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. INDEXES (For Performance)
-- ============================================================

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_master_profiles_user_id ON master_profiles(user_id);
CREATE INDEX idx_tailored_resumes_master_profile_id ON tailored_resumes(master_profile_id);
CREATE INDEX idx_tailored_resumes_public_url ON tailored_resumes(public_url);
CREATE INDEX idx_profile_views_tailored_resume_id ON profile_views(tailored_resume_id);

-- ============================================================
-- END OF SCHEMA SETUP
-- ============================================================
