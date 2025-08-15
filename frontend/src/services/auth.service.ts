// User Authentication API Service
// Frontend service for authentication API calls
// Must follow API-CONTRACT.md exactly

import {
  RegisterUserRequest,
  RegisterUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetSuccessData,
  ResetPasswordRequest,
  ResetPasswordSuccessData,
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
  resendVerification: '/api/v1/auth/resend-verification',
  login: '/api/v1/auth/login',
  logout: '/api/v1/auth/logout',
  refreshToken: '/api/v1/auth/refresh-token',
  requestPasswordReset: '/api/v1/auth/request-password-reset',
  resetPassword: '/api/v1/auth/reset-password'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a fetch request with proper configuration
 * Handles authentication, token refresh, and request timeouts
 */
async function createApiRequest(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    ...(options.headers as Record<string, string> || {})
  };
  
  // If no access token is provided, try to get it from storage
  if (!accessToken && !endpoint.includes('/login') && !endpoint.includes('/refresh-token')) {
    const tokens = getStoredTokens();
    if (tokens.accessToken) {
      accessToken = tokens.accessToken;
    }
  }
  
  // Add authorization header if access token is available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers
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
    
    // Handle 401 errors for token refresh
    if (response.status === 401 && !endpoint.includes('/refresh-token') && !endpoint.includes('/logout')) {
      
      const refreshResult = await handleTokenRefresh();
      
      if (refreshResult.success && refreshResult.data && refreshResult.data.accessToken) {
        
        // Retry the original request with new token
        return createApiRequest(
          endpoint,
          options,
          refreshResult.data.accessToken
        );
      } else {
        console.warn('Token refresh failed, redirecting to login');
        
        // If we're in a browser context, redirect to login
        if (typeof window !== 'undefined') {
          // Small delay to allow for any pending operations
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 100);
        }
      }
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Log network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error during API request:', error);
    } else if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout after', API_CONFIG.timeout, 'ms');
    } else {
      console.error('API request error:', error);
    }
    
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
    
    // Add HTTP status code to error responses
    if (!data.success) {
      return {
        ...data,
        status: response.status
      } as ApiErrorResponse;
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Invalid response format from server',
        code: 'INVALID_RESPONSE',
        status: response.status
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
      code: 'NETWORK_ERROR',
      status: 0 // Standard status code for network errors
    };
  }
  
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      success: false,
      error: 'Request timeout. Please try again.',
      code: 'TIMEOUT_ERROR',
      status: 408 // Request Timeout
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    status: 500 // Internal Server Error as fallback
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
// TOKEN MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Storage keys for tokens
 */
const TOKEN_STORAGE = {
  accessToken: 'airvik_access_token',
  refreshToken: 'airvik_refresh_token'
} as const;

/**
 * Store authentication tokens securely
 * 
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 */
export function setStoredTokens(accessToken: string, refreshToken: string): void {
  try {
    // Store access token in memory (session storage)
    // This is more secure as it's cleared when browser is closed
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(TOKEN_STORAGE.accessToken, accessToken);
    }
    
    // Store refresh token in localStorage for persistence
    // In a production app, consider using httpOnly cookies instead
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE.refreshToken, refreshToken);
    }
  } catch (error) {
    console.error('Error storing authentication tokens:', error);
  }
}

/**
 * Retrieve stored authentication tokens
 * 
 * @returns Object containing accessToken and refreshToken if available
 */
export function getStoredTokens(): { accessToken?: string; refreshToken?: string } {
  try {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    
    // Get access token from session storage
    if (typeof sessionStorage !== 'undefined') {
      accessToken = sessionStorage.getItem(TOKEN_STORAGE.accessToken);
    }
    
    // Get refresh token from local storage
    if (typeof localStorage !== 'undefined') {
      refreshToken = localStorage.getItem(TOKEN_STORAGE.refreshToken);
    }
    
    return {
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined
    };
  } catch (error) {
    console.error('Error retrieving authentication tokens:', error);
    return {};
  }
}

/**
 * Clear all stored authentication tokens
 */
export function clearStoredTokens(): void {
  try {
    // Clear access token from session storage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(TOKEN_STORAGE.accessToken);
    }
    
    // Clear refresh token from local storage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE.refreshToken);
    }
  } catch (error) {
    console.error('Error clearing authentication tokens:', error);
  }
}

/**
 * Handle token refresh when access token expires
 * 
 * @returns Promise<RefreshTokenResponse> - New tokens or error
 */
