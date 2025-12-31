# Google OAuth Setup for Supabase

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Navigate to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a **New Project**:
   - Click on the project dropdown (top left)
   - Click **"NEW PROJECT"**
   - Name: `foliofusion` (or any name)
   - Click **"CREATE"**
4. Wait for the project to be created (1-2 min)

### 1.2 Enable OAuth Consent Screen
1. In the left sidebar, go to **APIs & Services > OAuth consent screen**
2. Choose **External** as the user type (unless you have a Google Workspace account)
3. Click **"CREATE"**
4. Fill in the form:
   - **App name:** FolioFusion
   - **User support email:** Your email
   - **Developer contact:** Your email
5. Click **"SAVE AND CONTINUE"**
6. On "Scopes" page, click **"SAVE AND CONTINUE"** (default scopes are fine)
7. On "Test users" page, click **"SAVE AND CONTINUE"**
8. Review and click **"BACK TO DASHBOARD"**

### 1.3 Create OAuth 2.0 Credentials
1. In left sidebar, go to **APIs & Services > Credentials**
2. Click **"+ CREATE CREDENTIALS"** (top)
3. Choose **"OAuth client ID"**
4. Select application type: **"Web application"**
5. Under "Authorized JavaScript origins", click **"+ ADD URI"**:
   - Add: `https://<your-supabase-project>.supabase.co`
   - (Find your Supabase project URL in Supabase dashboard > Settings > API)
6. Under "Authorized redirect URIs", click **"+ ADD URI"**:
   - Add: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
7. Click **"CREATE"**
8. A dialog will show:
   - **Client ID** ← Copy this
   - **Client Secret** ← Copy this
9. Click **"OK"** to close

---

## Step 2: Add Google OAuth to Supabase

### 2.1 Go to Supabase Authentication
1. In Supabase dashboard, go to **Authentication > Providers**
2. Find **"Google"** in the list
3. Click on it to expand

### 2.2 Enable and Configure Google
1. Toggle the **"Enabled"** switch to ON
2. Paste your credentials:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
3. Click **"Save"**

**Done!** Google OAuth is now enabled ✅

---

## Step 3: Enable Email/Password Auth (Fallback)

### 3.1 Go to Email Provider
1. In **Authentication > Providers**, find **"Email"**
2. Make sure the toggle is **"ON"** (should be by default)
3. That's it! ✅

---

## Step 4: Test the Auth Trigger

### 4.1 Create a Test User Manually
1. In Supabase dashboard, go to **Authentication > Users**
2. Click **"Add user"** button (top right)
3. Choose **"Create new user"**
4. Fill in:
   - **Email:** test@example.com
   - **Password:** TestPassword123
   - **Auto Confirm User:** Toggle ON (so you don't need to confirm email)
5. Click **"Create user"**

### 4.2 Verify Trigger Worked
1. Go to **Table Editor** in left sidebar
2. Click on **`users`** table
3. You should see your test user:
   ```
   id: <some-uuid>
   email: test@example.com
   username: test@example.com (auto-populated by trigger!)
   subscription_tier: free
   ```

**If you see this, your trigger is working!** ✅

### 4.3 Test Google OAuth (Later)
You can only test Google login after building the UI in Phase 1 Step 2.
For now, just verify:
- Google provider is **Enabled** in **Authentication > Providers**
- Client ID and Secret are saved

---

## Troubleshooting

### Error: "Redirect URI mismatch"
- Make sure you added the exact URL to Google Cloud Console:
  - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
- After adding, wait 5 minutes for Google to propagate

### Error: "Invalid Client ID"
- Double-check you copied the Client ID and Client Secret correctly (no spaces)
- Verify they're in the right fields in Supabase

### No Google button showing in my app?
- You haven't built the UI yet
- That's in Phase 1 Step 2 (next step!)

---

## Next Steps

Once OAuth is enabled:

1. **Update `.env.local`** (if needed for frontend):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

2. **Build Auth UI** → Go to Phase 1 Step 2 in IMPLEMENTATION_PLAN.md
   - Create login/signup page
   - Add auth components
   - Build dashboard

---

## Summary Checklist

- [ ] Created Google Cloud project
- [ ] Enabled OAuth Consent Screen
- [ ] Created OAuth 2.0 credentials
- [ ] Copied Client ID and Client Secret
- [ ] Pasted into Supabase Google provider
- [ ] Email/Password auth is enabled
- [ ] Tested login flow (optional)

**All done!** Your auth is ready for the Next.js UI implementation 🚀

