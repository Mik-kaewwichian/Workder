# OAuth Setup Guide - Google & Facebook Integration

## Status
✅ **Backend Implementation Complete** - All OAuth code is compiled and ready
⏳ **Pending** - You need to obtain provider credentials and configure `.env` files

---

## 📋 What's Been Implemented

### Frontend (User & Admin Web)
- ✅ Google Sign-In button integration
- ✅ Facebook SDK integration  
- ✅ OAuth handlers that POST to backend endpoints
- ✅ Session storage via `setAuthSession()`
- ✅ Automatic redirect to dashboard after auth

### Backend (User & Admin APIs)
- ✅ `POST /auth/oauth/google` endpoint - validates ID tokens from Google
- ✅ `POST /auth/oauth/facebook` endpoint - validates access tokens from Facebook
- ✅ Token verification against official provider APIs
- ✅ User auto-provisioning on first OAuth login
- ✅ JWT token generation (7-day expiry)
- ✅ TypeScript compilation verified - no errors

---

## 🔑 Step 1: Get Google Client ID

### Option A: Quick (for development)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing → **Settings → Project Details**
3. Left sidebar → **APIs & Services → Credentials**
4. **+ Create Credentials → OAuth client ID**
5. Choose **Web application**
6. Add Authorized origins:
   - `http://localhost:3000` (User Web)
   - `http://localhost:3002` (Admin Web if applicable)
7. Copy the **Client ID** (not Secret)

### Option B: Detailed Steps
- Follow [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2/web-server)
- Enable "Google+ API" in your GCP project

**Result**: You'll get a string like `1234567890-abc...d.apps.googleusercontent.com`

---

## 🔑 Step 2: Get Facebook App ID

### Steps
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an App → Choose **Consumer**
3. Select **Facebook Login** as your use case
4. Complete the setup wizard
5. In **Settings → Basic**, copy your **App ID** (not App Secret)
6. Add `http://localhost:3000` to **App Domains** (User App)
7. Add `http://localhost:3002` to **App Domains** (Admin App if applicable)

**Result**: You'll get a numeric string like `9876543210`

---

## 🗝️ Step 3: Configure Environment Variables

### User Backend API
File: `User/BACKEND/API/.env`
```env
GOOGLE_CLIENT_ID=<paste-your-google-client-id-here>
FACEBOOK_APP_ID=<paste-your-facebook-app-id-here>
```

### Admin Backend API  
File: `Admin/BACKEND/API/.env`
```env
GOOGLE_CLIENT_ID=<paste-your-google-client-id-here>
FACEBOOK_APP_ID=<paste-your-facebook-app-id-here>
```

### User Frontend
File: `User/FRONTEND/WEB/.env`
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<paste-your-google-client-id-here>
NEXT_PUBLIC_FACEBOOK_APP_ID=<paste-your-facebook-app-id-here>
```

### Admin Frontend
File: `Admin/FRONTEND/WEB/.env`
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<paste-your-google-client-id-here>
NEXT_PUBLIC_FACEBOOK_APP_ID=<paste-your-facebook-app-id-here>
```

---

## 🚀 Step 4: Test the Setup

### 1. Start the backend servers
```bash
# Terminal 1 - User API
cd User/BACKEND/API
npm run dev    # Runs on http://localhost:4001

# Terminal 2 - Admin API (if needed)
cd Admin/BACKEND/API
npm run dev    # Runs on http://localhost:4000
```

### 2. Start the frontend(s)
```bash
# Terminal 3 - User Web
cd User/FRONTEND/WEB
npm run dev    # Runs on http://localhost:3000

# Terminal 4 - Admin Web (if needed)
cd Admin/FRONTEND/WEB
npm run dev    # Runs on http://localhost:3002
```

### 3. Test Google OAuth
1. Open http://localhost:3000/register (User signup page)
2. Click **Sign up with Google**
3. Select/login with your Google account
4. Backend validates token, creates user, returns JWT
5. You should see a redirect to `/dashboard` with session stored

### 4. Test Facebook OAuth
1. Open http://localhost:3000/register
2. Click **Sign up with Facebook**
3. Login with your Facebook account
4. Same flow as Google - automatic user creation, redirect to dashboard

---

## 🔍 How It Works (Technical)

