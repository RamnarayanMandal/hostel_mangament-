# 🔧 Google OAuth Setup Guide

## 🚨 **Current Error: "The OAuth client was not found. Error 401: invalid_client"**

This error occurs when your Google OAuth configuration is incorrect. Follow these steps to fix it:

## 📋 **Step 1: Google Cloud Console Setup**

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create/Select Project
- Create a new project or select existing one
- Enable Google+ API and Google OAuth2 API

### 3. Configure OAuth Consent Screen
- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External" user type
- Fill in required information:
  - App name: "Hotel Management System"
  - User support email: your email
  - Developer contact information: your email

### 4. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Choose "Web application"
- Set authorized redirect URIs:
  - `http://localhost:3000/api/auth/google/callback`
  - `http://localhost:3000/auth/google/callback`

## 🔑 **Step 2: Update Your .env File**

Create or update your `.env` file with the correct credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## 🧪 **Step 3: Test the Configuration**

### Test Google Auth URL:
```bash
curl http://localhost:3000/api/auth/google/auth-url
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

## 🔍 **Step 4: Common Issues & Solutions**

### Issue 1: Invalid Client ID
**Solution:** Double-check your `GOOGLE_CLIENT_ID` in `.env` file

### Issue 2: Invalid Redirect URI
**Solution:** Ensure redirect URI matches exactly in Google Console

### Issue 3: API Not Enabled
**Solution:** Enable Google+ API in Google Cloud Console

### Issue 4: Wrong Project
**Solution:** Make sure you're using credentials from the correct project

## 📝 **Step 5: Complete .env Template**

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hotel_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## ✅ **Step 6: Verification**

After updating your `.env` file:

1. **Restart your server**
2. **Test the auth URL endpoint**
3. **Try the Google login flow**

The error should be resolved! 🎉 