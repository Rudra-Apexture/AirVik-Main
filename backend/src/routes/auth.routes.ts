import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { userAuthController } from '../controllers/auth/user-auth.controller';

const router = Router();

// Rate limiting configurations based on API documentation
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many registration attempts. Please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many verification attempts',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const resendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1, // 1 request per 5 minutes per IP
  message: {
    success: false,
    error: 'Please wait before requesting another verification email',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiters
const passwordResetRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: {
    success: false,
    error: 'Too many password reset requests. Please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Additional rate limiters for login and token refresh
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many login attempts. Please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshTokenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: {
    success: false,
    error: 'Too many token refresh attempts. Please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication routes

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', registrationLimiter, userAuthController.registerUser);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email with token
 * @access  Public
 */
router.post('/verify-email', verificationLimiter, userAuthController.verifyEmail);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', resendLimiter, userAuthController.resendVerification);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get tokens
 * @access  Public
 */
router.post('/login', loginLimiter, userAuthController.loginUser);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Protected
 * @note    Authentication middleware will be added in task B4
 * @todo    Add authentication middleware in task B4
 */
router.post('/logout', userAuthController.logoutUser);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Get new access and refresh tokens
 * @access  Public
 */
router.post('/refresh-token', refreshTokenLimiter, userAuthController.refreshToken);

/**
 * @route   POST /api/v1/auth/request-password-reset
 * @desc    Request a password reset email
 * @access  Public
 */
router.post('/request-password-reset', passwordResetRequestLimiter, userAuthController.requestPasswordReset);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', userAuthController.resetPassword);

export default router;
