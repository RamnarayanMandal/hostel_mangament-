# Global Error Handling & Response Handler

This document explains how to use the global error handling system and response handler utilities.

## 🎯 Overview

The application now has a centralized error handling system that provides:
- **Consistent error responses** across all endpoints
- **Automatic error logging** with detailed information
- **Standardized success responses** with proper formatting
- **Async error handling** without try-catch blocks

## 📁 Files Created

1. **`src/middlewares/errorHandler.ts`** - Global error handler middleware
2. **`src/utils/responseHandler.ts`** - Response utility class
3. **Updated `index.ts`** - Integrated global error handler
4. **Updated `src/controllers/authController.ts`** - Using new response handler

## 🔧 Global Error Handler Features

### Error Types Handled:
- ✅ **Zod Validation Errors** - Automatic field-level error details
- ✅ **Mongoose Validation Errors** - Database validation errors
- ✅ **Mongoose Cast Errors** - Invalid ObjectId, etc.
- ✅ **Mongoose Duplicate Key Errors** - Unique constraint violations
- ✅ **JWT Errors** - Token validation and expiration
- ✅ **JSON Parsing Errors** - Invalid request body
- ✅ **Custom App Errors** - Application-specific errors
- ✅ **Unknown Errors** - Fallback error handling

### Error Response Format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "invalid_string"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

## 🚀 Response Handler Features

### Success Response Methods:
- `ResponseHandler.success()` - Standard success response
- `ResponseHandler.created()` - 201 Created response
- `ResponseHandler.paginated()` - Paginated data response
- `ResponseHandler.noContent()` - 204 No Content

### Error Response Methods:
- `ResponseHandler.error()` - Generic error response
- `ResponseHandler.validationError()` - Validation errors
- `ResponseHandler.notFound()` - 404 Not Found
- `ResponseHandler.unauthorized()` - 401 Unauthorized
- `ResponseHandler.forbidden()` - 403 Forbidden
- `ResponseHandler.conflict()` - 409 Conflict
- `ResponseHandler.tooManyRequests()` - 429 Too Many Requests

## 📝 Usage Examples

### 1. Controller with asyncHandler (Recommended)

```typescript
import { asyncHandler } from '../middlewares/errorHandler';
import { ResponseHandler } from '../utils/responseHandler';

export class UserController {
  // No try-catch needed - errors are automatically caught
  getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    ResponseHandler.success(res, 'User retrieved successfully', user);
  });
}
```

### 2. Using AppError for Custom Errors

```typescript
import { AppError } from '../middlewares/errorHandler';

// In your service or controller
if (!user) {
  throw new AppError('User not found', 404);
}

if (!user.isActive) {
  throw new AppError('User account is inactive', 403);
}
```

### 3. Response Handler Examples

```typescript
// Success responses
ResponseHandler.success(res, 'Operation completed', data);
ResponseHandler.created(res, 'User created successfully', { userId: user.id });

// Paginated response
ResponseHandler.paginated(res, 'Users retrieved', users, page, limit, total);

// Error responses
ResponseHandler.notFound(res, 'User not found');
ResponseHandler.validationError(res, 'Validation failed', errors);
ResponseHandler.unauthorized(res, 'Invalid credentials');
```

### 4. Paginated Response Format

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🔍 Error Logging

The global error handler automatically logs detailed error information:

```javascript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  method: "POST",
  url: "/api/auth/signup",
  statusCode: 400,
  message: "Validation Error",
  stack: "Error stack trace",
  userAgent: "Mozilla/5.0...",
  ip: "192.168.1.1"
}
```

## 🛡️ Security Features

- **Stack traces** only shown in development
- **Sensitive error details** hidden in production
- **Request logging** for debugging
- **IP and User-Agent** tracking for security

## 🔄 Migration Guide

### Before (Old Way):
```typescript
async signup(req: Request, res: Response) {
  try {
    const validatedData = signupSchema.parse(req.body);
    const result = await this.authService.signup(validatedData);
    
    res.status(201).json({
      success: true,
      message: result.message,
      data: { userId: result.userId }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Signup failed'
    });
  }
}
```

### After (New Way):
```typescript
signup = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = signupSchema.parse(req.body);
  const result = await this.authService.signup(validatedData);
  
  ResponseHandler.created(res, result.message, {
    userId: result.userId
  });
});
```

## ✅ Benefits

1. **Cleaner Code** - No more try-catch blocks in controllers
2. **Consistent Responses** - All endpoints return the same format
3. **Better Error Handling** - Automatic error type detection
4. **Improved Logging** - Detailed error information
5. **Security** - Sensitive data hidden in production
6. **Maintainability** - Centralized error handling logic

## 🚀 Getting Started

1. **Import the utilities** in your controllers:
```typescript
import { asyncHandler } from '../middlewares/errorHandler';
import { ResponseHandler } from '../utils/responseHandler';
```

2. **Wrap your controller methods** with `asyncHandler`:
```typescript
methodName = asyncHandler(async (req: Request, res: Response) => {
  // Your logic here
  ResponseHandler.success(res, 'Success message', data);
});
```

3. **Use AppError** for custom errors:
```typescript
throw new AppError('Custom error message', 400);
```

The global error handler is now active and will automatically handle all errors across your application! 🎉 