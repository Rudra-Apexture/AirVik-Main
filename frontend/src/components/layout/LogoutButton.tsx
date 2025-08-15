"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser, getStoredTokens, clearStoredTokens } from '@/src/services/auth.service';
import { LogoutRequest, LogoutResponse } from '@/src/types/auth.types';

/**
 * LogoutButton Component Props
 */
interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  onLogoutSuccess?: () => void;
  onLogoutError?: (error: string) => void;
}

/**
 * LogoutButton Component
 * 
 * A reusable button component that handles user logout functionality.
 * Shows loading state during logout process and handles success/error states.
 * Redirects to login page after successful logout.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  onLogoutSuccess,
  onLogoutError
}) => {
  // Router for navigation
  const router = useRouter();
  
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  /**
   * Handle logout process
   */
  const handleLogout = async (): Promise<void> => {
    try {
      // Set loading state
      setIsLoading(true);
      
      // Get stored refresh token
      const { refreshToken } = getStoredTokens();
      
      if (!refreshToken) {
        throw new Error('No refresh token found. Please login again.');
      }
      
      // Create logout request
      const logoutRequest: LogoutRequest = {
        refreshToken
      };
      
      // Call logout API with proper error handling
      try {
        const response = await logoutUser(logoutRequest);
        
        if (response.success) {
          // Clear tokens on successful logout
          clearStoredTokens();
          
          // Call success callback if provided
          if (onLogoutSuccess) {
            onLogoutSuccess();
          }
          
          // Redirect to login page
          router.push('/auth/login');
        } else {
          // Handle API error response
          const errorMessage = response.error || 'Logout failed. Please try again.';
          
          // Call error callback if provided
          if (onLogoutError) {
            onLogoutError(errorMessage);
          }
          
          // Clear tokens anyway for security
          clearStoredTokens();
          
          // Redirect to login page
          router.push('/auth/login');
        }
      } catch (apiError) {
        // Handle network or unexpected errors
        const errorMessage = apiError instanceof Error 
          ? apiError.message 
          : 'Network error during logout';
          
        // Call error callback if provided
        if (onLogoutError) {
          onLogoutError(errorMessage);
        }
        
        // Clear tokens anyway for security
        clearStoredTokens();
        
        // Redirect to login page
        router.push('/auth/login');
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during logout';
      
      // Call error callback if provided
      if (onLogoutError) {
        onLogoutError(errorMessage);
      }
      
      // Clear tokens anyway for security
      clearStoredTokens();
      
      // Redirect to login page
      router.push('/auth/login');
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  
  /**
   * Get button style classes based on variant and size
   */
  const getButtonClasses = (): string => {
    // Base classes
    let classes = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ';
    
    // Add variant-specific classes
    switch (variant) {
      case 'primary':
        classes += 'bg-blue-600 text-white hover:bg-blue-700 ';
        break;
      case 'secondary':
        classes += 'bg-gray-200 text-gray-800 hover:bg-gray-300 ';
        break;
      case 'text':
        classes += 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline ';
        break;
      default:
        classes += 'bg-blue-600 text-white hover:bg-blue-700 ';
    }
    
    // Add size-specific classes
    switch (size) {
      case 'sm':
        classes += 'px-2.5 py-1.5 text-xs ';
        break;
      case 'md':
        classes += 'px-4 py-2 text-sm ';
        break;
      case 'lg':
        classes += 'px-6 py-3 text-base ';
        break;
      default:
        classes += 'px-4 py-2 text-sm ';
    }
    
    // Add disabled state classes if loading
    if (isLoading) {
      classes += 'opacity-70 cursor-not-allowed ';
    }
    
    // Add custom classes
    classes += className;
    
    return classes;
  };
  
  return (
    <button
      type="button"
      className={getButtonClasses()}
      onClick={handleLogout}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Logging out...
        </div>
      ) : (
        'Logout'
      )}
    </button>
  );
};

export default LogoutButton;
