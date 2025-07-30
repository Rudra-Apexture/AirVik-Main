// User Registration & Email Verification API Service
// Frontend service for authentication API calls
// Must follow API-CONTRACT.md exactly

import {
  RegisterUserRequest,
  RegisterUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse
} from '@/src/types/auth.types';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * API configuration from environment variables
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

/**
 * API endpoints for authentication
 */
const AUTH_ENDPOINTS = {
  register: '/api/v1/auth/register',
  verifyEmail: '/api/v1/auth/verify-email',
  resendVerification: '/api/v1/auth/resend-verification'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a fetch request with proper configuration
 */
async function createApiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers
    }
  };

  // Add timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Handles API response and converts to typed response
 */
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();
    
    // Validate response structure matches API contract
    if (typeof data.success !== 'boolean') {
      throw new Error('Invalid API response format: missing success field');
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Invalid response format from server',
        code: 'INVALID_RESPONSE'
      } as ApiErrorResponse;
    }
    
    throw error;
  }
}

/**
 * Creates a standardized error response for network/timeout errors
 */
function createNetworkErrorResponse(error: unknown): ApiErrorResponse {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      success: false,
      error: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR'
    };
  }
  
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      success: false,
      error: 'Request timeout. Please try again.',
      code: 'TIMEOUT_ERROR'
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR'
  };
}

/**
 * Validates request data before sending to API
 */
function validateRequestData(data: unknown, requiredFields: string[]): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Request data must be an object');
  }
  
  const dataObj = data as Record<string, unknown>;
  
  for (const field of requiredFields) {
    if (!dataObj[field] || typeof dataObj[field] !== 'string') {
      throw new Error(`Missing or invalid required field: ${field}`);
    }
  }
}

// ============================================================================
// API SERVICE FUNCTIONS
// ============================================================================

/**
 * Registers a new user account and sends verification email
 * 
 * @param data - User registration data
 * @returns Promise<RegisterUserResponse> - API response with user data or error
 * 
 * @example
 * ```typescript
 * const result = await registerUser({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   confirmPassword: 'SecurePass123'
 * });
 * 
 * if (result.success) {
 *   console.log('User registered:', result.data.user);
 * } else {
 *   console.error('Registration failed:', result.error);
 * }
 * ```
 */
export async function registerUser(
  data: RegisterUserRequest
): Promise<RegisterUserResponse> {
  try {
    // Validate required fields
    validateRequestData(data, [
      'firstName',
      'lastName', 
      'email',
      'password',
      'confirmPassword'
    ]);
    
    // Make API request
    const response = await createApiRequest(AUTH_ENDPOINTS.register, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Registration API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Verifies user email using verification token
 * 
 * @param data - Email verification data containing token
 * @returns Promise<VerifyEmailResponse> - API response with success/error message
 * 
 * @example
 * ```typescript
 * const result = await verifyEmail({
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * });
 * 
 * if (result.success) {
 *   console.log('Email verified:', result.data.message);
 * } else {
 *   console.error('Verification failed:', result.error);
 * }
 * ```
 */
export async function verifyEmail(
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> {
  try {
    // Validate required fields
    validateRequestData(data, ['token']);
    
    // Make API request
    const response = await createApiRequest(AUTH_ENDPOINTS.verifyEmail, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Email verification API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Resends verification email to user
 * 
 * @param data - Resend verification data containing email
 * @returns Promise<ResendVerificationResponse> - API response with success/error message
 * 
 * @example
 * ```typescript
 * const result = await resendVerification({
 *   email: 'john@example.com'
 * });
 * 
 * if (result.success) {
 *   console.log('Verification email sent:', result.data.message);
 * } else {
 *   console.error('Resend failed:', result.error);
 * }
 * ```
 */
export async function resendVerification(
  data: ResendVerificationRequest
): Promise<ResendVerificationResponse> {
  try {
    // Validate required fields
    validateRequestData(data, ['email']);
    
    // Make API request
    const response = await createApiRequest(AUTH_ENDPOINTS.resendVerification, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Resend verification API error:', error);
    return createNetworkErrorResponse(error);
  }
}

// ============================================================================
// AUTH SERVICE CLASS (OPTIONAL ALTERNATIVE INTERFACE)
// ============================================================================

/**
 * Authentication service class providing organized API methods
 * Alternative to individual function exports for better organization
 */
export class AuthService {
  private static instance: AuthService;
  
  /**
   * Singleton pattern for service instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}
  
  /**
   * Register a new user
   */
  public async registerUser(data: RegisterUserRequest): Promise<RegisterUserResponse> {
    return registerUser(data);
  }
  
  /**
   * Verify user email
   */
  public async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return verifyEmail(data);
  }
  
  /**
   * Resend verification email
   */
  public async resendVerification(data: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    return resendVerification(data);
  }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * Default auth service instance
 */
export const authService = AuthService.getInstance();

/**
 * Named exports for all auth functions
 */
export const authApi = {
  registerUser,
  verifyEmail,
  resendVerification
} as const;

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

/**
 * Type guard to check if API response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if API response is an error
 */
export function isErrorResponse(
  response: ApiResponse<any>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Extracts error message from API response for display
 */
export function getErrorMessage(response: ApiErrorResponse): string {
  // Return user-friendly error messages based on error codes
  switch (response.code) {
    case 'VALIDATION_ERROR':
      return response.details?.join(', ') || response.error;
    case 'EMAIL_EXISTS':
      return 'An account with this email already exists. Please use a different email or try logging in.';
    case 'RATE_LIMITED':
      return 'Too many attempts. Please wait a few minutes before trying again.';
    case 'INVALID_TOKEN':
      return 'The verification link is invalid or has expired. Please request a new verification email.';
    case 'ALREADY_VERIFIED':
      return 'Your email is already verified. You can proceed to login.';
    case 'EMAIL_NOT_FOUND':
      return 'No account found with this email address.';
    case 'USER_NOT_FOUND':
      return 'User account not found.';
    case 'NETWORK_ERROR':
      return 'Network connection failed. Please check your internet connection and try again.';
    case 'TIMEOUT_ERROR':
      return 'Request timed out. Please try again.';
    case 'INTERNAL_ERROR':
      return 'A server error occurred. Please try again later.';
    default:
      return response.error || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Extracts success message from API response for display
 */
export function getSuccessMessage<T>(response: ApiSuccessResponse<T>): string {
  if (response.message) {
    return response.message;
  }
  
  // Fallback messages based on data structure
  if (typeof response.data === 'object' && response.data !== null) {
    const data = response.data as any;
    if (data.message) {
      return data.message;
    }
  }
  
  return 'Operation completed successfully.';
}

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Development helper to test API connectivity
 * Only available in development mode
 */
export async function testApiConnection(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testApiConnection is only available in development mode');
    return false;
  }
  
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Development helper to log API configuration
 * Only available in development mode
 */
export function logApiConfig(): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('logApiConfig is only available in development mode');
    return;
  }
  
  console.group('Auth API Configuration');
  console.log('Base URL:', API_CONFIG.baseUrl);
  console.log('Timeout:', API_CONFIG.timeout);
  console.log('Endpoints:', AUTH_ENDPOINTS);
  console.groupEnd();
}
