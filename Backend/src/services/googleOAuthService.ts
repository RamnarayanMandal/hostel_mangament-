// Google OAuth Service for handling Google login
// This service handles the OAuth flow with Google

interface GoogleUserInfo {
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  picture?: string;
}

interface GoogleTokens {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
}

export class GoogleOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID!;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  }

  // Get Google OAuth URL for frontend redirect
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  private async exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens: GoogleTokens = await response.json();
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  // Get user info from Google using access token
  private async getUserInfoFromGoogle(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo: GoogleUserInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error('Error getting user info from Google:', error);
      throw new Error('Failed to get user information');
    }
  }

  // Main method to get user info from authorization code
  async getUserInfo(authorizationCode: string): Promise<GoogleUserInfo> {
    try {
      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(authorizationCode);

      // Get user info using access token
      const userInfo = await this.getUserInfoFromGoogle(tokens.access_token);

      return userInfo;
    } catch (error) {
      console.error('Error in Google OAuth flow:', error);
      throw new Error('Google authentication failed');
    }
  }

  // Verify ID token (alternative method)
  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      
      if (!response.ok) {
        throw new Error('Invalid ID token');
      }

      const tokenInfo = await response.json();
      
      return {
        id: tokenInfo.sub,
        email: tokenInfo.email,
        given_name: tokenInfo.given_name,
        family_name: tokenInfo.family_name,
        picture: tokenInfo.picture,
      };
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Failed to verify Google ID token');
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const tokens: GoogleTokens = await response.json();
      return tokens;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh Google access token');
    }
  }

  // Revoke access token
  async revokeAccessToken(accessToken: string): Promise<void> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token: accessToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to revoke access token');
      }
    } catch (error) {
      console.error('Error revoking access token:', error);
      throw new Error('Failed to revoke Google access token');
    }
  }
} 