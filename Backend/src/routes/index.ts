import express from 'express';
import authRoutes from './api/authRoutes';
import roleRoutes from './api/roleRoutes';
import exampleRoutes from './api/exampleRoutes';
import testRoutes from './api/testRoutes';

const router = express.Router();

// Test routes
router.use('/test', testRoutes);

// Authentication routes
// router.use('/auth', authRoutes);

// Role management routes
// router.use('/role', roleRoutes);

// Example/demonstration routes for role-based access
// router.use('/example', exampleRoutes);

export default router;