async function handleTokenRefresh(): Promise<RefreshTokenResponse> {
  try {
    const { refreshToken: storedRefreshToken } = getStoredTokens();
    
    if (!storedRefreshToken) {
      console.warn('Token refresh attempted but no refresh token available');
      clearStoredTokens(); // Clear any remaining tokens
      return {
        success: false,
        error: 'No refresh token available. Please login again.',
        code: 'INVALID_REFRESH_TOKEN'
      };
    }
    
    // Make direct API call to refresh token endpoint to avoid circular dependency
    const response = await fetch(`${API_CONFIG.baseUrl}${AUTH_ENDPOINTS.refreshToken}`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ refreshToken: storedRefreshToken })
    });
    
    if (!response.ok) {
      // Handle non-200 responses
      const errorData = await response.json().catch(() => ({}));
      console.warn('Token refresh failed:', response.status, errorData);
      clearStoredTokens();
      
      return {
        success: false,
        error: errorData.error || 'Failed to refresh authentication token',
        code: errorData.code || 'REFRESH_TOKEN_FAILED'
      };
    }
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.accessToken && result.data.refreshToken) {
      // Store new tokens
      setStoredTokens(result.data.accessToken, result.data.refreshToken);
      return result as RefreshTokenResponse;
    } else {
      // Invalid response format
      console.error('Invalid token refresh response format:', result);
      clearStoredTokens();
      return {
        success: false,
        error: 'Invalid response from authentication server',
        code: 'INVALID_RESPONSE_FORMAT'
      };
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    clearStoredTokens();
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh authentication',
      code: 'REFRESH_TOKEN_ERROR'
    };
  }
}

// ============================================================================
// LOGIN/LOGOUT API FUNCTIONS
// ============================================================================

/**
 * Login user with email and password
 * 
 * @param data - Login request data with email and password
 * @returns Promise<LoginResponse> - API response with user data and tokens or error
 * 
 * @example
 * ```typescript
 * const result = await loginUser({
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * });
 * 
 * if (result.success) {
 *   console.log('Login successful:', result.data.user);
 *   // Tokens are automatically stored
 * } else {
 *   console.error('Login failed:', result.error);
 * }
 * ```
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  try {
    // Debug: Log the login request data received by the service
    
    // Validate required fields
    validateRequestData(data, ['email', 'password']);
    
    // Debug: Log after validation
    
    // Make API request
    const requestBody = JSON.stringify(data);
    
    const response = await createApiRequest(AUTH_ENDPOINTS.login, {
      method: 'POST',
      body: requestBody
    });
    
    // Debug: Log raw response
    
    // Handle response
    const result = await handleApiResponse<{
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
    }>(response);
    
    // Debug: Log processed response
    
    // Store tokens if login successful
    if (result.success) {
      setStoredTokens(result.data.accessToken, result.data.refreshToken);
    }
    
    return result as LoginResponse;
    
  } catch (error) {
    console.error('Login API error:', error);
    // Debug: Log more detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return createNetworkErrorResponse(error);
  }
}

/**
 * Logout user and invalidate refresh token
 * 
 * @param data - Logout request data with refreshToken
 * @returns Promise<LogoutResponse> - API response with success/error message
 * 
 * @example
 * ```typescript
 * const { refreshToken } = getStoredTokens();
 * 
 * if (refreshToken) {
 *   const result = await logoutUser({ refreshToken });
 *   
 *   if (result.success) {
 *     console.log('Logout successful');
 *     // Tokens are automatically cleared
 *   } else {
 *     console.error('Logout failed:', result.error);
 *   }
 * }
 * ```
 */
export async function logoutUser(data: LogoutRequest): Promise<LogoutResponse> {
  try {
    // Validate required fields
    validateRequestData(data, ['refreshToken']);
    
    // Get access token for authorization header
    const { accessToken } = getStoredTokens();
    
    // Make API request
    const response = await createApiRequest(
      AUTH_ENDPOINTS.logout,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      accessToken
    );
    
    // Handle response
    const result = await handleApiResponse<Record<string, never>>(response);
    
    // Clear tokens regardless of logout result
    // This ensures user is logged out on frontend even if backend fails
    clearStoredTokens();
    
    return result as LogoutResponse;
    
  } catch (error) {
    console.error('Logout API error:', error);
    // Clear tokens even on error
    clearStoredTokens();
    return createNetworkErrorResponse(error);
  }
}

/**
 * Refresh access token using refresh token
 * 
 * @param data - Refresh token request data
 * @returns Promise<RefreshTokenResponse> - API response with new tokens or error
 * 
 * @example
 * ```typescript
 * const { refreshToken } = getStoredTokens();
 * 
 * if (refreshToken) {
 *   const result = await refreshToken({ refreshToken });
 *   
 *   if (result.success) {
 *     console.log('Token refresh successful');
 *     // New tokens are automatically stored
 *   } else {
 *     console.error('Token refresh failed:', result.error);
 *   }
 * }
 * ```
 */
