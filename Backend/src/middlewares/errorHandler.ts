import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

// Custom error class for application errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

// Success response interface
interface SuccessResponse {
  success: true;
  message: string;
  data?: any;
}

// Global error handler middleware
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  // Handle different types of errors
  if (error instanceof AppError) {
    // Custom application error
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    // Zod validation error
    statusCode = 400;
    message = 'Validation Error';
    const zodError = error as any;
    errors = zodError.errors?.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    })) || [];
  } else if (error instanceof mongoose.Error.ValidationError) {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(error.errors || {}).map((err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));
  } else if (error instanceof mongoose.Error.CastError) {
    // Mongoose cast error (invalid ObjectId, etc.)
    statusCode = 400;
    message = 'Invalid ID format';
    errors = [{
      field: error.path,
      message: `Invalid ${error.path}: ${error.value}`,
      value: error.value,
    }];
  } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    // Mongoose duplicate key error (MongoDB error code 11000)
    statusCode = 409;
    message = 'Duplicate field value';
    const mongoError = error as any;
    const field = Object.keys(mongoError.keyValue || {})[0];
    errors = [{
      field,
      message: `${field} already exists`,
      value: mongoError.keyValue?.[field],
    }];
  } else if (error.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    // JWT expired error
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'SyntaxError' && 'body' in error) {
    // JSON parsing error
    statusCode = 400;
    message = 'Invalid JSON format';
  } else {
    // Unknown error
    statusCode = 500;
    message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;
  }

  // Log error details
  console.error('Error Details:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode,
    message: error.message,
    stack: error.stack,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    message,
  };

  // Add errors array if there are validation errors
  if (errors.length > 0) {
    errorResponse.errors = errors;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper to catch async errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}; 