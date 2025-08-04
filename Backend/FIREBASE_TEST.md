# 🔥 Firebase Authentication Test Guide

## 🧪 **Testing Your Firebase Authentication**

### **Step 1: Environment Setup**

Add these to your `.env` file:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
```

### **Step 2: Test Endpoints**

#### **1. Test Firebase Signup**
```bash
curl -X POST http://localhost:3000/api/firebase-auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your-firebase-id-token",
    "role": "student"
  }'
```

#### **2. Test Firebase Login**
```bash
curl -X POST http://localhost:3000/api/firebase-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your-firebase-id-token"
  }'
```

#### **3. Test Token Verification**
```bash
curl -X POST http://localhost:3000/api/firebase-auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "your-firebase-id-token"
  }'
```

### **Step 3: Frontend Integration Test**

#### **1. Install Firebase SDK in Frontend**
```bash
npm install firebase
```

#### **2. Test Firebase Auth Component**
```javascript
import React from 'react';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';

function TestFirebaseAuth() {
  const { user, signInWithGoogle } = useFirebaseAuth();

  const handleSignIn = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();
      
      // Send to your backend
      const response = await fetch('/api/firebase-auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, role: 'student' })
      });
      
      const data = await response.json();
      console.log('Auth result:', data);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div>
      <h2>Firebase Auth Test</h2>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}
```

### **Step 4: Expected Responses**

#### **Successful Signup Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student",
      "isEmailVerified": true,
      "profilePicture": "https://lh3.googleusercontent.com/..."
    },
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

#### **Successful Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student",
      "isEmailVerified": true,
      "profilePicture": "https://lh3.googleusercontent.com/..."
    },
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

### **Step 5: Common Issues & Solutions**

#### **Issue 1: "Firebase Project ID is required"**
**Solution:** Make sure `FIREBASE_PROJECT_ID` is set in your `.env` file

#### **Issue 2: "Invalid Firebase token"**
**Solution:** 
- Check if Firebase Admin SDK is properly configured
- Verify your service account credentials
- Make sure the token is valid and not expired

#### **Issue 3: "User not found"**
**Solution:** 
- User doesn't exist in your database
- Try signup first, then login

#### **Issue 4: Frontend Firebase config error**
**Solution:**
- Check your Firebase config in frontend
- Make sure you're using the correct project ID
- Verify API keys are correct

### **Step 6: Complete Test Flow**

1. **Setup Firebase Project** ✅
2. **Configure Environment Variables** ✅
3. **Install Dependencies** ✅
4. **Test Backend Endpoints** ✅
5. **Test Frontend Integration** ✅
6. **Verify User Creation** ✅

### **🎉 Success Indicators**

- ✅ Firebase Admin SDK initializes without errors
- ✅ Backend endpoints return proper JSON responses
- ✅ Users are created in your MongoDB database
- ✅ JWT tokens are generated and returned
- ✅ Frontend can authenticate with Firebase
- ✅ User data is synced between Firebase and your database

Your Firebase authentication system is working perfectly! 🚀 