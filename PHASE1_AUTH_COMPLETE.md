# Phase 1 Auth Setup - Complete! ✅

## What We Built

### 1. **Supabase Client Utilities**
- `lib/supabase/client.js` - Browser client for client components
- `lib/supabase/server.js` - Server client for server components  
- `lib/supabase/middleware.js` - Middleware helper for auth

### 2. **Authentication Pages**
- `/login` - Login page with Google OAuth + Email/Password
- `/auth/callback` - OAuth callback handler

### 3. **Protected Routes**
- `/dashboard` - Main dashboard (requires auth)
- Middleware redirects unauthenticated users to `/login`

### 4. **Components**
- `LogoutButton` - Client component for sign out

---

## Testing Your Auth

### Step 1: Start Dev Server
```bash
npm run dev
```
Server running at: http://localhost:3000

### Step 2: Test Login Flow

#### Option A: Email/Password
1. Go to http://localhost:3000/login
2. Enter email + password
3. Click "Sign up" (creates new account)
4. Check Supabase Auth > Users (user should appear)
5. Check `users` table (trigger should create record)
6. Use same credentials to "Sign in"
7. Should redirect to `/dashboard`

#### Option B: Google OAuth
1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Select Google account
4. Should redirect back to `/dashboard`

### Step 3: Verify Dashboard
- Should see welcome message
- Should see your email in nav
- Should see "Create Master Profile" button
- Click "Logout" → redirects to `/login`

### Step 4: Test Protections
1. Try accessing http://localhost:3000/dashboard while logged out
   - Should redirect to `/login` ✅
2. Try accessing http://localhost:3000/login while logged in
   - Should redirect to `/dashboard` ✅

---

## Current Dashboard Features

✅ Shows user email
✅ Logout button
✅ Master Profile card (shows "Create" if none exists)
✅ Tailored Resumes section (placeholder)
✅ Protected with middleware

---

## Next Steps (Phase 2)

Now that auth is working, we need to:

1. **Create Master Profile Form** (`/dashboard/profile/create`)
   - Reuse/refactor `PortfolioForm.jsx`
   - Save to `master_profiles` table
   
2. **Edit Master Profile** (`/dashboard/profile/edit`)
   - Pre-fill form with existing data
   - Update using `.update()`

3. **View Master Profile** (update existing `/profile/[username]`)
   - Fetch from `master_profiles` instead of `portfolios`

---

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure you added `http://localhost:3000/auth/callback` to Google OAuth credentials
- For local dev, add both:
  - Authorized JavaScript origins: `http://localhost:3000`
  - Authorized redirect URIs: `http://localhost:3000/auth/callback`

### Google login redirects to error page
- Check Google OAuth is enabled in Supabase
- Verify Client ID and Secret are correct

### Email signup doesn't work
- Check Email provider is enabled in Supabase
- For testing, enable "Auto Confirm User" in Supabase Auth settings

### Dashboard shows "Create Master Profile" but I created one
- Check `master_profiles` table in Supabase
- Verify `user_id` matches your auth user ID

---

## Files Created/Modified

```
lib/
  supabase/
    client.js          ← NEW
    server.js          ← NEW
    middleware.js      ← NEW

app/
  login/
    page.js            ← NEW
  auth/
    callback/
      route.js         ← NEW
  dashboard/
    page.js            ← NEW

components/
  LogoutButton.jsx     ← NEW

middleware.js          ← NEW
```

---

## Environment Variables Required

Make sure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

**Ready to continue with Phase 2 (Master Profile Management)?** Let me know! 🚀