export async function refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  try {
    // Validate required fields
    validateRequestData(data, ['refreshToken']);
    
    // Make API request
    const response = await createApiRequest(AUTH_ENDPOINTS.refreshToken, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Handle response
    const result = await handleApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>(response);
    
    // Store new tokens if refresh successful
    if (result.success) {
      setStoredTokens(result.data.accessToken, result.data.refreshToken);
    }
    
    return result as RefreshTokenResponse;
    
  } catch (error) {
    console.error('Token refresh API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Request a password reset email
 * 
 * @param email - User email address
 * @returns Promise<ApiResponse<RequestPasswordResetSuccessData>> - API response with success or error
 * 
 * @example
 * ```typescript
 * const result = await requestPasswordReset('user@example.com');
 * 
 * if (result.success) {
 *   console.log('Password reset email sent');
 * } else {
 *   console.error('Password reset request failed:', result.error);
 * }
 * ```
 */
export async function requestPasswordReset(email: string): Promise<ApiResponse<RequestPasswordResetSuccessData>> {
  try {
    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return {
        success: false,
        error: 'Valid email address is required',
        code: 'VALIDATION_ERROR'
      };
    }
    
    // Make API request
    const response = await createApiRequest(AUTH_ENDPOINTS.requestPasswordReset, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    // Handle response
    return await handleApiResponse<RequestPasswordResetSuccessData>(response);
    
  } catch (error) {
    console.error('Password reset request API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Reset password with token
 * 
 * @param data - Reset password request data with token and new password
 * @returns Promise<ApiResponse<ResetPasswordSuccessData>> - API response with success or error
 * 
 * @example
 * ```typescript
 * const result = await resetPassword({
 *   token: 'reset-token-from-email',
 *   newPassword: 'NewSecurePassword123!',
 *   confirmPassword: 'NewSecurePassword123!'
 * });
 * 
 * if (result.success) {
 *   console.log('Password reset successful');
 * } else {
 *   console.error('Password reset failed:', result.error);
 * }
 * ```
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordSuccessData>> {
  try {
    // Validate required fields
    validateRequestData(data, ['token', 'newPassword', 'confirmPassword']);
    
    // Validate password match
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH',
        status: 400
      };
    }
    
    // Make API request
    // Include all required fields: token, newPassword, and confirmPassword
    const { token, newPassword, confirmPassword } = data;
    
    const response = await createApiRequest(AUTH_ENDPOINTS.resetPassword, {
      method: 'POST',
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
    
    // Log response status for debugging
    
    // Handle specific HTTP status codes
    if (response.status === 404) {
      return {
        success: false,
        error: 'The password reset token was not found. Please request a new password reset link.',
        code: 'TOKEN_NOT_FOUND',
        status: 404
      };
    }
    
    if (response.status === 400) {
      // Try to parse the response to get more specific error
      try {
        const errorData = await response.clone().json();
        
        if (errorData && !errorData.success) {
          // Extract the error code if available
          const errorCode = errorData.code || '';
          const errorMessage = errorData.error || 'Invalid request';
          
          // Check for common error patterns
          if (errorMessage.toLowerCase().includes('expired')) {
            return {
              success: false,
              error: 'The password reset link has expired. Please request a new one.',
              code: 'TOKEN_EXPIRED',
              status: 400
            };
          } else if (errorMessage.toLowerCase().includes('invalid') && errorMessage.toLowerCase().includes('token')) {
            return {
              success: false,
              error: 'The password reset link is invalid. Please request a new one.',
              code: 'INVALID_TOKEN',
              status: 400
            };
          } else if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('match')) {
            return {
              success: false,
              error: 'Passwords do not match. Please try again.',
              code: 'PASSWORD_MISMATCH',
              status: 400
            };
          } else if (errorMessage.toLowerCase().includes('weak') || errorMessage.toLowerCase().includes('strength')) {
            return {
              success: false,
              error: 'Password is too weak. It must contain at least 8 characters, including uppercase, lowercase, and numbers.',
              code: 'PASSWORD_WEAK',
              status: 400
            };
          }
          
          // Return the original error with status code
          return {
            success: false,
            error: errorMessage,
            code: errorCode || 'VALIDATION_ERROR',
            status: 400
          };
        }
      } catch (e) {
        console.error('Error parsing 400 response:', e);
        // Ignore parsing errors and continue with normal flow
      }
    }
    
    // Handle response
    return await handleApiResponse<ResetPasswordSuccessData>(response);
    
  } catch (error) {
    console.error('Password reset API error:', error);
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
  
  /**
   * Login user with email and password
   */
  public async loginUser(data: LoginRequest): Promise<LoginResponse> {
    return loginUser(data);
  }
  
  /**
   * Logout user and invalidate refresh token
   */
  public async logoutUser(data: LogoutRequest): Promise<LogoutResponse> {
    return logoutUser(data);
  }
  
  /**
   * Refresh access token using refresh token
   */
  public async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return refreshToken(data);
  }

  /**
   * Request a password reset email
   */
  public async requestPasswordReset(email: string): Promise<ApiResponse<RequestPasswordResetSuccessData>> {
    return requestPasswordReset(email);
  }

  /**
   * Reset password with token
   */
  public async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordSuccessData>> {
    return resetPassword(data);
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
  resendVerification,
  loginUser,
  logoutUser,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens
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
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password. Please try again.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Email not verified. Please verify your email first.';
    case 'INVALID_REFRESH_TOKEN':
      return 'Your session has expired. Please log in again.';
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
  // Base URL, timeout and endpoints logging removed
  console.groupEnd();
}
