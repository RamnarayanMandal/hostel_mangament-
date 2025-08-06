import { Router } from 'express';
import { AuthController } from '../../controllers/authController';
import { AuthMiddleware } from '../../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

// Public routes (no authentication required)
router.post('/signup', AuthMiddleware.rateLimitAuth(5, 15 * 60 * 1000), authController.signup.bind(authController));
router.post('/login', AuthMiddleware.rateLimitAuth(5, 15 * 60 * 1000), authController.login.bind(authController));

// OTP verification routes
router.post('/verify-email-otp', authController.verifyEmailOTP.bind(authController));
router.post('/verify-phone-otp', authController.verifyPhoneOTP.bind(authController));
router.post('/resend-email-otp', AuthMiddleware.rateLimitAuth(3, 5 * 60 * 1000), authController.resendEmailOTP.bind(authController));
router.post('/resend-phone-otp', AuthMiddleware.rateLimitAuth(3, 5 * 60 * 1000), authController.resendPhoneOTP.bind(authController));

// Password management routes
router.post('/forgot-password', AuthMiddleware.rateLimitAuth(3, 15 * 60 * 1000), authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

// Google OAuth routes
router.get('/google/auth-url', authController.getGoogleAuthUrl.bind(authController));
router.post('/google/login', authController.googleLogin.bind(authController));

// Protected routes (authentication required)
router.use(AuthMiddleware.verifyToken);

// User profile routes
router.get('/profile', authController.getUserProfile.bind(authController));
router.put('/profile', authController.updateProfile.bind(authController));

// Password change (requires authentication)
router.put('/change-password', authController.changePassword.bind(authController));

// Logout
router.post('/logout', authController.logout.bind(authController));

export default router; 