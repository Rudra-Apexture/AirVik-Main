'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail, resendVerification } from '@/src/services/auth.service';

interface VerifyEmailState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  isTokenMissing: boolean;
  canResend: boolean;
  resendEmail: string;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyEmailState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    isTokenMissing: false,
    canResend: false,
    resendEmail: '',
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token) {
      setState(prev => ({
        ...prev,
        isTokenMissing: true,
        canResend: !!email,
        resendEmail: email || '',
      }));
      return;
    }

    // Auto-verify if token is present
    handleVerification(token);
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await verifyEmail({ token });

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
        }));

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 3000);
      } else {
        let errorMessage = response.error || 'Email verification failed';
        let canResend = false;

        // Handle specific error codes
        switch (response.code) {
          case 'INVALID_TOKEN':
            errorMessage = 'The verification link is invalid or has expired. Please request a new verification email.';
            canResend = true;
            break;
          case 'ALREADY_VERIFIED':
            errorMessage = 'Your email is already verified. You can now sign in to your account.';
            break;
          case 'USER_NOT_FOUND':
            errorMessage = 'User account not found. Please register again.';
            break;
          case 'RATE_LIMITED':
            errorMessage = 'Too many verification attempts. Please try again later.';
            break;
          default:
            canResend = true;
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          canResend,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please check your connection and try again.',
        canResend: true,
      }));
    }
  };

  const handleResendVerification = async () => {
    if (!state.resendEmail) {
      setState(prev => ({
        ...prev,
        error: 'Email address is required to resend verification.',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await resendVerification({ email: state.resendEmail });

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      } else {
        let errorMessage = response.error || 'Failed to resend verification email';

        switch (response.code) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'Email address not found. Please check your email or register again.';
            break;
          case 'ALREADY_VERIFIED':
            errorMessage = 'Your email is already verified. You can now sign in to your account.';
            break;
          case 'RATE_LIMITED':
            errorMessage = 'Please wait before requesting another verification email.';
            break;
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to resend verification email. Please try again.',
      }));
    }
  };

  const handleEmailChange = (email: string) => {
    setState(prev => ({
      ...prev,
      resendEmail: email,
      error: null,
    }));
  };

  // Success state
  if (state.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your email has been verified. You can now sign in to your AirVik account.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to login page in 3 seconds...
              </p>
              
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (state.isLoading && !state.isTokenMissing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or token missing state
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AirVik Hotel System</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Email Verification</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {state.isTokenMissing ? (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Verification Link Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please click the verification link in your email, or enter your email below to resend the verification email.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Verification Failed
                </h3>
              </>
            )}

            {state.error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{state.error}</p>
              </div>
            )}

            {(state.canResend || state.isTokenMissing) && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      value={state.resendEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  onClick={handleResendVerification}
                  disabled={state.isLoading || !state.resendEmail}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Account
              </Link>
              
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
