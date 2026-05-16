# Workder User Mobile: E2E Testing Checklist

This checklist corresponds directly to the acceptance criteria defined for the project.

## 1. Environment & Setup Resilience
- [ ] **Offline Mode (No Internet)**: Open the app without internet. It should NOT crash. (React Query and AsyncStorage will maintain cached views and offline errors).
- [ ] **API Down Handling**: Set the `.env` API URL to an invalid IP or turn off Backend. Try logging in.
  - *Expected*: "เซิร์ฟเวอร์ไม่ตอบสนอง" or generic Network error toast/alert appears instead of confusing JSON crashes.

## 2. Authentication Flow
- [ ] **Login Success (User)**: Log in with `user@workder.com` / `12345678`.
  - *Expected*: Successfully routes into User Dashboard or KYC Flow.
- [ ] **Login Success (Employer)**: Log in with `employer@workder.com` / `12345678`.
  - *Expected*: Successfully routes into the Employer Portal (Dashboard).
- [ ] **Login Failure**: Type wrong password for existing user or invalid email.
  - *Expected*: "อีเมลหรือรหัสผ่านผิด" error pops up.

## 3. Profile / KYC Gating (User Flow)
- [ ] **Profile Incomplete Block**: After login, if the user account `profileCompleted` is false, they should be stuck on the `Profile KYC` screen. Attempting to navigate away should redirect back.
- [ ] **Form Validation**: Try submitting empty in Profile form.
  - *Expected*: Text errors for empty Thai address fields ("Require Province (จังหวัด)").
  - *Expected*: Error stating "Please upload all 4 required KYC images." appears.
- [ ] **Submit KYC Patch**: Fill all fields and pick random pictures. Submit form.
  - *Expected*: Fires `PATCH /users/{userId}` with multipart form data. Responds with success and unblocks the user into Dashboard.

## 4. Employer Flow & Cache logic
- [ ] **Create Job Form Cache (Visual only for now)**: In Employer Jobs, verify that `mockJobs` populate immediately due to `initialData` setup, allowing visual UI inspection without backend fully mapped for that specific endpoint yet.

## 5. Token Segregation & Role Checks
- [ ] **Role Protection**: While logged in as an Employer, try to deep-link to `/(user)/dashboard` or manually change state.
  - *Expected*: Immediately bounced back to `/(employer)/dashboard`.
- [ ] **Logout Flow**: Press Logout within Settings/Dashboard.
  - *Expected*: Token clears, Zustand resets, routed instantly back to Login screen. 
