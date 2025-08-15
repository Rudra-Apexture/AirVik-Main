"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/src/services/auth.service';
import { RequestPasswordResetRequest } from '@/src/types/auth.types';

// Define interfaces for form data and validation
interface ForgotPasswordFormData {
  email: string;
}

interface FieldValidation {
  isValid: boolean;
  error?: string;
}

interface ForgotPasswordFormValidation {
  email: FieldValidation;
  isFormValid: boolean;
}

interface AuthLoadingState {
  isRequestingPasswordReset: boolean;
}

interface AuthUIState {
  loading: AuthLoadingState;
  error: string | null;
  success: string | null;
  isFormSubmitted: boolean;
}

/**
 * ForgotPasswordForm Component
 * 
 * A form for users to request a password reset email
 * This component handles form state, validation, and UI feedback
 * It uses mock data only (no real API calls)
 */
const ForgotPasswordForm: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Form data state
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  
  // Form validation state
  const [validation, setValidation] = useState<ForgotPasswordFormValidation>({
    email: { isValid: true },
    isFormValid: false
  });
  
  // UI state for loading, errors, success
  const [uiState, setUiState] = useState<AuthUIState>({
    loading: {
      isRequestingPasswordReset: false
    },
    error: null,
    success: null,
    isFormSubmitted: false
  });
  
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
    
    // Clear errors when user starts typing
    if (uiState.error) {
      setUiState(prev => ({
        ...prev,
        error: null
      }));
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
    
    // Validate email
    const emailValidation = validateField('email', formData.email);
    setValidation(prev => ({
      ...prev,
      email: emailValidation,
      isFormValid: emailValidation.isValid
    }));
    
    if (!emailValidation.isValid) {
      return;
    }
    
    // Set loading state
    setUiState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        isRequestingPasswordReset: true
      },
      error: null
    }));
    
    try {
      // Call the real API using the auth service
      const result = await requestPasswordReset(formData.email);
      
      if (result.success) {
        // Set success state
        setUiState(prev => ({
          ...prev,
          loading: {
            ...prev.loading,
            isRequestingPasswordReset: false
          },
          success: result.message || 'Password reset instructions have been sent to your email address.'
        }));
        
        // Reset form after successful submission
        setFormData({ email: '' });
      } else {
        // Handle specific error cases based on error code
        let errorMessage = result.error || 'An unexpected error occurred';
        
        // Map error codes to user-friendly messages
        switch (result.code) {
          case 'USER_NOT_FOUND':
            errorMessage = 'No account found with this email address.';
            break;
          case 'RATE_LIMIT_EXCEEDED':
            errorMessage = 'Too many password reset requests. Please try again later.';
            break;
          case 'VALIDATION_ERROR':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'TIMEOUT_ERROR':
            errorMessage = 'Request timed out. Please try again.';
            break;
          default:
            // Use the error message from the API if available
            break;
        }
        
        // Set error state
        setUiState(prev => ({
          ...prev,
          loading: {
            ...prev.loading,
            isRequestingPasswordReset: false
          },
          error: errorMessage
        }));
      }
    } catch (error) {
      // Set error state for unexpected errors
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isRequestingPasswordReset: false
        },
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };
  
  // ============================================================================
  // VALIDATION LOGIC
  // ============================================================================
  
  /**
   * Validate a single field
   */
  const validateField = (field: keyof ForgotPasswordFormData, value: string): FieldValidation => {
    switch (field) {
      case 'email':
        if (!value.trim()) {
          return { isValid: false, error: 'Email is required' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, error: 'Please enter a valid email address' };
        }
        
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  };
  
  /**
   * Validate the entire form
   */
  const validateForm = (): ForgotPasswordFormValidation => {
    const emailValidation = validateField('email', formData.email);
    
    const isFormValid = emailValidation.isValid;
    
    return {
      email: emailValidation,
      isFormValid
    };
  };
  
  /**
   * Validate fields on blur
   */
  const handleBlur = (field: keyof ForgotPasswordFormData): void => {
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
          Forgot Password
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
              Enter your email address below and we&apos;ll send you instructions to reset your password.
            </p>
            
            {/* Email Field */}
            <div className="mb-6">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validation.email.isValid && uiState.isFormSubmitted
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
                disabled={uiState.loading.isRequestingPasswordReset}
                required
                aria-describedby={!validation.email.isValid ? "email-error" : undefined}
              />
              {!validation.email.isValid && uiState.isFormSubmitted && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {validation.email.error}
                </p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="mb-6">
              <button
                type="submit"
                disabled={uiState.loading.isRequestingPasswordReset}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  uiState.loading.isRequestingPasswordReset
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
                aria-busy={uiState.loading.isRequestingPasswordReset}
              >
                {uiState.loading.isRequestingPasswordReset ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Instructions'
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
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
