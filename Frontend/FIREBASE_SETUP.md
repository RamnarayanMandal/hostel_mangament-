# 🔥 Firebase Setup for Frontend

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication in the Firebase Console
4. Add Google as a sign-in provider

### 2. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web
4. Register your app and copy the config

### 3. Environment Variables
Create a `.env.local` file in the Frontend directory with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3005/api
```

### 4. Backend Configuration
Make sure your backend has the Firebase service account key configured in `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
```

### 5. Test the Setup
1. Start your backend server
2. Start your frontend development server
3. Go to the signup page
4. Try the "Continue with Google" button

## How it Works

1. User clicks "Continue with Google" button
2. Firebase opens Google sign-in popup
3. User authenticates with Google
4. Firebase returns user data and ID token
5. Frontend sends ID token to backend
6. Backend verifies token with Firebase Admin SDK
7. Backend creates/updates user in database
8. Backend returns JWT token for session management
9. Frontend stores JWT token and redirects user 