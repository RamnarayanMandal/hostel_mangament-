import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser } from '../types/user';
import { PERMISSION, ROLE_PERMISSIONS, ROLE_HIERARCHY, USER_ROLE } from '../types/enum';

export class AuthMiddleware {
  // Verify JWT token
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required',
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required',
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Check if user still exists
      const user = await User.findById(decoded.userId).select('-password') as IUser | null;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'User account is not active',
        });
      }

      // Attach user to request
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired',
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  }

  // Check if user has required role
  static requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      next();
    };
  }

  // Check if user has required permission
  static requirePermission(permissions: PERMISSION[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required',
          });
        }

        // Import RoleService dynamically to avoid circular dependency
        const { RoleService } = await import('../services/roleService');
        const roleService = new RoleService();
        
        const hasPermission = await Promise.race([
          Promise.all(permissions.map(permission => 
            roleService.hasPermission(req.user!.userId, permission)
          )),
          new Promise(resolve => setTimeout(() => resolve(false), 5000)) // 5 second timeout
        ]);

        const hasAnyPermission = Array.isArray(hasPermission) 
          ? hasPermission.some(Boolean) 
          : hasPermission;

        if (!hasAnyPermission) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions',
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Error checking permissions',
        });
      }
    };
  }

  // Check if user can manage target role (role hierarchy)
  static canManageRole(targetRole: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userRole = req.user.role as USER_ROLE;
      const manageableRoles = ROLE_HIERARCHY[userRole] || [];

      if (!manageableRoles.includes(targetRole as USER_ROLE)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot manage users with this role',
        });
      }

      next();
    };
  }

  // Check if user is admin
  static requireAdmin(req: Request, res: Response, next: NextFunction) {
    return AuthMiddleware.requireRole([USER_ROLE.ADMIN])(req, res, next);
  }

  // Check if user is teacher or higher
  static requireTeacher(req: Request, res: Response, next: NextFunction) {
    return AuthMiddleware.requireRole([USER_ROLE.TEACHER, USER_ROLE.ADMIN])(req, res, next);
  }

  // Check if user is student or higher
  static requireStudent(req: Request, res: Response, next: NextFunction) {
    return AuthMiddleware.requireRole([USER_ROLE.STUDENT, USER_ROLE.TEACHER, USER_ROLE.ADMIN])(req, res, next);
  }

  // Check if user is verified
  static async requireVerifiedUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Email verification required',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Optional authentication (doesn't fail if no token)
  static async optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.substring(7);

      if (!token) {
        return next();
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Check if user still exists
      const user = await User.findById(decoded.userId).select('-password');
      if (!user || user.status !== 'active') {
        return next();
      }

      // Attach user to request
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      // Don't fail for optional auth, just continue without user
      next();
    }
  }

  // Rate limiting for authentication attempts (IP + Account based)
  static rateLimitAuth(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    const attempts = new Map<string, { count: number; resetTime: number }>();

    // Cleanup expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of attempts.entries()) {
        if (now > value.resetTime) {
          attempts.delete(key);
        }
      }
    }, 5 * 60 * 1000);

    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const email = req.body?.email || 'unknown';
      const now = Date.now();

      // Create unique key for IP + Email combination
      const key = `${ip}:${email}`;
      const userAttempts = attempts.get(key);
      
      if (!userAttempts || now > userAttempts.resetTime) {
        attempts.set(key, { count: 1, resetTime: now + windowMs });
        return next();
      }

      if (userAttempts.count >= maxAttempts) {
        const remainingTime = Math.ceil((userAttempts.resetTime - now) / (1000 * 60)); // Convert to minutes
        return res.status(429).json({
          success: false,
          message: `Too many failed attempts, please try again in ${remainingTime} minutes.`,
        });
      }

      userAttempts.count++;
      next();
    };
  }

  // Validate email verification
  static async validateEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Email verification required. Please verify your email before proceeding.',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Validate phone verification
  static async validatePhoneVerification(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isPhoneVerified) {
        return res.status(403).json({
          success: false,
          message: 'Phone verification required. Please verify your phone number before proceeding.',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
} 