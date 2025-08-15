// AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY
// This contract defines the EXACT middleware patterns from auth.middleware.ts
// ALL future development MUST use these exact middleware signatures and patterns

/**
 * CRITICAL MIDDLEWARE NAMING RULES:
 * - MUST use "verifyAccessToken" (NOT verifyToken, authenticate, checkAuth)
 * - MUST use "extractUserFromToken" (NOT decodeToken, parseToken)
 * - MUST use "requireAuth" (NOT protect, secured, authenticated)
 * - MUST use "req.user" to attach user data (NOT req.currentUser, req.authenticatedUser)
 * - MUST use "Authorization" header with "Bearer " prefix
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// ============================================================================
// JWT PAYLOAD INTERFACE (EXACT FROM auth.middleware.ts)
// ============================================================================

export interface JwtPayload {
  userId: string;
  type: string;
  timestamp: number;
  iat: number;
  exp: number;
}

// ============================================================================
// AUTHENTICATED REQUEST INTERFACE (EXACT FROM auth.middleware.ts)
// ============================================================================

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
  };
}

// ============================================================================
// MIDDLEWARE FUNCTION SIGNATURES (EXACT FROM auth.middleware.ts)
// ============================================================================

export interface AuthMiddlewareContract {
  // MUST use exact function name: verifyAccessToken
  verifyAccessToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void>;
  
  // MUST use exact function name: extractUserFromToken
  extractUserFromToken(token: string): JwtPayload | null;
  
  // MUST use exact function name: requireAuth
  requireAuth(): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
}

// ============================================================================
// TOKEN EXTRACTION PATTERN (EXACT FROM auth.middleware.ts)
// ============================================================================

export interface TokenExtractionContract {
  // MUST extract from "Authorization" header with "Bearer " prefix
  extractTokenFromHeader(req: Request): string | null;
}

// ============================================================================
// USER ATTACHMENT PATTERN (EXACT FROM auth.middleware.ts)
// ============================================================================

/**
 * CRITICAL: User data attached to req.user must have exact structure
 * User model stores "name" as "firstName lastName"
 * Middleware splits into firstName/lastName for req.user
 */
export interface RequestUserData {
  id: string;                    // MUST be string (converted from _id)
  email?: string;               // MUST be optional
  firstName?: string;           // MUST extract from name.split(' ')[0]
  lastName?: string;            // MUST extract from name.split(' ').slice(1).join(' ')
  isEmailVerified?: boolean;    // MUST use isEmailVerified (from model.isActive)
}

// ============================================================================
// JWT TOKEN VALIDATION RULES (EXACT FROM auth.middleware.ts)
// ============================================================================

export const JWT_VALIDATION_RULES = {
  REQUIRED_TYPE: 'access',               // MUST verify token type is 'access'
  HEADER_PREFIX: 'Bearer ',              // MUST use exact prefix with space
  HEADER_NAME: 'Authorization',          // MUST use exact header name
  USER_ACTIVE_CHECK: true,               // MUST verify user.isActive is true
  USER_EXISTS_CHECK: true                // MUST verify user exists in database
} as const;

// ============================================================================
// ERROR RESPONSES (EXACT FROM auth.middleware.ts)
// ============================================================================

export const AUTH_MIDDLEWARE_ERRORS = {
  AUTHENTICATION_REQUIRED: {
    error: 'Authentication required',
    code: 'AUTHENTICATION_REQUIRED',
    status: 401
  },
  INVALID_TOKEN: {
    error: 'Invalid or expired token',
    code: 'INVALID_TOKEN',
    status: 401
  },
  USER_NOT_FOUND: {
    error: 'User not found',
    code: 'USER_NOT_FOUND',
    status: 401
  },
  EMAIL_NOT_VERIFIED: {
    error: 'Email not verified. Please verify your email first.',
    code: 'EMAIL_NOT_VERIFIED',
    status: 401
  },
  INTERNAL_ERROR: {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    status: 500
  }
} as const;

// ============================================================================
// MIDDLEWARE EXPORT PATTERN (EXACT FROM auth.middleware.ts)
// ============================================================================

/**
 * CRITICAL: Middleware must be exported in exact pattern
 * Individual exports AND named object export
 */
export interface AuthMiddlewareExport {
  verifyAccessToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
  extractUserFromToken: (token: string) => JwtPayload | null;
  requireAuth: () => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
}

// Default export pattern
export interface AuthMiddlewareDefault {
  verifyAccessToken: AuthMiddlewareContract['verifyAccessToken'];
  extractUserFromToken: AuthMiddlewareContract['extractUserFromToken'];
  requireAuth: AuthMiddlewareContract['requireAuth'];
}

// ============================================================================
// TOKEN DECODING LOGIC (EXACT FROM auth.middleware.ts)
// ============================================================================

export interface TokenDecodingContract {
  // MUST use exact JWT verification pattern
  verifyJwt(token: string, secret: string): JwtPayload;
  
  // MUST validate token type
  validateTokenType(payload: JwtPayload, expectedType: string): boolean;
  
  // MUST handle verification errors
  handleJwtError(error: any): null;
}

// ============================================================================
// USER LOOKUP PATTERN (EXACT FROM auth.middleware.ts)
// ============================================================================

export interface UserLookupContract {
  // MUST find user by ID from token payload
  findUserById(userId: string): Promise<any>;
  
  // MUST verify user is active (email verified)
  validateUserActive(user: any): boolean;
  
  // MUST extract name parts for firstName/lastName
  extractNameParts(fullName: string): { firstName: string; lastName: string };
  
  // MUST convert MongoDB _id to string
  convertIdToString(id: mongoose.Types.ObjectId | string): string;
}

// ============================================================================
// MIDDLEWARE USAGE PATTERNS
// ============================================================================

/**
 * ROUTE PROTECTION PATTERNS:
 * 
 * 1. Individual middleware:
 *    router.get('/protected', verifyAccessToken, handler);
 * 
 * 2. Wrapper function:
 *    router.get('/protected', requireAuth(), handler);
 * 
 * 3. Multiple routes:
 *    router.use(verifyAccessToken); // Protect all routes below
 */
export const MIDDLEWARE_USAGE_PATTERNS = {
  INDIVIDUAL: 'verifyAccessToken',
  WRAPPER: 'requireAuth()',
  GLOBAL: 'router.use(verifyAccessToken)'
} as const;

// ============================================================================
// ENVIRONMENT DEPENDENCIES (EXACT FROM auth.middleware.ts)
// ============================================================================

export const MIDDLEWARE_ENV_DEPS = {
  JWT_SECRET: 'JWT_SECRET'  // MUST use exact env var name
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - verifyToken() (use verifyAccessToken)
 * - authenticate() (use verifyAccessToken)
 * - checkAuth() (use verifyAccessToken)
 * - protect() (use requireAuth)
 * - secured() (use requireAuth)
 * - authenticated() (use requireAuth)
 * - req.currentUser (use req.user)
 * - req.authenticatedUser (use req.user)
 * - req.authUser (use req.user)
 * - "Auth" header (use "Authorization")
 * - "Token " prefix (use "Bearer ")
 * - Different error messages than specified
 * - Different error codes than specified
 * - Different HTTP status codes than specified
 * - Not checking user.isActive for email verification
 * - Not splitting name into firstName/lastName
 * - Not converting _id to string
 * - Different JWT payload structure
 * - Not validating token type is 'access'
 */
