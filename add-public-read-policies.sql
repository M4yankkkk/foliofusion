-- Add public read access to users table (for username lookup)
CREATE POLICY "Public can read usernames"
  ON users FOR SELECT
  USING (true);

-- Add public read access to master_profiles table (for public portfolio view)
CREATE POLICY "Public can read all master profiles"
  ON master_profiles FOR SELECT
  USING (true);

-- Add public read access to tailored_resumes table (for shared resume links)
CREATE POLICY "Public can read all tailored resumes"
  ON tailored_resumes FOR SELECT
  USING (true);
