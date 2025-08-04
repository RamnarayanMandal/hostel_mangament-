import express from 'express';
import { FirebaseAuthController } from '../../controllers/firebaseAuthController';

const router = express.Router();
const firebaseAuthController = new FirebaseAuthController();

// Firebase Authentication Routes
router.post('/signup', firebaseAuthController.firebaseSignup.bind(firebaseAuthController));
router.post('/login', firebaseAuthController.firebaseLogin.bind(firebaseAuthController));
router.post('/verify-token', firebaseAuthController.verifyToken.bind(firebaseAuthController));
router.get('/user/:firebaseUid', firebaseAuthController.getUserByFirebaseUid.bind(firebaseAuthController));

export default router; 