import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, accessToken, {
      service: ACCESS_TOKEN_KEY,
    });
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, {
      service: REFRESH_TOKEN_KEY,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save tokens:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_KEY });
    return credentials ? credentials.password : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get access token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: REFRESH_TOKEN_KEY });
    return credentials ? credentials.password : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_KEY });
    await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_KEY });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to clear tokens:', error);
    throw error;
  }
};

