import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { USER_ROLE } from '../types/enum';

// Firebase Admin SDK (you'll need to install: npm install firebase-admin)
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (you'll need to add your service account key)
let firebaseApp: admin.app.App;

try {
  // Check if Firebase is already initialized
  firebaseApp = admin.app();
} catch (error) {
  // Initialize Firebase Admin SDK
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export interface FirebaseUserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface FirebaseAuthResult {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  userId?: string;
}

export class FirebaseAuthService {
  private auth: admin.auth.Auth;

  constructor() {
    this.auth = firebaseApp.auth();
  }

  // Verify Firebase ID token
  async verifyFirebaseToken(idToken: string): Promise<FirebaseUserData> {
    try {
      const decodedToken = await this.auth.verifyIdToken(idToken);
      
      return {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || decodedToken.display_name,
        photoURL: decodedToken.picture || decodedToken.photo_url,
        emailVerified: decodedToken.email_verified || false,
      };
    } catch (error) {
      throw new Error('Invalid Firebase token');
    }
  }

  // Sign up with Firebase
  async signupWithFirebase(firebaseUserData: FirebaseUserData): Promise<FirebaseAuthResult> {
    try {
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { email: firebaseUserData.email },
          { firebaseUid: firebaseUserData.uid }
        ]
      });

      if (user) {
        // User exists, generate JWT token
        const token = this.generateJWT(user);
        
        return {
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            profilePicture: user.profilePicture,
          },
          userId: user._id.toString(),
        };
      }

      // Create new user
      const newUser = new User({
        firstName: firebaseUserData.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUserData.displayName?.split(' ').slice(1).join(' ') || '',
        email: firebaseUserData.email,
        firebaseUid: firebaseUserData.uid,
        isEmailVerified: firebaseUserData.emailVerified,
        profilePicture: firebaseUserData.photoURL,
        role: USER_ROLE.STUDENT, // Default role
        status: 'active',
      });

      await newUser.save();

      // Generate JWT token
      const token = this.generateJWT(newUser);

      return {
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          isEmailVerified: newUser.isEmailVerified,
          profilePicture: newUser.profilePicture,
        },
        userId: newUser._id.toString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Firebase signup failed');
    }
  }

  // Login with Firebase
  async loginWithFirebase(firebaseUserData: FirebaseUserData): Promise<FirebaseAuthResult> {
    try {
      // Find user by Firebase UID or email
      const user = await User.findOne({
        $or: [
          { firebaseUid: firebaseUserData.uid },
          { email: firebaseUserData.email }
        ]
      });

      if (!user) {
        throw new Error('User not found. Please sign up first.');
      }

      // Update user's Firebase UID if not set
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUserData.uid;
        await user.save();
      }

      // Update email verification status if needed
      if (!user.isEmailVerified && firebaseUserData.emailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }

      // Generate JWT token
      const token = this.generateJWT(user);

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          profilePicture: user.profilePicture,
        },
        userId: user._id.toString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Firebase login failed');
    }
  }

  // Generate JWT token
  private generateJWT(user: any): string {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );
  }

  // Get user by Firebase UID
  async getUserByFirebaseUid(firebaseUid: string) {
    return await User.findOne({ firebaseUid });
  }

  // Update user profile from Firebase
  async updateUserFromFirebase(firebaseUid: string, firebaseUserData: FirebaseUserData) {
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Update user data
    user.firstName = firebaseUserData.displayName?.split(' ')[0] || user.firstName;
    user.lastName = firebaseUserData.displayName?.split(' ').slice(1).join(' ') || user.lastName;
    user.email = firebaseUserData.email;
    user.isEmailVerified = firebaseUserData.emailVerified;
    user.profilePicture = firebaseUserData.photoURL || user.profilePicture;

    await user.save();
    return user;
  }
} 