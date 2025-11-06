# Google Sign-In Setup Guide

This guide explains how to configure Google Sign-In for the Eat-With-Sam-Mobile app.

## Prerequisites

1. Google Cloud Console account
2. Google Cloud Project
3. React Native project with iOS support

## Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Identity API** (not Google+ API - it's deprecated)

### Step 2: Find Your Bundle Identifier

Get the exact bundle identifier from your Xcode project:

```bash
# Check your bundle identifier
grep -r "PRODUCT_BUNDLE_IDENTIFIER" ios/*.xcodeproj/project.pbxproj
```

**Example output**: `com.sampath.EatWithSam`

### Step 3: Create iOS OAuth 2.0 Client ID

1. Go to **Credentials** in Google Cloud Console
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Choose **"iOS"** as application type
4. Enter your **exact bundle identifier** from Step 2
5. **Copy the iOS Client ID** (format: `561885564765-XXXXXXXXX.apps.googleusercontent.com`)

### Step 4: Create Web Client ID

1. Create **another** OAuth 2.0 Client ID
2. Choose **"Web application"** as application type
3. **Copy the Web Client ID** (same format as iOS Client ID)

### Step 5: Configure Environment Variables

Create a `.env` file in the project root (if it doesn't exist) and add:

```env
API_URL=your_api_url
RETRY_ATTEMPTS=3
GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here
```

Replace `your_web_client_id_here` and `your_ios_client_id_here` with the actual client IDs from Steps 3 and 4.

### Step 6: Configure iOS URL Scheme

Update `ios/EatWithSam/Info.plist`:

Replace `YOUR_IOS_CLIENT_ID` in the URL scheme with your actual iOS Client ID (the part after `apps.`):

```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID</string>
</array>
```

For example, if your iOS Client ID is `561885564765-nal7rqvlcimjh55p9udejr2bqidro3us.apps.googleusercontent.com`, the URL scheme should be:
```xml
<string>com.googleusercontent.apps.561885564765-nal7rqvlcimjh55p9udejr2bqidro3us</string>
```

### Step 7: Install iOS Dependencies

```bash
cd ios && pod install && cd ..
```

### Step 8: Test the App

```bash
npm run ios
```

## Implementation Details

### Files Modified/Created

1. **Package.json**: Added `@react-native-google-signin/google-signin` dependency
2. **babel.config.js**: Added Google Client ID environment variables to allowlist
3. **src/types/env.d.ts**: Added type definitions for Google Client IDs
4. **src/lib/google-signin.ts**: Created Google Sign-In utility functions
5. **src/services/auth.ts**: Added `loginWithGoogle` API endpoint
6. **src/store/auth-store.ts**: Added `loginWithGoogle` method to auth store
7. **src/screens/Auth/LoginModal.tsx**: Added Google Sign-In button
8. **src/AppContent.tsx**: Initialize Google Sign-In on app start
9. **ios/EatWithSam/Info.plist**: Added URL scheme for Google Sign-In

### Backend Integration

The app sends a request to the backend endpoint at `/auth/google` with the following payload:
```json
{
  "email": "user@example.com",
  "googleId": "google_user_id_here",
  "name": "User Name"
}
```

The backend endpoint should return:
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name",
      "googleId": "google_user_id_here",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "access_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
}
```

**Note**: The current implementation sends user information (email, googleId, name) to the backend. For enhanced security, consider updating the backend to accept and verify the Google ID token (`idToken`) instead, which would allow the backend to verify the authentication with Google directly.

## Common Issues & Solutions

### Issue 1: "Custom scheme URIs are not allowed for 'WEB' client type"
**Cause**: Using web client ID for iOS authentication
**Solution**: 
- Create separate iOS OAuth 2.0 Client ID
- Use iOS client ID in `iosClientId` field
- Use web client ID in `webClientId` field

### Issue 2: "Your app is missing support for the following URL schemes"
**Cause**: Incorrect or missing URL scheme in Info.plist
**Solution**:
- URL scheme must be: `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID`
- Must match your iOS client ID exactly
- Rebuild the app after changing Info.plist

### Issue 3: "Authorization Error" or "Error 400: invalid_request"
**Cause**: Bundle identifier mismatch
**Solution**:
- Verify bundle identifier in Google Cloud Console matches Xcode project
- Check for typos in bundle identifier
- Ensure no extra spaces or characters

## Testing Checklist

- [ ] Bundle identifier matches in Google Cloud Console and Xcode
- [ ] iOS Client ID is different from Web Client ID
- [ ] URL scheme in Info.plist matches iOS Client ID
- [ ] Environment variables are set in `.env` file
- [ ] App rebuilds after Info.plist changes
- [ ] Google Sign-In button appears in login modal
- [ ] User can sign in with Google successfully
- [ ] User data displays after successful authentication

## Key Takeaways

1. **Always use separate client IDs** for iOS and Web
2. **Bundle identifier must match exactly** between Google Cloud Console and Xcode
3. **URL scheme format**: `com.googleusercontent.apps.YOUR_IOS_CLIENT_ID`
4. **Rebuild required** after Info.plist changes
5. **Environment variables** must be set in `.env` file

