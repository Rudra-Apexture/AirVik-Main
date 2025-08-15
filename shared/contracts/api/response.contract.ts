// AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY
// This contract defines the EXACT API response format from response.utils.ts
// ALL future development MUST use these exact response structures

/**
 * CRITICAL RESPONSE FORMAT RULES:
 * - MUST use "success" boolean field (NOT status, ok, result)
 * - MUST use "data" field for success responses (NOT result, payload, body)
 * - MUST use "error" field for error responses (NOT message, msg, err)
 * - MUST use "code" field for error codes (NOT errorCode, type)
 * - MUST use "details" field for validation errors (NOT errors, validationErrors)
 * - MUST use "message" field for optional success messages (NOT msg, description)
 */

// ============================================================================
// BASE RESPONSE INTERFACES (EXACT FROM response.utils.ts)
// ============================================================================

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

// ============================================================================
// UNION TYPE FOR ALL RESPONSES (EXACT FROM response.utils.ts)
// ============================================================================

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// ============================================================================
// SUCCESS RESPONSE FUNCTION SIGNATURE (EXACT FROM response.utils.ts)
// ============================================================================

export interface SendSuccessContract {
  <T>(
    res: Response,
    data: T,
    message?: string,
    statusCode?: number
  ): Response;
}

// ============================================================================
// ERROR RESPONSE FUNCTION SIGNATURE (EXACT FROM response.utils.ts)
// ============================================================================

export interface SendErrorContract {
  (
    res: Response,
    error: string,
    code?: string,
    statusCode?: number,
    details?: any
  ): Response;
}

// ============================================================================
// DEFAULT STATUS CODES (EXACT FROM response.utils.ts)
// ============================================================================

export const DEFAULT_STATUS_CODES = {
  SUCCESS: 200,
  ERROR: 400
} as const;

// ============================================================================
// RESPONSE UTILITY EXPORT PATTERN (EXACT FROM response.utils.ts)
// ============================================================================

export interface ResponseUtilsExport {
  sendSuccess: SendSuccessContract;
  sendError: SendErrorContract;
}

// ============================================================================
// TYPED SUCCESS RESPONSES FOR AUTH ENDPOINTS
// ============================================================================

export interface AuthSuccessResponses {
  register: SuccessResponse<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      isEmailVerified: boolean;
      createdAt: string;
    };
    message: string;
  }>;
  
  verifyEmail: SuccessResponse<{
    message: string;
  }>;
  
  resendVerification: SuccessResponse<{
    message: string;
  }>;
  
  login: SuccessResponse<{
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
  }>;
  
  logout: SuccessResponse<{
    message: string;
  }>;
  
  refreshToken: SuccessResponse<{
    accessToken: string;
    refreshToken: string;
  }>;
}

// ============================================================================
// TYPED ERROR RESPONSES FOR AUTH ENDPOINTS
// ============================================================================

export interface AuthErrorResponses {
  validationError: ErrorResponse & {
    code: 'VALIDATION_ERROR';
    details: string[];
  };
  
  emailExists: ErrorResponse & {
    code: 'EMAIL_EXISTS';
    error: 'Email is already registered';
  };
  
  rateLimited: ErrorResponse & {
    code: 'RATE_LIMITED';
  };
  
  internalError: ErrorResponse & {
    code: 'INTERNAL_ERROR';
    error: 'Internal server error';
  };
  
  userNotFound: ErrorResponse & {
    code: 'USER_NOT_FOUND';
    error: 'User not found';
  };
  
  invalidToken: ErrorResponse & {
    code: 'INVALID_TOKEN';
    error: 'Invalid or expired token';
  };
  
  alreadyVerified: ErrorResponse & {
    code: 'ALREADY_VERIFIED';
    error: 'Email is already verified';
  };
  
  emailNotFound: ErrorResponse & {
    code: 'EMAIL_NOT_FOUND';
  };
  
  emailSendError: ErrorResponse & {
    code: 'EMAIL_SEND_ERROR';
  };
  
  invalidCredentials: ErrorResponse & {
    code: 'INVALID_CREDENTIALS';
  };
  
  emailNotVerified: ErrorResponse & {
    code: 'EMAIL_NOT_VERIFIED';
    error: 'Email not verified. Please verify your email first.';
  };
  
  accountLocked: ErrorResponse & {
    code: 'ACCOUNT_LOCKED';
  };
  
  serverError: ErrorResponse & {
    code: 'SERVER_ERROR';
  };
  
  invalidRefreshToken: ErrorResponse & {
    code: 'INVALID_REFRESH_TOKEN';
  };
}

// ============================================================================
// HTTP STATUS CODE MAPPING
// ============================================================================

export const HTTP_STATUS_MAPPING = {
  // Success responses
  REGISTER_SUCCESS: 201,
  VERIFY_EMAIL_SUCCESS: 200,
  RESEND_VERIFICATION_SUCCESS: 200,
  LOGIN_SUCCESS: 200,
  LOGOUT_SUCCESS: 200,
  REFRESH_TOKEN_SUCCESS: 200,
  
  // Error responses
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
  INVALID_REFRESH_TOKEN: 400
} as const;

// ============================================================================
// RESPONSE BUILDER UTILITIES
// ============================================================================

export interface ResponseBuilder {
  success<T>(data: T, message?: string, statusCode?: number): SuccessResponse<T>;
  error(error: string, code?: string, statusCode?: number, details?: any): ErrorResponse;
}

// ============================================================================
// TYPE GUARDS FOR RESPONSE VALIDATION
// ============================================================================

export const isSuccessResponse = <T>(response: ApiResponse<T>): response is SuccessResponse<T> => {
  return response.success === true;
};

export const isErrorResponse = (response: ApiResponse<any>): response is ErrorResponse => {
  return response.success === false;
};

// ============================================================================
// RESPONSE VALIDATION RULES
// ============================================================================

export const RESPONSE_VALIDATION = {
  REQUIRED_FIELDS: {
    SUCCESS: ['success', 'data'] as const,
    ERROR: ['success', 'error'] as const
  },
  OPTIONAL_FIELDS: {
    SUCCESS: ['message'] as const,
    ERROR: ['code', 'details'] as const
  },
  FIELD_TYPES: {
    success: 'boolean',
    data: 'any',
    message: 'string',
    error: 'string',
    code: 'string',
    details: 'any'
  } as const
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - { status: "success" } (use { success: true })
 * - { ok: true } (use { success: true })
 * - { result: data } (use { data: data })
 * - { payload: data } (use { data: data })
 * - { message: "error" } (use { error: "message" })
 * - { err: "message" } (use { error: "message" })
 * - { errorCode: "CODE" } (use { code: "CODE" })
 * - { type: "error" } (use { code: "ERROR_CODE" })
 * - { errors: [] } (use { details: [] })
 * - { validationErrors: [] } (use { details: [] })
 * - { msg: "message" } (use { message: "message" })
 * - { description: "text" } (use { message: "text" })
 * - Different HTTP status codes than specified
 * - Missing success boolean field
 * - Inconsistent field naming
 */
