'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { resetPassword } from '@/src/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FaExclamation, FaExclamationCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordPageState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  isTokenMissing: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ResetPasswordPageState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    isTokenMissing: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    trigger,
    setValue,
  } = useForm<ResetPasswordFormData>({
    mode: 'onChange',
  });

  const [showPassword, setShowPassword] = useState(false);

  const password = watch('newPassword', '');
  const confirmPassword = watch('confirmPassword', '');

  // Check if passwords match
  const passwordsMatch = password === confirmPassword;

  // Password validation rules
  const hasMinLength = password?.length >= 8;
  const hasUppercase = /[A-Z]/.test(password || '');
  const hasLowercase = /[a-z]/.test(password || '');
  const hasNumber = /[0-9]/.test(password || '');
  const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password || '');
  const hasAllRequiredChars = hasUppercase && hasLowercase && hasNumber;

  // All validations must pass for password to be considered valid
  const isPasswordValid = hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    (hasNumber || hasSpecialChar);

  // Show validation messages if the password field has content
  const showValidation = password.length > 0;

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setState(prev => ({
        ...prev,
        isTokenMissing: true,
      }));
      return;
    }

    // Set the token in the form
    setValue('token', token);
  }, [searchParams, setValue]);

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!passwordsMatch) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }

    if (!isPasswordValid) {
      setError('newPassword', { type: 'manual', message: 'Password does not meet requirements' });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await resetPassword({
        token: data.token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
        }));

        // Show success toast
        toast.success(
          <div className="flex items-start p-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center size-10 rounded-full bg-green-500">
                <FaExclamation className="text-white text-lg" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Password Reset Successful</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Your password has been reset successfully. You can now sign in with your new password.</p>
              </div>
            </div>
          </div>,
          {
            duration: 4000,
            className: 'p-4 bg-white',
            style: {
              border: '1px solid #DDDDDD',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              padding: '1rem',
            },
            icon: null,
          }
        );

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?reset=success');
        }, 3000);
      } else {
        // Handle API error response
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Password reset failed',
        }));

        // Show custom toast notification for the error
        toast.error(
          <div className="flex items-start p-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center size-10 rounded-full bg-red-500">
                <FaExclamation className="text-white text-lg" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Let's try that again</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>{response.error || 'Password reset failed. Please try again.'}</p>
              </div>
            </div>
          </div>,
          {
            duration: 4000,
            className: 'p-4 bg-white',
            style: {
              border: '1px solid #DDDDDD',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              padding: '1rem',
            },
            icon: null,
          }
        );

        // Handle validation errors
        if (response.code === 'VALIDATION_ERROR' && response.details) {
          response.details.forEach((detail: string) => {
            if (detail.toLowerCase().includes('password')) {
              setError('newPassword', { type: 'manual', message: detail });
            } else if (detail.toLowerCase().includes('token')) {
              setError('token', { type: 'manual', message: detail });
            }
          });
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please check your connection and try again.',
      }));

      toast.error(
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center size-10 rounded-full bg-red-500">
              <FaExclamation className="text-white text-lg" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">Connection Error</h3>
            <div className="mt-1 text-sm text-gray-500">
              <p>Network error. Please check your connection and try again.</p>
            </div>
          </div>
        </div>,
        {
          duration: 4000,
          className: 'p-4 bg-white',
          style: {
            border: '1px solid #DDDDDD',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            padding: '1rem',
          },
          icon: null,
        }
      );
    }
  };

  if (state.isTokenMissing) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent>
              <div className="text-center space-y-5">
                <div className="mx-auto flex items-center justify-center flex-shrink-0">
                  <div className="flex items-center justify-center size-12 rounded-full bg-red-100">
                    <FaTimesCircle className="text-red-600 text-xl" />
                  </div>
                </div>
                <h2 className="lg:text-2xl text-xl font-bold text-text">
                  Invalid Reset Link
                </h2>
                <p className="text-muted">
                  The password reset link is invalid or has expired.
                </p>
                <p className="text-sm text-muted">
                  Please request a new password reset link.
                </p>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium transition-all ease-linear duration-75"
                  >
                    <Link href="/auth/forgot-password">
                      Request New Reset Link
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="w-full py-2 px-4 text-sm rounded-md font-medium transition-all duration-75 ease-linear"
                  >
                    <Link href="/auth/login">
                      Back to Login
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state.isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent>
              <div className="text-center space-y-5">
                <div className="mx-auto flex items-center justify-center flex-shrink-0">
                  <div className="flex items-center justify-center size-12 rounded-full bg-green-100">
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>
                </div>
                <h2 className="lg:text-2xl text-xl font-bold text-text">
                  Password Reset Successful
                </h2>
                <p className="text-muted">
                  Your password has been reset successfully.
                </p>
                <p className="text-sm text-muted">
                  You can now sign in with your new password.
                </p>

                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium transition-all ease-linear duration-75"
                >
                  <Link href="/auth/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent>
            <div className="text-left mb-6">
              <h2 className="sm:text-3xl text-2xl font-bold text-text capitalize">Reset Password</h2>
              <p className="text-sm text-muted">Create a new secure password for your account.</p>
            </div>

            <form method="post" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* New Password field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-text">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    {...register('newPassword', {
                      required: 'New password is required',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='New password'
                    autoComplete="new-password"
                    className={`${errors.newPassword ? 'border-red-500' : ''} pr-12`}
                    onBlur={() => {
                      trigger('newPassword');
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {errors.newPassword && (
                  <div className='flex items-center gap-1 mt-1'>
                    <FaExclamationCircle className='text-red-600 text-xs flex-shrink-0' />
                    <p className="text-xs text-red-600">{errors.newPassword.message}</p>
                  </div>
                )}

                {/* Password validation feedback - show when user starts typing */}
                {showValidation && (
                  <div className="mt-2">
                    {isPasswordValid ? (
                      <div className="flex items-center text-sm text-green-600">
                        <FaCheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>Password strength: Strong</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className={`flex items-center text-sm ${hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                          {hasMinLength ? (
                            <FaCheckCircle className="h-4 w-4 text-green-500 font-medium mr-2" />
                          ) : (
                            <FaTimesCircle className="h-4 w-4 text-red-500 font-medium mr-2" />
                          )}
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center text-sm ${hasAllRequiredChars ? 'text-green-600' : 'text-red-600'}`}>
                          {hasAllRequiredChars ? (
                            <FaCheckCircle className="h-4 w-4 text-green-500 font-medium mr-2" />
                          ) : (
                            <FaTimesCircle className="h-4 w-4 text-red-500 font-medium mr-2" />
                          )}
                          <span>Must include uppercase, lowercase, and number</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`${errors.confirmPassword || (confirmPassword && !passwordsMatch) ? 'border-red-500' : ''}`}
                    placeholder="Confirm password"
                    onBlur={() => trigger('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className='flex items-center gap-1 mt-1'>
                    <FaExclamationCircle className='text-red-600 text-xs flex-shrink-0' />
                    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                  </div>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={state.isLoading}
                  className={`w-full py-2 px-6 text-white rounded-md text-sm font-medium transition-all duration-200 ease-linear bg-gradient-to-r from-[rgba(222,69,97,1)] to-[rgba(224,56,84,1)] hover:from-[rgba(200,60,85,1)] hover:to-[rgba(202,50,75,1)] ${state.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {state.isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin mr-2 h-5 w-5 text-white"
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
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted mt-2 text-center">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-sm font-medium text-primary hover:text-primary/90">
                  Sign in
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
