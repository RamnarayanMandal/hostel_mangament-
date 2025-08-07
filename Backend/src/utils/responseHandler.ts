import { Response } from 'express';

// Response interface
interface ApiResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Success response handler
export class ResponseHandler {
  // Send success response
  static success(
    res: Response,
    message: string = 'Success',
    data?: any,
    statusCode: number = 200
  ) {
    const response: ApiResponse = {
      success: true,
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  // Send created response
  static created(
    res: Response,
    message: string = 'Created successfully',
    data?: any
  ) {
    return this.success(res, message, data, 201);
  }

  // Send paginated response
  static paginated(
    res: Response,
    message: string = 'Data retrieved successfully',
    data: any[],
    page: number,
    limit: number,
    total: number
  ) {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse = {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return res.status(200).json(response);
  }

  // Send no content response
  static noContent(res: Response) {
    return res.status(204).send();
  }

  // Send error response (for manual error handling)
  static error(
    res: Response,
    message: string = 'Error occurred',
    statusCode: number = 500,
    errors?: any[]
  ) {
    const response: any = {
      success: false,
      message,
      statusCode,
    };

    if (errors && errors.length > 0) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  // Send validation error response
  static validationError(
    res: Response,
    message: string = 'Validation failed',
    errors: any[]
  ) {
    return this.error(res, message, 400, errors);
  }

  // Send not found response
  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ) {
    return this.error(res, message, 404);
  }

  // Send unauthorized response
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ) {
    return this.error(res, message, 401);
  }

  // Send forbidden response
  static forbidden(
    res: Response,
    message: string = 'Forbidden'
  ) {
    return this.error(res, message, 403);
  }

  // Send conflict response
  static conflict(
    res: Response,
    message: string = 'Conflict'
  ) {
    return this.error(res, message, 409);
  }

  // Send too many requests response
  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests'
  ) {
    return this.error(res, message, 429);
  }
} 