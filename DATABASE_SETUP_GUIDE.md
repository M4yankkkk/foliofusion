# Database Setup Guide - FolioFusion 2.0

## Prerequisites
- Supabase account (free tier: https://supabase.com)
- No existing data (fresh project)

---

## Step 1: Create Fresh Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** foliofusion-v2 (or similar)
   - **Database Password:** Generate a strong password
   - **Region:** Choose closest to your users (or leave default)
4. Click **"Create new project"** and wait for initialization (~2 min)

---

## Step 2: Get Credentials

1. Once project is ready, go to **Settings > API**
2. Copy these and save to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<Project URL from API section>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<Anon Key from API section>
   SUPABASE_URL=<Same as above>
   SUPABASE_SERVICE_ROLE_KEY=<Service Role Key>
   ```

3. Your `.env.local` should look like:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

---

## Step 3: Run Schema Setup

### Option A: Direct Paste (Easiest)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"+ New Query"**
3. Paste the entire contents of `database-setup.sql` (from this repo)
4. Click **"Run"** (or Ctrl+Enter)
5. Wait for all queries to complete (you should see ✅ for each section)

### Option B: Import SQL File

1. In **SQL Editor**, click **"..."** menu
2. Select **"Upload SQL file"**
3. Choose `database-setup.sql`
4. Click **"Run"**

---

## Step 4: Verify Schema Was Created

1. Go to **Table Editor** in left sidebar
2. You should see these tables:
   - ✅ `users`
   - ✅ `master_profiles`
   - ✅ `tailored_resumes`
   - ✅ `profile_views`

3. Click on each table to verify:
   - Columns are correct
   - Types match (JSONB for projects/skills/experience)
   - Relationships are set up

### Example: Verify `master_profiles`

You should see columns:
```
id (uuid, primary key)
user_id (uuid, foreign key → users.id)
name (text)
title (text)
bio (text)
github (text)
linkedin (text)
twitter (text)
projects (jsonb)
skills (jsonb)
experience (jsonb)
theme (text)
custom_color (text)
created_at (timestamp)
updated_at (timestamp)
```

---

## Step 5: Set Up Authentication

### Enable Google OAuth

1. In Supabase dashboard, go to **Authentication > Providers**
2. Click **"Google"**
3. Enable the toggle
4. Fill in:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)

   *Note: If you don't have Google OAuth credentials yet, follow this: https://supabase.com/docs/guides/auth/social-login/auth-google*

### Enable Email/Password Auth (Fallback)

1. Go to **Authentication > Providers > Email**
2. Make sure it's enabled (should be by default)

---

## Step 6: Test RLS Policies

### Test 1: Verify RLS is Enabled

1. Go to **SQL Editor > New Query**
2. Run this to check enabled RLS:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND rowsecurity = true;
   ```
3. You should see all 4 tables listed

### Test 2: Manual RLS Test (Optional)

1. Create a test query:
   ```sql
   -- This should return empty (no current user in SQL Editor context)
   SELECT * FROM master_profiles;
   ```
2. Result should be: `No rows returned` (✅ RLS working)

---

## Step 7: Test Auth Trigger

### Create Test User via Auth

1. Go to **Authentication > Users**
2. Click **"Create user"** (or wait for your first real signup)
3. Fill in email and password
4. Click **"Create user"**

### Verify User Record Created

1. Go to **SQL Editor > New Query**
2. Run:
   ```sql
   SELECT id, email, username, subscription_tier FROM users;
   ```
3. You should see your test user listed (✅ trigger working)

---

## Step 8: Update Project Environment Variables

In your repository root, make sure `.env.local` has:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Google OAuth (when configured)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

---

## Troubleshooting

### Error: "relation 'public.users' does not exist"

- Make sure you ran the schema SQL completely
- Check **Table Editor** to confirm all tables exist

### Error: "trigger 'on_auth_user_created' already exists"

- The `DROP TRIGGER IF EXISTS` should handle this
- If it persists, go to **SQL Editor** and run:
  ```sql
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  ```

### RLS Blocking All Queries

- This is expected if you're not authenticated
- It means RLS is working correctly ✅
- When you implement auth in your Next.js app, this will work seamlessly

### Foreign Key Constraint Error

- Make sure `users` table was created first
- Check that `master_profiles.user_id` references `users.id` (should see in Table Editor)

---

## Next Steps

✅ Database is ready!

Now you can move to **Phase 1 Step 2: Set up Auth UI in Next.js**

See: `IMPLEMENTATION_PLAN.md` → Phase 1 → 1.2 Supabase Auth Setup

---

## Quick Reference: Table Relationships

```
auth.users (Supabase built-in)
    ↓
    └─→ users (created by trigger)
        ↓
        └─→ master_profiles (1 per user)
            ↓
            └─→ tailored_resumes (many per profile)
                ↓
                └─→ profile_views (many per resume)
```

