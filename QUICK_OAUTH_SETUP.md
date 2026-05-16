# ⚡ Quick OAuth Test Setup (5 minutes)

## 🔑 Google Client ID - Fastest Setup

### Method 1: Using Google's Quick Test Console (Recommended - 2 minutes)
1. Go to: https://console.cloud.google.com/
2. **Top-left menu → Create a new project** → Name: "WORKDER-Dev" → Create
3. Wait for project to load (30 sec)
4. **Search bar → type "OAuth"** → Click **"APIs & Services"** in results
5. **Left sidebar → Credentials**
6. **Blue button "+ CREATE CREDENTIALS" → OAuth client ID**
7. Select **"Web application"**
8. In **"Authorized JavaScript origins"** add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   ```
9. In **"Authorized redirect URIs"** add:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   http://localhost:3002/auth/callback
   ```
10. **Create** → Copy the **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

## 🔑 Facebook App ID - Fastest Setup

### Steps (2 minutes)
1. Go to: https://developers.facebook.com/
2. **My Apps → Create App**
3. Choose type: **Consumer** → Continue
4. **App Name**: "WORKDER-Dev" → Admin email → Create
5. Click **Products → Add product**
6. Find **"Facebook Login"** → Click **Set Up**
7. Choose **Web**
8. **Settings → Basic** → Copy your **App ID** (numeric, looks like: `1234567890`)
9. In **App Settings → Basic**, scroll to **"App Domains"** → Add:
   ```
   localhost:3000
   localhost:3001
   localhost:3002
   4000
   4001
   ```

## 📝 Update Your .env Files

### File 1: User/FRONTEND/WEB/.env
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID_HERE>
NEXT_PUBLIC_FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID_HERE>
```

### File 2: User/BACKEND/API/.env
```env
PORT=4001
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID_HERE>
FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID_HERE>
```

### File 3: Admin/FRONTEND/WEB/.env
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_USER_APP_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID_HERE>
NEXT_PUBLIC_FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID_HERE>
```

### File 4: Admin/BACKEND/API/.env
```env
PORT=4000
JWT_SECRET=dev-secret-admin-change-in-production
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID_HERE>
FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID_HERE>
```

## 🔄 After Updating .env Files

**You MUST restart both frontend servers** for Next.js to load the new environment variables:

```bash
# Terminal 1: Kill current User Frontend (Ctrl+C), then:
cd User/FRONTEND/WEB
npm run dev

# Terminal 2: Kill current Admin Frontend (Ctrl+C), then:
cd Admin/FRONTEND/WEB
npm run dev
```

The pages will now load without the error dialogs! ✅

---

## 🧪 Test the OAuth Flow

1. **Open** http://localhost:3001/register (Admin signup)
2. **Click "Google" button** → You should be able to sign in
3. **Click "Facebook" button** → You should be able to sign in
4. After auth, you should redirect to `/dashboard` with session stored

---

## 🐛 If Still Getting Error

Check:
- [ ] Did you paste the **full** Client ID (should include `.apps.googleusercontent.com`)?
- [ ] Did you restart the frontend server after updating `.env`?
- [ ] Did you update **all 4** `.env` files with same credentials?
- [ ] Google Client ID should be SAME in all .env files (frontend and backend)
- [ ] Facebook App ID should be SAME in all .env files (frontend and backend)

---

**⏱️ Total time: ~5 minutes for both credentials + .env setup + restart**
