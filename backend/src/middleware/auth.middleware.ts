import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { sendError } from '../utils/response.utils';
import User, { IUserDocument } from '../models/user.model';

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  userId: string;
  type: string;
  timestamp: number;
  iat: number;
  exp: number;
}

/**
 * Interface to extend Express Request with user information
 */
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
  };
}

/**
 * Extract and validate JWT token from request headers
 * @param req Express request object
 * @returns Token string if valid, null if not found or invalid format
 */
const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract token from "Bearer <token>"
  return authHeader.split(' ')[1];
};

/**
 * Decode and validate JWT token
 * @param token JWT token string
 * @returns Decoded payload if valid, null if invalid or expired
 */
export const extractUserFromToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const payload = jwt.verify(token, secret) as JwtPayload;
    
    // Verify this is an access token
    if (payload.type !== 'access') {
      return null;
    }
    
    return payload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
};

/**
 * Main middleware to verify access token and attach user to request
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const verifyAccessToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return sendError(
        res,
        'Authentication required',
        'AUTHENTICATION_REQUIRED',
        401
      );
    }
    
    // Verify and decode token
    const payload = extractUserFromToken(token);
    
    if (!payload) {
      return sendError(
        res,
        'Invalid or expired token',
        'INVALID_TOKEN',
        401
      );
    }
    
    // Find user by ID from token
    const user = await User.findById(payload.userId) as IUserDocument | null;
    
    if (!user) {
      return sendError(
        res,
        'User not found',
        'USER_NOT_FOUND',
        401
      );
    }
    
    // Check if user is active (email verified)
    if (!user.isActive) {
      return sendError(
        res,
        'Email not verified. Please verify your email first.',
        'EMAIL_NOT_VERIFIED',
        401
      );
    }
    
    // Extract name parts for firstName and lastName
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Attach user data to request object
    req.user = {
      id: user._id instanceof mongoose.Types.ObjectId ? user._id.toString() : String(user._id),
      email: user.email,
      firstName,
      lastName,
      isEmailVerified: user.isActive
    };
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Wrapper middleware for easy route protection
 * @returns Middleware function
 */
export const requireAuth = () => {
  return verifyAccessToken;
};

// Export middleware functions
export const authMiddleware = {
  verifyAccessToken,
  extractUserFromToken,
  requireAuth
};

export default authMiddleware;
