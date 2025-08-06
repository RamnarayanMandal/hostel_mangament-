import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useMutation } from '@tanstack/react-query';
import authService from '@/service/authService';
import { AuthResponse } from '@/types';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
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
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

// Hook for Firebase signup with backend
export const useFirebaseSignup = () => {
  return useMutation({
    mutationFn: async (idToken: string) => {
      const response = await authService.firebaseAuth(idToken);
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      console.log('Firebase signup successful:', data);
      // Store the JWT token from your backend
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        // Store user data if needed
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
      } else if (data.token) {
        // Fallback for old response format
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    },
    onError: (error) => {
      console.error('Firebase signup error:', error);
    }
  });
};

// Hook for Firebase login with backend
export const useFirebaseLogin = () => {
  return useMutation({
    mutationFn: async (idToken: string) => {
      const response = await authService.firebaseLogin(idToken);
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      console.log('Firebase login successful:', data);
      // Store the JWT token from your backend
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        // Store user data if needed
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
      } else if (data.token) {
        // Fallback for old response format
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    },
    onError: (error) => {
      console.error('Firebase login error:', error);
    }
  });
};

// Hook for Firebase signup/login with backend (legacy - for backward compatibility)
export const useFirebaseAuthMutation = () => {
  return useMutation({
    mutationFn: async (idToken: string) => {
      const response = await authService.firebaseAuth(idToken);
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      console.log('Firebase auth successful:', data);
      // Store the JWT token from your backend
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        // Store user data if needed
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
      } else if (data.token) {
        // Fallback for old response format
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    },
    onError: (error) => {
      console.error('Firebase auth error:', error);
    }
  });
}; 