import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from 'dotenv';

/**
 * Configures Google Sign-In with the required client IDs
 * Should be called once during app initialization
 */
export const configureGoogleSignIn = () => {
  if (!GOOGLE_WEB_CLIENT_ID || !GOOGLE_IOS_CLIENT_ID) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(
        'Google Sign-In not configured: GOOGLE_WEB_CLIENT_ID and GOOGLE_IOS_CLIENT_ID must be set in .env file',
      );
    }
    return;
  }

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

/**
 * Signs in with Google and returns the user info and ID token
 * @returns Promise with user info and ID token
 */
export const signInWithGoogle = async () => {
  // Check if device supports Google Play Services (Android)
  await GoogleSignin.hasPlayServices();

  // Sign in and get user info
  const userInfo = await GoogleSignin.signIn();

  // Get the ID token for backend verification
  const tokens = await GoogleSignin.getTokens();

  return {
    userInfo: userInfo.data?.user || null,
    idToken: tokens.idToken,
  };
};

/**
 * Signs out from Google
 */
export const signOutFromGoogle = async () => {
  await GoogleSignin.signOut();
};

/**
 * Checks if user is currently signed in to Google
 */
export const isGoogleSignedIn = async (): Promise<boolean> => {
  const user = GoogleSignin.getCurrentUser();
  return user !== null;
};