### Google Flow
```
Frontend: User clicks "Sign in with Google"
    ↓
Google SDK: User logs in → returns ID token
    ↓
Frontend: POST /auth/oauth/google { idToken, role }
    ↓
Backend: Verify token against https://oauth2.googleapis.com/tokeninfo
    ↓
Backend: Extract user data (email, name) from token payload
    ↓
Backend: Find or create user in database
    ↓
Backend: Generate JWT token → return to frontend
    ↓
Frontend: Store JWT in session via setAuthSession()
    ↓
Frontend: Redirect to /dashboard
```

### Facebook Flow
```
Frontend: User clicks "Sign in with Facebook"
    ↓
Facebook SDK: User logs in → returns access token + userID
    ↓
Frontend: POST /auth/oauth/facebook { accessToken, userID, role }
    ↓
Backend: Verify token at https://graph.facebook.com/me
    ↓
Backend: Extract user data (email, name) from Graph API
    ↓
Backend: Find or create user in database
    ↓
Backend: Generate JWT token → return to frontend
    ↓
Frontend: Store JWT in session via setAuthSession()
    ↓
Frontend: Redirect to /dashboard
```

---

## ✅ Verification Checklist

- [ ] Google Client ID obtained and pasted into **both** `.env` files (Backends + Frontend)
- [ ] Facebook App ID obtained and pasted into **both** `.env` files (Backends + Frontend)
- [ ] Both backend servers started successfully (`npm run dev`)
- [ ] Both frontend apps started successfully (`npm run dev`)
- [ ] Tested Google OAuth signup - user created and logged in
- [ ] Tested Facebook OAuth signup - user created and logged in
- [ ] Session persists on page refresh (JWT stored correctly)
- [ ] Logout clears session properly

---

## 🐛 Troubleshooting

### "Invalid Client ID" error
- Check `.env` files have no extra spaces or typos
- Verify you copied the full Client ID (not shortened)
- Ensure frontend and backend have same Client ID

### "Access Denied" from OAuth provider
- Check authorized domains/origins in provider settings
- Verify URL matches exactly (http vs https, :3000 vs :3001)
- Check that your Google/Facebook app is in development mode (not disabled)

### "User creation failed"
- Check backend is running and accessible
- Check `NEXT_PUBLIC_API_URL` in frontend `.env` points to correct backend
- Check database connection in backend

### "Token verification failed"
- Backend logs should show which provider endpoint returned error
- May indicate network issue or invalid token format
- Try logout and retry OAuth flow

---

## 📝 Files Modified

### Frontend
- `User/FRONTEND/WEB/src/app/register/page.tsx` - Added OAuth handlers
- `User/FRONTEND/WEB/.env` - Added NEXT_PUBLIC_GOOGLE_CLIENT_ID, NEXT_PUBLIC_FACEBOOK_APP_ID
- `Admin/FRONTEND/WEB/.env` - Same as above

### Backend  
- `User/BACKEND/API/src/modules/auth/social-auth.service.ts` - Token verification logic
- `User/BACKEND/API/src/modules/auth/oauth.controller.ts` - HTTP endpoints
- `User/BACKEND/API/.env` - Added GOOGLE_CLIENT_ID, FACEBOOK_APP_ID
- `Admin/BACKEND/API/src/modules/auth/social-auth.service.ts` - Mirrored implementation
- `Admin/BACKEND/API/src/modules/auth/oauth.controller.ts` - Mirrored endpoints
- `Admin/BACKEND/API/.env` - Added OAuth variables

---

## 🎯 Production Deployment Notes

Before deploying to production:

1. **Change JWT_SECRET** in both backend `.env` files to a strong random string
2. **Update NEXT_PUBLIC_API_URL** to point to production backend domain
3. **Add production URLs** to Google OAuth authorized origins
4. **Add production URLs** to Facebook app authorized domains
5. **Use HTTPS** - OAuth requires secure context in production
6. **Store credentials securely** - use your deployment platform's secrets manager (not .env)

---

## 📞 Next Steps

1. **Create Google Client ID** - See Step 1 above
2. **Create Facebook App ID** - See Step 2 above
3. **Update .env files** - See Step 3 above
4. **Test the flow** - See Step 4 above
5. **Report any issues** - Include error messages from browser console and backend logs

---

**Last Updated**: When OAuth implementation completed
**Status**: Ready for testing (awaiting user to provide credentials)
