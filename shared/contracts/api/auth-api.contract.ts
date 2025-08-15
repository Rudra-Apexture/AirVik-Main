// AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY
// This contract defines the EXACT API endpoints and formats from user-auth.controller.ts
// ALL future development MUST use these exact endpoints and response formats

/**
 * CRITICAL API NAMING RULES:
 * - MUST use "/api/v1/auth/" prefix for ALL auth endpoints
 * - MUST use "register" (NOT signup, create-user)
 * - MUST use "verify-email" (NOT verify, confirm-email)
 * - MUST use "resend-verification" (NOT resend-email, resend)
 * - MUST use "login" (NOT signin, authenticate)
 * - MUST use "logout" (NOT signout)
 * - MUST use "refresh-token" (NOT refresh, renew-token)
 */

// ============================================================================
// API ENDPOINTS (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const AUTH_API_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  VERIFY_EMAIL: '/api/v1/auth/verify-email',
  RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  REQUEST_PASSWORD_RESET: '/api/v1/auth/request-password-reset',
  RESET_PASSWORD: '/api/v1/auth/reset-password'
} as const;

// ============================================================================
// HTTP METHODS (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const AUTH_API_METHODS = {
  REGISTER: 'POST',
  VERIFY_EMAIL: 'POST',
  RESEND_VERIFICATION: 'POST',
  LOGIN: 'POST',
  LOGOUT: 'POST',
  REFRESH_TOKEN: 'POST',
  REQUEST_PASSWORD_RESET: 'POST',
  RESET_PASSWORD: 'POST'
} as const;

// ============================================================================
// REQUEST BODY SCHEMAS (EXACT FROM user-auth.controller.ts)
// ============================================================================

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// VALIDATION RULES (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const VALIDATION_RULES = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    required: true,
    trim: true
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    required: true,
    trim: true
  },
  email: {
    required: true,
    trim: true,
    lowercase: true,
    format: 'email'
  },
  password: {
    minLength: 8,
    required: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    description: 'Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  },
  confirmPassword: {
    required: true,
    mustMatch: 'password'
  },
  token: {
    required: true
  },
  refreshToken: {
    required: true
  },
  newPassword: {
    minLength: 8,
    required: true,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    description: 'Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  }
} as const;

// ============================================================================
// VALIDATION ERROR MESSAGES (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const VALIDATION_MESSAGES = {
  firstName: {
    empty: 'First name is required',
    min: 'First name must be at least 2 characters long',
    max: 'First name must not exceed 50 characters'
  },
  lastName: {
    empty: 'Last name is required',
    min: 'Last name must be at least 2 characters long',
    max: 'Last name must not exceed 50 characters'
  },
  email: {
    empty: 'Email is required',
    invalid: 'Email format is invalid'
  },
  password: {
    empty: 'Password is required',
    min: 'Password must be at least 8 characters long',
    pattern: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  },
  confirmPassword: {
    empty: 'Confirm password is required',
    mismatch: 'Passwords do not match'
  },
  token: {
    empty: 'Verification token is required'
  },
  refreshToken: {
    empty: 'Refresh token is required'
  },
  newPassword: {
    empty: 'New password is required',
    min: 'New password must be at least 8 characters long',
    pattern: 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  }
} as const;

// ============================================================================
// SUCCESS RESPONSE DATA (EXACT FROM user-auth.controller.ts)
// ============================================================================

export interface RegisterSuccessData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
  };
  message: string;
}

export interface VerifyEmailSuccessData {
  message: string;
}

export interface ResendVerificationSuccessData {
  message: string;
}

export interface LoginSuccessData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface LogoutSuccessData {
  message: string;
}

export interface RefreshTokenSuccessData {
  accessToken: string;
  refreshToken: string;
}

export interface RequestPasswordResetSuccessData {
  message: string;
}

export interface ResetPasswordSuccessData {
  message: string;
}

// ============================================================================
// ERROR CODES WITH HTTP STATUS (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const ERROR_STATUS_MAPPING = {
  VALIDATION_ERROR: 400,
  EMAIL_EXISTS: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  USER_NOT_FOUND: 404,
  INVALID_TOKEN: 400,
  ALREADY_VERIFIED: 400,
  EMAIL_NOT_FOUND: 404,
  EMAIL_SEND_ERROR: 400,
  INVALID_CREDENTIALS: 400,
  EMAIL_NOT_VERIFIED: 401,
  ACCOUNT_LOCKED: 403,
  SERVER_ERROR: 500,
  INVALID_REFRESH_TOKEN: 400,
  INVALID_RESET_TOKEN: 400,
  EXPIRED_RESET_TOKEN: 400,
  RESET_TOKEN_USED: 400
} as const;

