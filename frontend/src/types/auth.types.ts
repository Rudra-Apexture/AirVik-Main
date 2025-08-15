// User Registration & Email Verification TypeScript Types
// This file contains all type definitions for authentication functionality
// Must match API-CONTRACT.md exactly

// ============================================================================
// USER INTERFACE TYPES
// ============================================================================

/**
 * User interface matching backend User model (excluding sensitive fields)
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

/**
 * Complete user data from backend (includes sensitive fields for internal use)
 */
export interface UserDocument {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  tokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

/**
 * Registration form data interface
 */
export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

/**
 * Email verification form data interface
 */
export interface EmailVerificationFormData {
  token: string;
}

/**
 * Resend verification email form data interface
 */
export interface ResendVerificationFormData {
  email: string;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * User registration request payload
 */
export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Email verification request payload
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Resend verification email request payload
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Request password reset request payload
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Reset password request payload
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Base API response structure
 */
export interface BaseApiResponse {
  success: boolean;
}

/**
 * Success API response structure
 */
export interface ApiSuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error API response structure
 */
export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  code?: string;
  details?: string[];
  status?: number; // HTTP status code from the response
}

/**
 * Union type for all possible API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// SPECIFIC API RESPONSE DATA TYPES
// ============================================================================

/**
 * Registration success response data
 */
export interface RegistrationResponseData {
  user: User;
  message: string;
}

/**
 * Email verification success response data
 */
export interface EmailVerificationResponseData {
  message: string;
}

/**
 * Resend verification success response data
 */
export interface ResendVerificationResponseData {
  message: string;
}

/**
 * Request password reset success response data
 */
export interface RequestPasswordResetSuccessData {
  message: string;
}

/**
 * Reset password success response data
 */
export interface ResetPasswordSuccessData {
  message: string;
}

// ============================================================================
// COMPLETE API RESPONSE TYPES
// ============================================================================

/**
 * User registration API response
 */
export type RegisterUserResponse = ApiResponse<RegistrationResponseData>;

/**
 * Email verification API response
 */
export type VerifyEmailResponse = ApiResponse<EmailVerificationResponseData>;

/**
 * Resend verification email API response
 */
export type ResendVerificationResponse = ApiResponse<ResendVerificationResponseData>;

/**
 * Request password reset API response
 */
export type RequestPasswordResetResponse = ApiResponse<RequestPasswordResetSuccessData>;

/**
 * Reset password API response
 */
export type ResetPasswordResponse = ApiResponse<ResetPasswordSuccessData>;

// ============================================================================
// ERROR CODE TYPES
// ============================================================================

/**
 * All possible error codes from the API
 */
export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'EMAIL_EXISTS'
  | 'INVALID_TOKEN'
  | 'ALREADY_VERIFIED'
  | 'EMAIL_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_REFRESH_TOKEN'
  | 'INVALID_RESET_TOKEN'
  | 'EXPIRED_RESET_TOKEN'
  | 'RESET_TOKEN_USED'
  | 'EMAIL_SEND_ERROR';

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API error with typed error code
 */
export interface TypedApiError extends ApiErrorResponse {
  code: ApiErrorCode;
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

/**
 * Form field validation state
 */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Registration form validation state
 */
export interface RegistrationFormValidation {
  firstName: FieldValidation;
  lastName: FieldValidation;
  email: FieldValidation;
  password: FieldValidation;
  confirmPassword: FieldValidation;
  isFormValid: boolean;
}

/**
 * Email verification form validation state
 */
export interface EmailVerificationFormValidation {
  token: FieldValidation;
  isFormValid: boolean;
}

/**
 * Resend verification form validation state
 */
export interface ResendVerificationFormValidation {
  email: FieldValidation;
  isFormValid: boolean;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Loading states for different operations
 */
export interface AuthLoadingState {
  isRegistering: boolean;
  isVerifyingEmail: boolean;
  isResendingVerification: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRefreshingToken: boolean;
  isRequestingPasswordReset: boolean;
  isResettingPassword: boolean;
}

/**
 * Authentication UI state
 */
export interface AuthUIState {
  loading: AuthLoadingState;
  error: string | null;
  success: string | null;
  isFormSubmitted: boolean;
}

/**
 * Registration page state
 */
export interface RegistrationPageState extends AuthUIState {
  formData: RegistrationFormData;
  validation: RegistrationFormValidation;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

/**
 * Email verification page state
 */
export interface EmailVerificationPageState extends AuthUIState {
  formData: EmailVerificationFormData;
  validation: EmailVerificationFormValidation;
  isTokenFromUrl: boolean;
}

/**
 * Resend verification page state
 */
export interface ResendVerificationPageState extends AuthUIState {
  formData: ResendVerificationFormData;
  validation: ResendVerificationFormValidation;
  lastSentAt: string | null;
  canResend: boolean;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

/**
 * Return type for useRegistration hook
 */
export interface UseRegistrationReturn {
  formData: RegistrationFormData;
  validation: RegistrationFormValidation;
  uiState: AuthUIState;
  updateField: (field: keyof RegistrationFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
}

/**
 * Return type for useEmailVerification hook
 */
export interface UseEmailVerificationReturn {
  formData: EmailVerificationFormData;
  validation: EmailVerificationFormValidation;
  uiState: AuthUIState;
  updateToken: (token: string) => void;
  submitVerification: () => Promise<void>;
  resetForm: () => void;
}

/**
 * Return type for useResendVerification hook
 */
export interface UseResendVerificationReturn {
  formData: ResendVerificationFormData;
  validation: ResendVerificationFormValidation;
  uiState: AuthUIState;
  canResend: boolean;
  timeUntilCanResend: number;
  updateEmail: (email: string) => void;
  submitResend: () => Promise<void>;
  resetForm: () => void;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

/**
 * Auth service interface
 */
export interface AuthService {
  registerUser: (data: RegisterUserRequest) => Promise<RegisterUserResponse>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<VerifyEmailResponse>;
  resendVerification: (data: ResendVerificationRequest) => Promise<ResendVerificationResponse>;
  loginUser: (data: LoginRequest) => Promise<LoginResponse>;
  logoutUser: (data: LogoutRequest) => Promise<LogoutResponse>;
  refreshToken: (data: RefreshTokenRequest) => Promise<RefreshTokenResponse>;
  requestPasswordReset: (data: RequestPasswordResetRequest) => Promise<RequestPasswordResetResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// ============================================================================
// LOGIN/LOGOUT TYPES
// ============================================================================

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Login API response
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

/**
 * Logout request payload
 */
export interface LogoutRequest {
  refreshToken: string;
}

/**
 * Logout response data (empty object)
 */
export interface LogoutResponseData {}

/**
 * Logout API response
 */
export type LogoutResponse = ApiResponse<LogoutResponseData>;

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response data
 */
export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh token API response
 */
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;

/**
 * Login form data interface
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Login form validation state
 */
export interface LoginFormValidation {
  email: FieldValidation;
  password: FieldValidation;
  isFormValid: boolean;
}

/**
 * Login page state
 */
export interface LoginPageState extends AuthUIState {
  formData: LoginFormData;
  validation: LoginFormValidation;
  showPassword: boolean;
}

/**
 * Return type for useLogin hook
 */
export interface UseLoginReturn {
  formData: LoginFormData;
  validation: LoginFormValidation;
  uiState: AuthUIState;
  updateField: (field: keyof LoginFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  togglePasswordVisibility: () => void;
}

/**
 * Form field names for login
 */
export type LoginFieldName = keyof LoginFormData;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract data type from API response
 */
export type ExtractApiData<T> = T extends ApiSuccessResponse<infer U> ? U : never;

/**
 * Make all properties optional for partial updates
 */
export type PartialFormData<T> = Partial<T>;

/**
 * Form field names for registration
 */
export type RegistrationFieldName = keyof RegistrationFormData;

/**
 * Form field names for email verification
 */
export type EmailVerificationFieldName = keyof EmailVerificationFormData;

/**
 * Form field names for resend verification
 */
export type ResendVerificationFieldName = keyof ResendVerificationFormData;

// ============================================================================
// CONSTANTS TYPES
// ============================================================================

/**
 * API endpoints
 */
export interface ApiEndpoints {
  register: string;
  verifyEmail: string;
  resendVerification: string;
  login: string;
  logout: string;
  refreshToken: string;
}

/**
 * Validation rules
 */
export interface ValidationRules {
  firstName: {
    minLength: number;
    maxLength: number;
  };
  lastName: {
    minLength: number;
    maxLength: number;
  };
  email: {
    pattern: RegExp;
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
  };
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  registration: {
    maxAttempts: number;
    windowMinutes: number;
  };
  emailVerification: {
    maxAttempts: number;
    windowMinutes: number;
  };
  resendVerification: {
    maxAttempts: number;
    windowMinutes: number;
  };
  login: {
    maxAttempts: number;
    windowMinutes: number;
  };
}
