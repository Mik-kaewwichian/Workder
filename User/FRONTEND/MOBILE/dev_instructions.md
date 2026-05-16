# Workder User Mobile: Dev and Build Instructions

## Environment Setup
1. Duplicate `.env.example` and rename to `.env`.
   - Update `EXPO_PUBLIC_API_URL` to your local machine IP address instead of `localhost` if testing on a physical device.

## Running in Development (Dev Mode)
1. Install dependencies from workspace root or inside the folder:
   ```bash
   pnpm install
   ```
2. Start the Expo development server:
   ```bash
   pnpm run dev
   # OR
   npx expo start -c
   ```
3. Options:
   - Press **i** to open in iOS Simulator
   - Press **a** to open in Android Emulator
   - Scan the QR code using the **Expo Go** application on your physical device.

## Production Build Instructions (EAS Build)
If you want to build APKs (Android) or IPAs (iOS) to install directly on your phone:

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to Expo account:
   ```bash
   eas login
   ```
3. Configure the project for EAS (Already done in `eas.json`):
   ```bash
   eas build:configure
   ```
4. Build for Android (APK):
   ```bash
   eas build -p android --profile preview
   ```
5. Build for iOS (Requires Apple Developer Account):
   ```bash
   eas build -p ios --profile preview
   ```

*You can download the artifacts from Expo dashboard after the build is finished and install them directly!*
