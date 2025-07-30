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

// Export all controller functions
export const userAuthController = {
  registerUser,
  verifyEmail,
  resendVerification,
};

export default userAuthController;
