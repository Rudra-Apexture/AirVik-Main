// AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY
// This contract defines the EXACT service method signatures from user-auth.service.ts
// ALL future development MUST use these exact method names and signatures

/**
 * CRITICAL METHOD NAMING RULES:
 * - MUST use "registerUser" (NOT register, createUser, signUp)
 * - MUST use "verifyEmail" (NOT verify, verifyUserEmail, confirmEmail)
 * - MUST use "resendVerificationEmail" (NOT resendVerification, resendEmail)
 * - MUST use "loginUser" (NOT login, signIn, authenticate)
 * - MUST use "logoutUser" (NOT logout, signOut)
 * - MUST use "refreshUserToken" (NOT refreshToken, renewToken)
 */

// ============================================================================
// SERVICE REQUEST INTERFACES (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

// ============================================================================
// TOKEN INTERFACES (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface TokenPayload {
  userId: string;
  type: string;
  timestamp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ============================================================================
// SERVICE RESPONSE INTERFACE (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

// ============================================================================
// SPECIFIC RESPONSE DATA INTERFACES (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface RegisterResponse {
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

export interface LoginResponse {
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

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ============================================================================
// AUTH SERVICE METHOD SIGNATURES (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface AuthServiceContract {
  // MUST use exact method name: registerUser
  registerUser(userData: RegisterUserData): Promise<ServiceResponse<RegisterResponse>>;
  
  // MUST use exact method name: verifyEmail
  verifyEmail(token: string): Promise<ServiceResponse>;
  
  // MUST use exact method name: resendVerificationEmail
  resendVerificationEmail(email: string): Promise<ServiceResponse>;
  
  // MUST use exact method name: loginUser
  loginUser(userData: LoginUserData): Promise<ServiceResponse<LoginResponse>>;
  
  // MUST use exact method name: logoutUser
  logoutUser(refreshToken: string): Promise<ServiceResponse>;
  
  // MUST use exact method name: refreshUserToken
  refreshUserToken(refreshToken: string): Promise<ServiceResponse<RefreshTokenResponse>>;
  
  // MUST use exact method name: requestPasswordReset
  requestPasswordReset(email: string): Promise<ServiceResponse>;
  
  // MUST use exact method name: resetPassword
  resetPassword(token: string, newPassword: string): Promise<ServiceResponse>;
}

// ============================================================================
// TOKEN GENERATION FUNCTIONS (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface TokenGenerationContract {
  generateVerificationToken(userId: string): string;
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  verifyToken(token: string): TokenPayload | null;
}

// ============================================================================
// EMAIL SERVICE FUNCTIONS (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface EmailServiceContract {
  createEmailTransporter(): any; // nodemailer.Transporter
  sendVerificationEmail(email: string, firstName: string, token: string): Promise<ServiceResponse>;
}

// ============================================================================
// TOKEN EXPIRY SETTINGS (EXACT FROM user-auth.service.ts)
// ============================================================================

export const TOKEN_EXPIRY = {
  VERIFICATION: '24h',
  ACCESS: '15m',
  REFRESH: '7d'
} as const;

// ============================================================================
// JWT PAYLOAD TYPES (EXACT FROM user-auth.service.ts)
// ============================================================================

export const JWT_TYPES = {
  EMAIL_VERIFICATION: 'email_verification',
  ACCESS: 'access',
  REFRESH: 'refresh'
} as const;

export type JwtType = typeof JWT_TYPES[keyof typeof JWT_TYPES];

// ============================================================================
// ERROR CODES (EXACT FROM user-auth.service.ts)
// ============================================================================

export const AUTH_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  SERVER_ERROR: 'SERVER_ERROR',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN'
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];

// ============================================================================
// SERVICE EXPORT PATTERN (EXACT FROM user-auth.service.ts)
// ============================================================================

/**
 * CRITICAL: Service must be exported as named object with all methods
 * MUST use exact export name: userAuthService
 */
export interface UserAuthServiceExport {
  registerUser: (userData: RegisterUserData) => Promise<ServiceResponse<RegisterResponse>>;
  verifyEmail: (token: string) => Promise<ServiceResponse>;
  resendVerificationEmail: (email: string) => Promise<ServiceResponse>;
  loginUser: (userData: LoginUserData) => Promise<ServiceResponse<LoginResponse>>;
  logoutUser: (refreshToken: string) => Promise<ServiceResponse>;
  refreshUserToken: (refreshToken: string) => Promise<ServiceResponse<RefreshTokenResponse>>;
}

// ============================================================================
// EMAIL TEMPLATE STRUCTURE (EXACT FROM user-auth.service.ts)
// ============================================================================

export interface EmailTemplateConfig {
  subject: string;
  htmlContent: string;
  from: string;
  to: string;
}

export const EMAIL_TEMPLATE_STRUCTURE = {
  VERIFICATION: {
    subject: 'Verify Your Email Address',
    fromName: 'Airvik Hotel',
    fromEmail: 'noreply@airvik.com',
    verificationUrlParam: 'token',
    expiryHours: 24
  }
} as const;

// ============================================================================
// ENVIRONMENT VARIABLES (EXACT FROM user-auth.service.ts)
// ============================================================================

export const REQUIRED_ENV_VARS = {
  JWT_SECRET: 'JWT_SECRET',
  FRONTEND_URL: 'FRONTEND_URL',
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_SECURE: 'SMTP_SECURE',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASS: 'SMTP_PASS',
  SMTP_FROM: 'SMTP_FROM'
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - register() (use registerUser)
 * - verify() (use verifyEmail) 
 * - resendVerification() (use resendVerificationEmail)
 * - login() (use loginUser)
 * - logout() (use logoutUser)
 * - refreshToken() (use refreshUserToken)
 * - signUp, signIn, signOut (use register/login/logout variants)
 * - authenticate() (use loginUser)
 * - createUser() (use registerUser)
 * - confirmEmail() (use verifyEmail)
 */
