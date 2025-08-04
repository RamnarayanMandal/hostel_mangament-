import { z } from 'zod';

// Firebase authentication schemas
export const firebaseAuthSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
});

export const firebaseSignupSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
  role: z.enum(['student', 'teacher', 'admin']).optional().default('student'),
});

export const firebaseLoginSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
});

// Export types
export type FirebaseAuthInput = z.infer<typeof firebaseAuthSchema>;
export type FirebaseSignupInput = z.infer<typeof firebaseSignupSchema>;
export type FirebaseLoginInput = z.infer<typeof firebaseLoginSchema>; 