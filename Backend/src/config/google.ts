import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        // Find or create user logic
        done(null, profile);
    }));
} else {
    console.log('Google OAuth credentials not found. Google authentication will be disabled.');
}

export default passport;
