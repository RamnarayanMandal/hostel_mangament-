import { Request, Response } from 'express';
import { FirebaseAuthService } from '../services/firebaseAuthService';
import { 
  firebaseAuthSchema,
  firebaseSignupSchema,
  firebaseLoginSchema
} from '../validations/firebaseAuthValidation';
import { ResponseHandler } from '../utils/responseHandler';
import { asyncHandler } from '../middlewares/errorHandler';

export class FirebaseAuthController {
  private firebaseAuthService: FirebaseAuthService;

  constructor() {
    this.firebaseAuthService = new FirebaseAuthService();
  }

  // Firebase Signup
  firebaseSignup = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = firebaseSignupSchema.parse(req.body);

    // Verify Firebase token and get user data
    const firebaseUserData = await this.firebaseAuthService.verifyFirebaseToken(validatedData.idToken);

    // Sign up user with Firebase data
    const result = await this.firebaseAuthService.signupWithFirebase(firebaseUserData);

    ResponseHandler.created(res, result.message, {
      token: result.token,
      user: result.user,
      userId: result.userId,
    });
  });

  // Firebase Login
  firebaseLogin = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = firebaseLoginSchema.parse(req.body);

    // Verify Firebase token and get user data
    const firebaseUserData = await this.firebaseAuthService.verifyFirebaseToken(validatedData.idToken);

    // Login user with Firebase data
    const result = await this.firebaseAuthService.loginWithFirebase(firebaseUserData);

    ResponseHandler.success(res, result.message, {
      token: result.token,
      user: result.user,
      userId: result.userId,
    });
  });

  // Verify Firebase Token (for middleware)
  verifyToken = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = firebaseAuthSchema.parse(req.body);

    // Verify Firebase token
    const firebaseUserData = await this.firebaseAuthService.verifyFirebaseToken(validatedData.idToken);

    ResponseHandler.success(res, 'Token verified successfully', {
      user: firebaseUserData,
    });
  });

  // Get user by Firebase UID
  getUserByFirebaseUid = asyncHandler(async (req: Request, res: Response) => {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return ResponseHandler.validationError(res, 'Firebase UID is required', []);
    }

    const user = await this.firebaseAuthService.getUserByFirebaseUid(firebaseUid);

    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }

    ResponseHandler.success(res, 'User retrieved successfully', {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
      },
    });
  });
} 