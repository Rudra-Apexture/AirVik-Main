// AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY
// This contract defines the EXACT TypeScript interfaces from frontend/src/types/auth.types.ts
// ALL future development MUST use these exact interface names and structures

/**
 * CRITICAL TYPE NAMING RULES:
 * - MUST use "User" interface (NOT UserData, UserInfo, UserProfile)
 * - MUST use "RegisterUserRequest" (NOT RegistrationRequest, SignUpRequest)
 * - MUST use "LoginRequest" (NOT SignInRequest, AuthRequest)
 * - MUST use "ApiResponse" (NOT Response, ApiResult)
 * - MUST use "ApiSuccessResponse" and "ApiErrorResponse"
 * - MUST use "firstName" and "lastName" in API types (NOT first_name, last_name)
 * - MUST use "isEmailVerified" in API types (NOT emailVerified, verified)
 */

// ============================================================================
// USER INTERFACE TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

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
// FORM DATA TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationFormData {
  token: string;
}

export interface ResendVerificationFormData {
  email: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ============================================================================
// API REQUEST TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface RegisterUserRequest {
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

// ============================================================================
// BASE API RESPONSE TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface BaseApiResponse {
  success: boolean;
}

export interface ApiSuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  code?: string;
  details?: string[];
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// SPECIFIC API RESPONSE DATA TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface RegistrationResponseData {
  user: User;
  message: string;
}

export interface EmailVerificationResponseData {
  message: string;
}

export interface ResendVerificationResponseData {
  message: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponseData {
  // Empty object
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

// ============================================================================
// COMPLETE API RESPONSE TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export type RegisterUserResponse = ApiResponse<RegistrationResponseData>;
export type VerifyEmailResponse = ApiResponse<EmailVerificationResponseData>;
export type ResendVerificationResponse = ApiResponse<ResendVerificationResponseData>;
export type LoginResponse = ApiResponse<LoginResponseData>;
export type LogoutResponse = ApiResponse<LogoutResponseData>;
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;

// ============================================================================
// ERROR CODE TYPES (EXACT FROM auth.types.ts)
// ============================================================================

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
  | 'INVALID_REFRESH_TOKEN';

export interface ValidationError {
  field: string;
  message: string;
}

export interface TypedApiError extends ApiErrorResponse {
  code: ApiErrorCode;
}

// ============================================================================
// FORM VALIDATION TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export interface RegistrationFormValidation {
  firstName: FieldValidation;
  lastName: FieldValidation;
  email: FieldValidation;
  password: FieldValidation;
  confirmPassword: FieldValidation;
  isFormValid: boolean;
}

export interface EmailVerificationFormValidation {
  token: FieldValidation;
  isFormValid: boolean;
}

export interface ResendVerificationFormValidation {
  email: FieldValidation;
  isFormValid: boolean;
}

export interface LoginFormValidation {
  email: FieldValidation;
  password: FieldValidation;
  isFormValid: boolean;
}

// ============================================================================
// UI STATE TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface AuthLoadingState {
  isRegistering: boolean;
  isVerifyingEmail: boolean;
  isResendingVerification: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRefreshingToken: boolean;
}

export interface AuthUIState {
  loading: AuthLoadingState;
  error: string | null;
  success: string | null;
  isFormSubmitted: boolean;
}

export interface RegistrationPageState extends AuthUIState {
  formData: RegistrationFormData;
  validation: RegistrationFormValidation;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export interface EmailVerificationPageState extends AuthUIState {
  formData: EmailVerificationFormData;
  validation: EmailVerificationFormValidation;
  isTokenFromUrl: boolean;
}

export interface ResendVerificationPageState extends AuthUIState {
  formData: ResendVerificationFormData;
  validation: ResendVerificationFormValidation;
  lastSentAt: string | null;
  canResend: boolean;
}

export interface LoginPageState extends AuthUIState {
  formData: LoginFormData;
  validation: LoginFormValidation;
  showPassword: boolean;
}

// ============================================================================
// HOOK TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface UseRegistrationReturn {
  formData: RegistrationFormData;
  validation: RegistrationFormValidation;
  uiState: AuthUIState;
  updateField: (field: keyof RegistrationFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
}

export interface UseEmailVerificationReturn {
  formData: EmailVerificationFormData;
  validation: EmailVerificationFormValidation;
  uiState: AuthUIState;
  updateToken: (token: string) => void;
  submitVerification: () => Promise<void>;
  resetForm: () => void;
}

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

export interface UseLoginReturn {
  formData: LoginFormData;
  validation: LoginFormValidation;
  uiState: AuthUIState;
  updateField: (field: keyof LoginFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  togglePasswordVisibility: () => void;
}

// ============================================================================
// SERVICE TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface AuthService {
  registerUser: (data: RegisterUserRequest) => Promise<RegisterUserResponse>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<VerifyEmailResponse>;
  resendVerification: (data: ResendVerificationRequest) => Promise<ResendVerificationResponse>;
  loginUser: (data: LoginRequest) => Promise<LoginResponse>;
  logoutUser: (data: LogoutRequest) => Promise<LogoutResponse>;
  refreshToken: (data: RefreshTokenRequest) => Promise<RefreshTokenResponse>;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// ============================================================================
// FIELD NAME TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export type RegistrationFieldName = keyof RegistrationFormData;
export type EmailVerificationFieldName = keyof EmailVerificationFormData;
export type ResendVerificationFieldName = keyof ResendVerificationFormData;
export type LoginFieldName = keyof LoginFormData;

// ============================================================================
// UTILITY TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export type ExtractApiData<T> = T extends ApiSuccessResponse<infer U> ? U : never;
export type PartialFormData<T> = Partial<T>;

// ============================================================================
// CONSTANTS TYPES (EXACT FROM auth.types.ts)
// ============================================================================

export interface ApiEndpoints {
  register: string;
  verifyEmail: string;
  resendVerification: string;
  login: string;
  logout: string;
  refreshToken: string;
}

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

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - UserData, UserInfo, UserProfile (use User)
 * - RegistrationRequest, SignUpRequest (use RegisterUserRequest)
 * - SignInRequest, AuthRequest (use LoginRequest)
 * - Response, ApiResult (use ApiResponse)
 * - first_name, last_name (use firstName, lastName)
 * - emailVerified, verified (use isEmailVerified)
 * - name (use firstName + lastName in API types)
 * - isActive (use isEmailVerified in API types)
 * - Different field names than specified
 * - Different interface structures than specified
 * - Missing optional vs required field distinctions
 * - Different hook return type structures
 * - Different form data structures
 */