// ============================================================================
// SUCCESS HTTP STATUS CODES (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const SUCCESS_STATUS_CODES = {
  REGISTER: 201,          // Created
  VERIFY_EMAIL: 200,      // OK
  RESEND_VERIFICATION: 200, // OK
  LOGIN: 200,             // OK
  LOGOUT: 200,            // OK
  REFRESH_TOKEN: 200,     // OK
  REQUEST_PASSWORD_RESET: 200, // OK
  RESET_PASSWORD: 200     // OK
} as const;

// ============================================================================
// CONTROLLER FUNCTION SIGNATURES (EXACT FROM user-auth.controller.ts)
// ============================================================================

export interface AuthControllerContract {
  registerUser(req: Request, res: Response): Promise<Response>;
  verifyEmail(req: Request, res: Response): Promise<Response>;
  resendVerification(req: Request, res: Response): Promise<Response>;
  loginUser(req: Request, res: Response): Promise<Response>;
  logoutUser(req: Request, res: Response): Promise<Response>;
  refreshToken(req: Request, res: Response): Promise<Response>;
  requestPasswordReset(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
}

// ============================================================================
// CONTROLLER EXPORT PATTERN (EXACT FROM user-auth.controller.ts)
// ============================================================================

/**
 * CRITICAL: Controller must be exported as named object with all methods
 * MUST use exact export name: userAuthController
 */
export interface UserAuthControllerExport {
  registerUser: (req: Request, res: Response) => Promise<Response>;
  verifyEmail: (req: Request, res: Response) => Promise<Response>;
  resendVerification: (req: Request, res: Response) => Promise<Response>;
  loginUser: (req: Request, res: Response) => Promise<Response>;
  logoutUser: (req: Request, res: Response) => Promise<Response>;
  refreshToken: (req: Request, res: Response) => Promise<Response>;
  requestPasswordReset: (req: Request, res: Response) => Promise<Response>;
  resetPassword: (req: Request, res: Response) => Promise<Response>;
}

// ============================================================================
// ROUTE REGISTRATION PATTERN (EXACT FROM routes/auth.routes.ts)
// ============================================================================

export const ROUTE_DEFINITIONS = [
  { method: 'POST', path: '/register', handler: 'registerUser' },
  { method: 'POST', path: '/verify-email', handler: 'verifyEmail' },
  { method: 'POST', path: '/resend-verification', handler: 'resendVerification' },
  { method: 'POST', path: '/login', handler: 'loginUser' },
  { method: 'POST', path: '/logout', handler: 'logoutUser' },
  { method: 'POST', path: '/refresh-token', handler: 'refreshToken' },
  { method: 'POST', path: '/request-password-reset', handler: 'requestPasswordReset' },
  { method: 'POST', path: '/reset-password', handler: 'resetPassword' }
] as const;

// ============================================================================
// MIDDLEWARE REQUIREMENTS (EXACT FROM user-auth.controller.ts)
// ============================================================================

export const MIDDLEWARE_REQUIREMENTS = {
  REGISTER: [],                    // No auth required
  VERIFY_EMAIL: [],               // No auth required
  RESEND_VERIFICATION: [],        // No auth required
  LOGIN: [],                      // No auth required
  LOGOUT: [],                     // No auth required (refreshToken in body)
  REFRESH_TOKEN: [],              // No auth required (refreshToken in body)
  REQUEST_PASSWORD_RESET: [],     // No auth required
  RESET_PASSWORD: []              // No auth required (token in body)
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - /auth/ (use /api/v1/auth/)
 * - /signup (use /register)
 * - /signin (use /login)
 * - /signout (use /logout)
 * - /verify (use /verify-email)
 * - /confirm (use /verify-email)
 * - /resend (use /resend-verification)
 * - /refresh (use /refresh-token)
 * - GET methods (ALL auth endpoints use POST)
 * - Different validation messages than specified
 * - Different HTTP status codes than specified
 * - Different error codes than specified
 */
