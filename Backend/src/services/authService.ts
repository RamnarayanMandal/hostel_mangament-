import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { SignupInput, LoginInput, OtpVerificationInput, PhoneOtpVerificationInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput, UpdateProfileInput } from '../validations/authValidation';
import { EmailService } from './emailService';
import { SmsService } from './smsService';
import { GoogleOAuthService } from './googleOAuthService';

export class AuthService {
  private emailService: EmailService;
  private smsService: SmsService;
  private googleOAuthService: GoogleOAuthService;

  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SmsService();
    this.googleOAuthService = new GoogleOAuthService();
  }

  // Generate JWT token
  private generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }

  // Generate OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare password
  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Signup
  async signup(userData: SignupInput) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Check if phone number already exists
      const existingPhone = await User.findOne({ phoneNumber: userData.phoneNumber });
      if (existingPhone) {
        throw new Error('User with this phone number already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
        isEmailVerified: false,
        isPhoneVerified: false,
      });

      await user.save();

      // Generate and send email verification OTP
      const emailOTP = this.generateOTP();
      user.emailVerificationToken = emailOTP;
      user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send email verification
      await this.emailService.sendVerificationEmail(userData.email, emailOTP);

      // Generate and send phone verification OTP
      const phoneOTP = this.generateOTP();
      user.phoneVerificationOTP = phoneOTP;
      user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send SMS verification
      await this.smsService.sendVerificationSMS(userData.phoneNumber, phoneOTP);

      return {
        success: true,
        message: 'User registered successfully. Please verify your email and phone number.',
        userId: user._id,
      };
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(loginData: LoginInput) {
    try {
      // Find user by email
      const user = await User.findOne({ email: loginData.email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if account is locked
      if (user.lockUntil && user.lockUntil > new Date()) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }

      // Check if user has password (for Google OAuth users)
      if (!user.password) {
        throw new Error('Please login with Google or reset your password');
      }

      // Verify password
      const isPasswordValid = await this.comparePassword(loginData.password, user.password);
      if (!isPasswordValid) {
        // Increment login attempts
        user.loginAttempts += 1;
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        }
        
        await user.save();
        throw new Error('Invalid email or password');
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      // Check if email is verified
      if (!user.isEmailVerified) {
        throw new Error('Please verify your email before logging in');
      }

      // Generate token
      const token = this.generateToken(user._id.toString(), user.email, user.role);

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
          isPhoneVerified: user.isPhoneVerified,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Email OTP verification
  async verifyEmailOTP(verificationData: OtpVerificationInput) {
    try {
      const user = await User.findOne({ email: verificationData.email });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email is already verified');
      }

      if (!user.emailVerificationToken || !user.emailVerificationExpires) {
        throw new Error('No verification token found. Please request a new one.');
      }

      if (user.emailVerificationExpires < new Date()) {
        throw new Error('Verification token has expired. Please request a new one.');
      }

      if (user.emailVerificationToken !== verificationData.otp) {
        throw new Error('Invalid verification code');
      }

      // Mark email as verified
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Phone OTP verification
  async verifyPhoneOTP(verificationData: PhoneOtpVerificationInput) {
    try {
      const user = await User.findOne({ phoneNumber: verificationData.phoneNumber });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isPhoneVerified) {
        throw new Error('Phone number is already verified');
      }

      if (!user.phoneVerificationOTP || !user.phoneVerificationExpires) {
        throw new Error('No verification OTP found. Please request a new one.');
      }

      if (user.phoneVerificationExpires < new Date()) {
        throw new Error('Verification OTP has expired. Please request a new one.');
      }

      if (user.phoneVerificationOTP !== verificationData.otp) {
        throw new Error('Invalid verification code');
      }

      // Mark phone as verified
      user.isPhoneVerified = true;
      user.phoneVerificationOTP = undefined;
      user.phoneVerificationExpires = undefined;
      await user.save();

      return {
        success: true,
        message: 'Phone number verified successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Resend email verification OTP
  async resendEmailOTP(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email is already verified');
      }

      // Generate new OTP
      const emailOTP = this.generateOTP();
      user.emailVerificationToken = emailOTP;
      user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send email verification
      await this.emailService.sendVerificationEmail(email, emailOTP);

      return {
        success: true,
        message: 'Email verification OTP sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Resend phone verification OTP
  async resendPhoneOTP(phoneNumber: string) {
    try {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isPhoneVerified) {
        throw new Error('Phone number is already verified');
      }

      // Generate new OTP
      const phoneOTP = this.generateOTP();
      user.phoneVerificationOTP = phoneOTP;
      user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      // Send SMS verification
      await this.smsService.sendVerificationSMS(phoneNumber, phoneOTP);

      return {
        success: true,
        message: 'Phone verification OTP sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(forgotPasswordData: ForgotPasswordInput) {
    try {
      const user = await User.findOne({ email: forgotPasswordData.email });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // Send reset email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      return {
        success: true,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(resetPasswordData: ResetPasswordInput) {
    try {
      const user = await User.findOne({
        resetPasswordToken: resetPasswordData.token,
        resetPasswordExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(resetPasswordData.password);

      // Update password and clear reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId: string, changePasswordData: ChangePasswordInput) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.password) {
        throw new Error('Cannot change password for Google OAuth users');
      }

      // Verify current password
      const isCurrentPasswordValid = await this.comparePassword(
        changePasswordData.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(changePasswordData.newPassword);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // Update profile
  async updateProfile(userId: string, updateData: UpdateProfileInput) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if phone number is being changed and if it's already taken
      if (updateData.phoneNumber && updateData.phoneNumber !== user.phoneNumber) {
        const existingPhone = await User.findOne({ phoneNumber: updateData.phoneNumber });
        if (existingPhone) {
          throw new Error('Phone number is already in use');
        }
        // Reset phone verification if phone number changes
        user.isPhoneVerified = false;
        user.phoneVerificationOTP = undefined;
        user.phoneVerificationExpires = undefined;
      }

      // Update user data
      Object.assign(user, updateData);
      await user.save();

      return {
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Google OAuth login
  async googleLogin(authorizationCode: string) {
    try {
      // Exchange code for tokens and get user info
      const googleUser = await this.googleOAuthService.getUserInfo(authorizationCode);

      // Check if user exists
      let user = await User.findOne({ googleId: googleUser.id });

      if (!user) {
        // Check if user exists with same email
        user = await User.findOne({ email: googleUser.email });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = googleUser.id;
          user.isEmailVerified = true; // Google emails are pre-verified
          await user.save();
        } else {
          // Create new user
          user = new User({
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
            email: googleUser.email,
            googleId: googleUser.id,
            isEmailVerified: true,
            isPhoneVerified: false,
            role: 'user',
            status: 'active',
            gender: 'other',
            phoneNumber: '', // Will need to be updated later
          });
          await user.save();
        }
      }

      // Generate token
      const token = this.generateToken(user._id.toString(), user.email, user.role);

      return {
        success: true,
        message: 'Google login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const user = await User.findById(userId).select('-password -emailVerificationToken -emailVerificationExpires -phoneVerificationOTP -phoneVerificationExpires -resetPasswordToken -resetPasswordExpires');
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  // Logout (client-side token removal)
  async logout(userId: string) {
    try {
      // In a more advanced implementation, you might want to blacklist the token
      // For now, we'll just return success as token invalidation is handled client-side
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      throw error;
    }
  }
} 