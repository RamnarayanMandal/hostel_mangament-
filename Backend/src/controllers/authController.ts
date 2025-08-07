import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { 
  signupSchema, 
  loginSchema, 
  otpVerificationSchema, 
  phoneOtpVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  resendOtpSchema,
  googleAuthSchema
} from '../validations/authValidation';
import { ResponseHandler } from '../utils/responseHandler';
import { asyncHandler } from '../middlewares/errorHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Signup
  signup = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);

    // Call service
    const result = await this.authService.signup(validatedData);

    ResponseHandler.created(res, result.message, {
      userId: result.userId,
    });
  });

  // Login
  login = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Call service
    const result = await this.authService.login(validatedData);

    ResponseHandler.success(res, result.message, {
      token: result.token,
      user: result.user,
    });
  });

  // Email OTP verification
  verifyEmailOTP = asyncHandler(async (req: Request, res: Response) => {
    console.log('OTP Verification request body:', req.body);
    
    // Validate request body
    const validatedData = otpVerificationSchema.parse(req.body);
    console.log('OTP Validation passed:', validatedData);

    // Call service
    const result = await this.authService.verifyEmailOTP(validatedData);

    ResponseHandler.success(res, result.message);
  });

  // Phone OTP verification
  verifyPhoneOTP = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = phoneOtpVerificationSchema.parse(req.body);

    // Call service
    const result = await this.authService.verifyPhoneOTP(validatedData);

    ResponseHandler.success(res, result.message);
  });

  // Resend email OTP
  resendEmailOTP = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = resendOtpSchema.parse(req.body);

    // Call service
    const result = await this.authService.resendEmailOTP(validatedData.email);

    ResponseHandler.success(res, result.message);
  });

  // Resend email OTP for login (when email not verified)
  resendEmailOTPForLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.validationError(res, 'Email is required', []);
    }

    // Call service
    const result = await this.authService.resendEmailOTP(email);

    ResponseHandler.success(res, 'Verification code sent successfully. Please check your email and verify your account before logging in.');
  });

  // Check email verification status
  checkEmailVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return ResponseHandler.validationError(res, 'Email is required', []);
    }

    try {
      const user = await this.authService.getUserByEmail(email);
      
      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      ResponseHandler.success(res, 'Email verification status retrieved successfully', {
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
        return ResponseHandler.notFound(res, 'User not found');
      }
      throw error;
    }
  });

  // Resend phone OTP
  resendPhoneOTP = asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return ResponseHandler.validationError(res, 'Phone number is required', []);
    }

    // Call service
    const result = await this.authService.resendPhoneOTP(phoneNumber);

    ResponseHandler.success(res, result.message);
  });

  // Forgot password
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = forgotPasswordSchema.parse(req.body);

    // Call service
    const result = await this.authService.forgotPassword(validatedData);

    ResponseHandler.success(res, result.message);
  });

  // Validate reset token
  validateResetToken = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required',
      });
    }

    try {
      const isValid = await this.authService.validateResetToken(token);
      
      if (isValid) {
        ResponseHandler.success(res, 'Token is valid');
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
      }
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Token validation failed',
      });
    }
  });

  // Reset password
  async resetPassword(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = resetPasswordSchema.parse(req.body);

      // Call service
      const result = await this.authService.resetPassword(validatedData);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Password reset failed',
      });
    }
  }

  // Change password (requires authentication)
  async changePassword(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = changePasswordSchema.parse(req.body);

      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Call service
      const result = await this.authService.changePassword(userId, validatedData);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Password change failed',
      });
    }
  }

  // Update profile (requires authentication)
  async updateProfile(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = updateProfileSchema.parse(req.body);

      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Call service
      const result = await this.authService.updateProfile(userId, validatedData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
        },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Profile update failed',
      });
    }
  }

  // Get user profile (requires authentication)
  async getUserProfile(req: Request, res: Response) {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Call service
      const result = await this.authService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get user profile',
      });
    }
  }

  // Google OAuth login
  async googleLogin(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = googleAuthSchema.parse(req.body);

      // Call service
      const result = await this.authService.googleLogin(validatedData.code);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          token: result.token,
          user: result.user,
        },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Google login failed',
      });
    }
  }

  // Get Google OAuth URL
  async getGoogleAuthUrl(req: Request, res: Response) {
    try {
      const { GoogleOAuthService } = await import('../services/googleOAuthService');
      const googleOAuthService = new GoogleOAuthService();
      const authUrl = googleOAuthService.getAuthUrl();

      res.status(200).json({
        success: true,
        data: {
          authUrl,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get Google auth URL',
      });
    }
  }

  // Logout
  async logout(req: Request, res: Response) {
    try {
      // Get user ID from authenticated request
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Call service
      const result = await this.authService.logout(userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Logout failed',
      });
    }
  }
} 