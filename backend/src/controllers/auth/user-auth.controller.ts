import { Request, Response } from 'express';
import Joi from 'joi';
import { userAuthService } from '../../services/auth/user-auth.service';
import { sendSuccess, sendError } from '../../utils/response.utils';

// Validation schemas
const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email format is invalid',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required',
    }),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Verification token is required',
    }),
});

const resendVerificationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    }),
});

/**
 * Register new user
 * POST /api/v1/auth/register
 */
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.registerUser(value);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'EMAIL_EXISTS':
          statusCode = 409;
          break;
        case 'RATE_LIMITED':
          statusCode = 429;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Registration failed',
        result.code,
        statusCode,
        result.details
      );
    }

    // Success response (201 Created)
    return sendSuccess(
      res,
      result.data,
      undefined,
      201
    );

  } catch (error) {
    console.error('Register user controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Verify user email
 * POST /api/v1/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = verifyEmailSchema.validate(req.body);
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.verifyEmail(value.token);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'RATE_LIMITED':
          statusCode = 429;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        case 'INVALID_TOKEN':
        case 'ALREADY_VERIFIED':
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Email verification failed',
        result.code,
        statusCode
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      result.data,
      undefined,
      200
    );

  } catch (error) {
    console.error('Verify email controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Resend verification email
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = resendVerificationSchema.validate(req.body);
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.resendVerificationEmail(value.email);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'EMAIL_NOT_FOUND':
          statusCode = 404;
          break;
        case 'RATE_LIMITED':
          statusCode = 429;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        case 'ALREADY_VERIFIED':
        case 'EMAIL_SEND_ERROR':
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Failed to resend verification email',
        result.code,
        statusCode
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      result.data,
      undefined,
      200
    );

  } catch (error) {
    console.error('Resend verification controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * User login
 * POST /api/v1/auth/login
 */
const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    
    // Validate input
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.loginUser(value);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'INVALID_CREDENTIALS':
          statusCode = 400;
          break;
        case 'EMAIL_NOT_VERIFIED':
          statusCode = 401;
          break;
        case 'ACCOUNT_LOCKED':
          statusCode = 403;
          break;
        case 'SERVER_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Login failed',
        result.code,
        statusCode,
        result.details
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      result.data,
      'Login successful',
      200
    );

  } catch (error) {
    console.error('Login user controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * User logout
 * POST /api/v1/auth/logout
 */
const logoutSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required',
    }),
});

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = logoutSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.logoutUser(value.refreshToken);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'INVALID_TOKEN':
          statusCode = 401;
          break;
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'SERVER_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Logout failed',
        result.code,
        statusCode
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      {},
      'Logout successful',
      200
    );

  } catch (error) {
    console.error('Logout user controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Refresh token
 * POST /api/v1/auth/refresh-token
 */
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required',
    }),
});

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = refreshTokenSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.refreshUserToken(value.refreshToken);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'INVALID_TOKEN':
        case 'TOKEN_EXPIRED':
          statusCode = 401;
          break;
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'SERVER_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Token refresh failed',
        result.code,
        statusCode
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      result.data,
      undefined,
      200
    );

  } catch (error) {
    console.error('Refresh token controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Request password reset
 * POST /api/v1/auth/request-password-reset
 */
const requestPasswordResetSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    }),
});

export const requestPasswordReset = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = requestPasswordResetSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.requestPasswordReset(value.email);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'EMAIL_NOT_FOUND':
          statusCode = 404;
          break;
        case 'RATE_LIMITED':
          statusCode = 429;
          break;
        case 'EMAIL_SEND_ERROR':
          statusCode = 400;
          break;
        case 'SERVER_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Password reset request failed',
        result.code,
        statusCode,
        result.details
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      result.data,
      undefined,
      200
    );

  } catch (error) {
    console.error('Request password reset controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Reset password
 * POST /api/v1/auth/reset-password
 */
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Token is required',
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required',
    }),
});

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    
    // Check if the request body is empty or malformed
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendError(
        res,
        'Request body is empty or malformed',
        'INVALID_REQUEST',
        400
      );
    }
    
    // Validate input
    const { error, value } = resetPasswordSchema.validate(req.body, { abortEarly: false });
    
    // Log validation result
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userAuthService.resetPassword(value.token, value.newPassword, value.confirmPassword);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'INVALID_RESET_TOKEN':
        case 'EXPIRED_RESET_TOKEN':
        case 'RESET_TOKEN_USED':
          statusCode = 400;
          break;
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'SERVER_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Password reset failed',
        result.code,
        statusCode,
        result.details
      );
    }

    // Success response (200 OK)
    return sendSuccess(
      res,
      result.data,
      undefined,
      200
    );

  } catch (error) {
    console.error('Reset password controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

// Export all controller functions
export const userAuthController = {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  logoutUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
};

export default userAuthController;
