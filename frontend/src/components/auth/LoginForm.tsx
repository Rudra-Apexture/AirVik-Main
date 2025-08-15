"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LoginFormData, LoginFormValidation, FieldValidation, AuthUIState } from '@/src/types/auth.types';

/**
 * LoginForm Component
 * 
 * A reusable login form component for the Airvik Hotel System
 * This component handles form state, validation, and UI feedback
 * It does NOT handle API calls directly (that's handled in F5)
 */
const LoginForm: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Form data state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  // Form validation state
  const [validation, setValidation] = useState<LoginFormValidation>({
    email: { isValid: true },
    password: { isValid: true },
    isFormValid: false
  });
  
  // UI state for loading, errors, success
  const [uiState, setUiState] = useState<AuthUIState>({
    loading: {
      isRegistering: false,
      isVerifyingEmail: false,
      isResendingVerification: false,
      isLoggingIn: false,
      isLoggingOut: false,
      isRefreshingToken: false,
      isRequestingPasswordReset: false,
      isResettingPassword: false
    },
    error: null,
    success: null,
    isFormSubmitted: false
  });
  
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
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
   * Toggle password visibility
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
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
    
    if (!validationResult.isFormValid) {
      return;
    }
    
    // Set loading state
    setUiState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        isLoggingIn: true
      },
      error: null
    }));
    
    try {
      // Real API call to backend
      await loginApi(formData);
      
      // Set success state
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isLoggingIn: false
        },
        success: 'Login successful! Redirecting...'
      }));
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      // Set error state
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isLoggingIn: false
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
  const validateField = useCallback((field: keyof LoginFormData, value: string): FieldValidation => {
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
        
      case 'password':
        if (!value) {
          return { isValid: false, error: 'Password is required' };
        }
        
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  }, []);
  
  /**
   * Validate the entire form
   */
  const validateForm = useCallback((): LoginFormValidation => {
    const emailValidation = validateField('email', formData.email);
    const passwordValidation = validateField('password', formData.password);
    
    const isFormValid = emailValidation.isValid && passwordValidation.isValid;
    
    const newValidation = {
      email: emailValidation,
      password: passwordValidation,
      isFormValid
    };
    
    setValidation(newValidation);
    return newValidation;
  }, [formData, validateField, setValidation]);
  
  /**
   * Validate fields on blur
   */
  const handleBlur = (field: keyof LoginFormData): void => {
    const fieldValidation = validateField(field, formData[field]);
    
    setValidation(prev => ({
      ...prev,
      [field]: fieldValidation,
      isFormValid: field === 'email' 
        ? fieldValidation.isValid && prev.password.isValid
        : prev.email.isValid && fieldValidation.isValid
    }));
  };
  
  // ============================================================================
  // MOCK API (WILL BE REPLACED IN F5)
  // ============================================================================
  
  /**
   * Login API call using auth service
   */
  const loginApi = async (data: LoginFormData): Promise<void> => {
    // Debug: Log the login request data
    
    const { loginUser } = await import('@/src/services/auth.service');
    
    try {
      const response = await loginUser(data);
      
      // Debug: Log the login response
      
      if (!response.success) {
        throw new Error(response.error || 'Login failed. Please try again.');
      }
      
      // Return successfully - tokens are automatically stored by the service
      return Promise.resolve();
    } catch (error) {
      // Debug: Log the error
      console.error('Login API error details:', error);
      throw error;
    }
  };
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Validate form when inputs change
   */
  useEffect(() => {
    if (uiState.isFormSubmitted) {
      validateForm();
    }
  }, [formData, uiState.isFormSubmitted, validateForm]);
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login to Airvik Hotel System
        </h2>
        
        {/* Error Alert */}
        {uiState.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{uiState.error}</p>
          </div>
        )}
        
        {/* Success Alert */}
        {uiState.success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>{uiState.success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
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
              disabled={uiState.loading.isLoggingIn}
              required
            />
            {!validation.email.isValid && uiState.isFormSubmitted && (
              <p className="mt-1 text-sm text-red-600">
                {validation.email.error}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validation.password.isValid && uiState.isFormSubmitted
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={uiState.loading.isLoggingIn}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
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
            {!validation.password.isValid && uiState.isFormSubmitted && (
              <p className="mt-1 text-sm text-red-600">
                {validation.password.error}
              </p>
            )}
          </div>
          
          {/* Forgot Password Link */}
          <div className="flex items-center justify-end mb-6">
            <Link 
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot your password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={uiState.loading.isLoggingIn}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                uiState.loading.isLoggingIn
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {uiState.loading.isLoggingIn ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
          
          {/* Registration Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
