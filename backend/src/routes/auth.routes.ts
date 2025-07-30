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

export default router;
