import express from 'express';
import authRoutes from './api/authRoutes';
import firebaseAuthRoutes from './api/firebaseAuthRoutes';
import roleRoutes from './api/roleRoutes';
import exampleRoutes from './api/exampleRoutes';


const router = express.Router();



// Authentication routes
router.use('/auth', authRoutes);

// Firebase Authentication routes
router.use('/firebase-auth', firebaseAuthRoutes);

// Role management routes
router.use('/role', roleRoutes);

// Example/demonstration routes for role-based access
router.use('/example', exampleRoutes);

export default router;