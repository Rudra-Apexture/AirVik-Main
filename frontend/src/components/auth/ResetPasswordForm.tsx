"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/src/services/auth.service';
import { ResetPasswordRequest } from '@/src/types/auth.types';

// Define interfaces for form data and validation
interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface FieldValidation {
  isValid: boolean;
  error?: string;
}

interface ResetPasswordFormValidation {
  token: FieldValidation;
  newPassword: FieldValidation;
  confirmPassword: FieldValidation;
  isFormValid: boolean;
}

interface AuthLoadingState {
  isResettingPassword: boolean;
}

interface AuthUIState {
  loading: AuthLoadingState;
  error: string | null;
  success: string | null;
  isFormSubmitted: boolean;
}

interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 4: very strong)
  feedback: string;
}

/**
 * ResetPasswordForm Component
 * 
 * A form for users to reset their password using a token
 * This component handles form state, validation, and UI feedback
 * It uses mock data only (no real API calls)
 */
const ResetPasswordForm: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const router = useRouter();
  
  // Form data state
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Form validation state
  const [validation, setValidation] = useState<ResetPasswordFormValidation>({
    token: { isValid: true },
    newPassword: { isValid: true },
    confirmPassword: { isValid: true },
    isFormValid: false
  });
  
  // UI state for loading, errors, success
  const [uiState, setUiState] = useState<AuthUIState>({
    loading: {
      isResettingPassword: false
    },
    error: null,
    success: null,
    isFormSubmitted: false
  });
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: ''
  });
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Extract token from URL query parameters or path on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let tokenFromUrl = '';
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      
      // Case 1: Check for token in query parameters (?token=xyz)
      const queryToken = params.get('token');
      if (queryToken) {
        tokenFromUrl = queryToken;
      }
      
      // Case 2: Check for token=xyz format in the path (as seen in screenshot)
      // This handles the format in the screenshot: /reset-password/token=82c60d13bad0df00dc0075ddc3064570a2c014
      else if (pathname.includes('/reset-password/token=')) {
        const tokenMatch = pathname.match(/\/reset-password\/token=([a-zA-Z0-9]{20,})/i);
        if (tokenMatch && tokenMatch[1]) {
          tokenFromUrl = tokenMatch[1];
        }
      }
      
      // Case 3: Check for token directly in path (/reset-password/xyz)
      else if (pathname.startsWith('/reset-password/')) {
        const pathParts = pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.length >= 20 && /^[a-zA-Z0-9]{20,}$/.test(lastPart)) {
          tokenFromUrl = lastPart;
        }
      }

      // If we found a token, update the form data
      if (tokenFromUrl) {
        setFormData(prev => ({
          ...prev,
          token: tokenFromUrl
        }));
      } else {
        console.warn('No token found in URL');
        // Set error state for no token found
        setUiState(prev => ({
          ...prev,
          error: 'Invalid or missing password reset token. Please request a new password reset link.'
        }));
      }
    }
  }, []);
  
  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  
  /**
   * Handle input field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update password strength when password changes
    if (name === 'newPassword') {
      updatePasswordStrength(value);
    }
    
    // Clear errors when user starts typing
    if (uiState.error) {
      setUiState(prev => ({
        ...prev,
        error: null
      }));
    }
  };
  
  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = (field: 'newPassword' | 'confirmPassword'): void => {
    if (field === 'newPassword') {
      setShowPassword(prev => !prev);
    } else {
      setShowConfirmPassword(prev => !prev);
    }
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Mark form as submitted to show all validation errors
    setUiState(prev => ({
      ...prev,
      isFormSubmitted: true
    }));
    
    // Validate all fields
    const validationResult = validateForm();
    setValidation(validationResult);
    
    if (!validationResult.isFormValid) {
      return;
    }
    
    // Set loading state
    setUiState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        isResettingPassword: true
      },
      error: null
    }));
    
    try {
      // Log form submission for debugging
      
      // API request data - send all required fields according to the API contract
      const requestData: ResetPasswordRequest = {
        token: formData.token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };
      
      // Call the API using the auth service
      const response = await resetPassword(requestData);
      
      // Handle success
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isResettingPassword: false
        },
        success: 'Your password has been reset successfully. You will be redirected to the login page shortly.',
        error: null,
        isFormSubmitted: false
      }));
      
      // Clear form data for security
      setFormData({
        token: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Default error message
      let errorMessage = 'Failed to reset password. Please try again.';
      
      // Handle structured API errors
      if (error && typeof error === 'object') {
        // Handle standardized API error format
        if ('success' in error && error.success === false) {
          errorMessage = error.error || errorMessage;
          
          // Process specific error codes if available
          if (error.code) {
            switch(error.code) {
              case 'INVALID_TOKEN':
                errorMessage = 'The password reset link is invalid. Please request a new one.';
                break;
              case 'TOKEN_EXPIRED':
                errorMessage = 'The password reset link has expired. Please request a new one.';
                break;
              case 'VALIDATION_ERROR':
                if (error.details && Array.isArray(error.details)) {
                  errorMessage = error.details.join(', ');
                } else {
                  errorMessage = 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.';
                }
                break;
            }
          }
        } else if (error.status === 400) {
          // Handle 400 Bad Request errors
          errorMessage = 'Invalid request. Please check your password format.';
        } else if (error.message) {
          // Standard error object
          errorMessage = error.message;
        }
      }
      
      // Set error state
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isResettingPassword: false
        },
        error: errorMessage
      }));
    }
  };
  
  // ============================================================================
  // VALIDATION LOGIC
  // ============================================================================
  
  /**
   * Update password strength indicator
   */
  const updatePasswordStrength = (password: string): void => {
    // Simple password strength algorithm
    let score = 0;
    let feedback = '';
    
    if (!password) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 0.5;
    if (/[a-z]/.test(password)) score += 0.5;
    if (/[0-9]/.test(password)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
    
    // Cap score at 4
    score = Math.min(4, score);
    
    // Generate feedback
    switch (Math.floor(score)) {
      case 0:
        feedback = 'Very weak';
        break;
      case 1:
        feedback = 'Weak';
        break;
      case 2:
        feedback = 'Fair';
        break;
      case 3:
        feedback = 'Good';
        break;
      case 4:
        feedback = 'Strong';
        break;
      default:
        feedback = '';
    }
    
    setPasswordStrength({ score, feedback });
  };
  
  /**
   * Validate a single field
   */
  const validateField = (field: keyof ResetPasswordFormData, value: string): FieldValidation => {
    switch (field) {
      case 'token':
        if (!value.trim()) {
          return { isValid: false, error: 'Reset token is required' };
        }
        return { isValid: true };
        
      case 'newPassword':
        if (!value) {
          return { isValid: false, error: 'New password is required' };
        }
        
        if (value.length < 8) {
          return { isValid: false, error: 'Password must be at least 8 characters long' };
        }
        
        if (!/[A-Z]/.test(value)) {
          return { isValid: false, error: 'Password must contain at least one uppercase letter' };
        }
        
        if (!/[a-z]/.test(value)) {
          return { isValid: false, error: 'Password must contain at least one lowercase letter' };
        }
        
        if (!/[0-9]/.test(value)) {
          return { isValid: false, error: 'Password must contain at least one number' };
        }
        
        return { isValid: true };
        
      case 'confirmPassword':
        if (!value) {
          return { isValid: false, error: 'Please confirm your password' };
        }
        
        if (value !== formData.newPassword) {
          return { isValid: false, error: 'Passwords do not match' };
        }
        
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  };
  
  /**
   * Validate the entire form
   */
  const validateForm = (): ResetPasswordFormValidation => {
    const tokenValidation = validateField('token', formData.token);
    const newPasswordValidation = validateField('newPassword', formData.newPassword);
    const confirmPasswordValidation = validateField('confirmPassword', formData.confirmPassword);
    
    const isFormValid = 
      tokenValidation.isValid && 
      newPasswordValidation.isValid && 
      confirmPasswordValidation.isValid;
    
    return {
      token: tokenValidation,
      newPassword: newPasswordValidation,
      confirmPassword: confirmPasswordValidation,
      isFormValid
    };
  };
  
  /**
   * Validate fields on blur
   */
  const handleBlur = (field: keyof ResetPasswordFormData): void => {
    const fieldValidation = validateField(field, formData[field]);
    
    setValidation(prev => ({
      ...prev,
      [field]: fieldValidation
    }));
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>
        
        {/* Success Message */}
        {uiState.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">{uiState.success}</p>
          </div>
        )}
        
        {/* Error Message */}
        {uiState.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{uiState.error}</p>
          </div>
        )}
        
        {/* Form */}
        {!uiState.success && (
          <form onSubmit={handleSubmit} noValidate>
            <p className="mb-6 text-gray-600 text-sm">
              Enter your reset token and create a new password for your account.
            </p>
            
            {/* Token Field */}
            <div className="mb-6">
              <label 
                htmlFor="token" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reset Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                value={formData.token}
                onChange={handleInputChange}
                onBlur={() => handleBlur('token')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validation.token.isValid && uiState.isFormSubmitted
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your reset token"
                disabled={uiState.loading.isResettingPassword}
                required
                aria-describedby={!validation.token.isValid ? "token-error" : undefined}
              />
              {!validation.token.isValid && uiState.isFormSubmitted && (
                <p id="token-error" className="mt-1 text-sm text-red-600">
                  {validation.token.error}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This token was sent to your email address or included in the reset link.
              </p>
            </div>
            
            {/* New Password Field */}
            <div className="mb-6">
              <label 
                htmlFor="newPassword" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('newPassword')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validation.newPassword.isValid && uiState.isFormSubmitted
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={uiState.loading.isResettingPassword}
                  required
                  aria-describedby={!validation.newPassword.isValid ? "newPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <span className="text-sm">Hide</span>
                  ) : (
                    <span className="text-sm">Show</span>
                  )}
                </button>
              </div>
              {!validation.newPassword.isValid && uiState.isFormSubmitted && (
                <p id="newPassword-error" className="mt-1 text-sm text-red-600">
                  {validation.newPassword.error}
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength.score <= 1
                            ? 'bg-red-500'
                            : passwordStrength.score === 2
                              ? 'bg-yellow-500'
                              : passwordStrength.score === 3
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-600">
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, and numbers.
                  </p>
                </div>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-6">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !validation.confirmPassword.isValid && uiState.isFormSubmitted
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={uiState.loading.isResettingPassword}
                  required
                  aria-describedby={!validation.confirmPassword.isValid ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <span className="text-sm">Hide</span>
                  ) : (
                    <span className="text-sm">Show</span>
                  )}
                </button>
              </div>
              {!validation.confirmPassword.isValid && uiState.isFormSubmitted && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
                  {validation.confirmPassword.error}
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="mb-6">
              <button
                type="submit"
                disabled={uiState.loading.isResettingPassword}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  uiState.loading.isResettingPassword
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
                aria-busy={uiState.loading.isResettingPassword}
              >
                {uiState.loading.isResettingPassword ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
            
            {/* Back to Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link 
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        )}
        
        {/* Back to Login Link (after success) */}
        {uiState.success && (
          <div className="text-center mt-4">
            <Link 
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
