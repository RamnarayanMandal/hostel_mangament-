# 🔥 Firebase Authentication Setup Guide

## 🎯 **Overview**

This guide shows how to implement Firebase Authentication for your Hotel Management System. Firebase provides a much easier way to handle authentication compared to direct Google OAuth.

## 📋 **Step 1: Firebase Project Setup**

### 1. Create Firebase Project
- Go to https://console.firebase.google.com/
- Click "Create a project"
- Enter project name: "Hotel Management System"
- Enable Google Analytics (optional)
- Click "Create project"

### 2. Enable Authentication
- In Firebase Console, go to "Authentication"
- Click "Get started"
- Go to "Sign-in method" tab
- Enable "Google" provider
- Add your domain to authorized domains

### 3. Get Service Account Key
- Go to "Project settings" (gear icon)
- Go to "Service accounts" tab
- Click "Generate new private key"
- Download the JSON file

## 🔑 **Step 2: Backend Configuration**

### 1. Install Firebase Admin SDK
```bash
npm install firebase-admin
```

### 2. Update Your .env File
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
```

### 3. Get Firebase Config from Service Account JSON
From your downloaded service account JSON file, copy:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

## 🚀 **Step 3: Frontend Integration**

### 1. Install Firebase SDK
```bash
npm install firebase
```

### 2. Firebase Config (frontend/src/firebase/config.js)
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 3. Firebase Authentication Hook (frontend/src/hooks/useFirebaseAuth.js)
```javascript
import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    logout
  };
};
```

### 4. Authentication Component (frontend/src/components/FirebaseAuth.js)
```javascript
import React, { useState } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

const FirebaseAuth = () => {
  const { user, loading, signInWithGoogle, logout } = useFirebaseAuth();
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      const firebaseUser = await signInWithGoogle();
      
      // Get ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Send to backend
      const response = await fetch('/api/firebase-auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          role: 'student' // or get from form
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store JWT token
        localStorage.setItem('token', data.data.token);
        // Redirect or update state
        console.log('Authentication successful:', data);
      } else {
        console.error('Authentication failed:', data.message);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      // Redirect to login
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <img src={user.photoURL} alt="Profile" style={{ width: 50, borderRadius: '50%' }} />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Sign in to continue</h2>
          <button 
            onClick={handleGoogleSignIn}
            disabled={authLoading}
          >
            {authLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FirebaseAuth;
```

## 📡 **Step 4: API Endpoints**

### Available Firebase Auth Endpoints:

1. **POST /api/firebase-auth/signup**
   ```json
   {
     "idToken": "firebase-id-token",
     "role": "student" // optional, defaults to "student"
   }
   ```

2. **POST /api/firebase-auth/login**
   ```json
   {
     "idToken": "firebase-id-token"
   }
   ```

3. **POST /api/firebase-auth/verify-token**
   ```json
   {
     "idToken": "firebase-id-token"
   }
   ```

4. **GET /api/firebase-auth/user/:firebaseUid**
   - Get user by Firebase UID

## 🔧 **Step 5: Testing**

### 1. Test Firebase Auth URL
```bash
curl -X POST http://localhost:3000/api/firebase-auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your-firebase-id-token",
    "role": "student"
  }'
```

### 2. Expected Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student",
      "isEmailVerified": true,
      "profilePicture": "https://..."
    },
    "userId": "user-id"
  }
}
```

## ✅ **Benefits of Firebase Auth**

1. **Easy Frontend Integration** - Simple SDK
2. **Multiple Providers** - Google, Facebook, Email, etc.
3. **Built-in Security** - Token management
4. **Real-time Updates** - Auth state changes
5. **No OAuth Complexity** - Firebase handles it all

## 🎉 **You're Ready!**

Your Firebase authentication system is now ready. The frontend can easily integrate with Firebase SDK and your backend will handle the rest!

**Next Steps:**
1. Set up Firebase project
2. Configure environment variables
3. Test the endpoints
4. Integrate with your frontend

This approach is much simpler than direct Google OAuth! 🚀 