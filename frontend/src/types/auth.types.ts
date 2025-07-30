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
  | 'INTERNAL_ERROR';

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
}
