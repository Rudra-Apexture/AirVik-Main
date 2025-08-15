'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { registerUser } from '@/src/services/auth.service';
import type { RegistrationFormData, ApiResponse, User } from '@/src/types/auth.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { FaCheck, FaCheckCircle, FaExclamation, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { Check, CircleCheckBig, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterPageState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  registeredEmail: string | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [state, setState] = useState<RegisterPageState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    registeredEmail: null,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    setError,
    trigger,
    getValues,
  } = useForm<RegistrationFormData>({
    mode: 'onSubmit',
  });

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if passwords match
  const passwordsMatch = password === confirmPassword;

  // Password validation rules
  const hasMinLength = password?.length >= 8;
  const hasUppercase = /[A-Z]/.test(password || '');
  const hasLowercase = /[a-z]/.test(password || '');
  const hasNumber = /[0-9]/.test(password || '');
  const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password || '');
  const hasAllRequiredChars = hasUppercase && hasLowercase && hasNumber;
  const emailPrefix = watch('email')?.split('@')[0]?.toLowerCase() || '';
  const firstName = watch('firstName')?.toLowerCase() || '';
  const lastName = watch('lastName')?.toLowerCase() || '';
  const passwordLower = password?.toLowerCase() || '';

  // Only check for personal info if there's a password
  const hasNoPersonalInfo = !password || (
    (!emailPrefix || !passwordLower.includes(emailPrefix)) &&
    (!firstName || !passwordLower.includes(firstName)) &&
    (!lastName || !passwordLower.includes(lastName))
  );

  // Only show error state if there's content and it violates the rule
  const showPersonalInfoError = password && !hasNoPersonalInfo;

  // All validations must pass for password to be considered valid
  const isPasswordValid = hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    (hasNumber || hasSpecialChar) &&
    hasNoPersonalInfo;

  // Show validation messages if the password field has content
  const showValidation = password.length > 0;

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    // Using react-hook-form's handleSubmit already prevents default form submission
    setIsSubmitted(true);
    
    // Trigger validation for all fields including checkbox
    const isValid = await trigger();
    if (!isValid) {
      return; // Don't proceed if validation fails
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await registerUser(data);

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          registeredEmail: data.email,
        }));
      } else {
        // Handle API error response
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
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
                <p>{response.error || 'Registration failed. Please try again.'}</p>
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
            icon: null, // Explicitly set to null to prevent default icon
          }
        );

        // Handle validation errors
        if (response.code === 'VALIDATION_ERROR' && response.details) {
          response.details.forEach((detail: string) => {
            if (detail.toLowerCase().includes('email')) {
              setError('email', { type: 'manual', message: detail });
            } else if (detail.toLowerCase().includes('password')) {
              setError('password', { type: 'manual', message: detail });
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
    }
  };

  const handleResendVerification = async () => {
    if (!state.registeredEmail) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { resendVerification } = await import('@/src/services/auth.service');
      const response = await resendVerification({ email: state.registeredEmail });

      if (response.success) {
        setState(prev => ({ ...prev, isLoading: false }));
        toast.success(
          <div className="flex items-start p-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center size-10 rounded-full bg-green-500">
                <FaCheck className="text-white text-lg" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Email Sent</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Verification email has been resent successfully.</p>
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
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to resend verification email',
        }));

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
                <p>{response.error || 'Failed to resend verification email. Please try again.'}</p>
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
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Could not resend verification email. Please try again.',
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
              <p>Network error. Could not resend verification email. Please try again.</p>
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

  const areAllFieldsFilled = () => {
    if (isSubmitted) {
      const values = getValues();
      return values.firstName &&
        values.lastName &&
        values.email &&
        values.password &&
        values.confirmPassword &&
        values.password === values.confirmPassword &&
        values.terms;
    }
    return true; // Return true by default to keep button enabled
  };

  if (state.isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className=''>
            <CardContent>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center rounded-full mb-4">
                  <CircleCheckBig className="size-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-4">
                  Registration Successful!
                </h2>
                <p className="text-sm text-muted mb-6">
                  We've sent a verification email to{' '}
                  <span className="font-medium text-text">{state.registeredEmail}</span>{' '}
                  Please check your inbox and click the verification link to activate your account.
                </p>

                <div className="space-y-4">
                  <Button
                    onClick={handleResendVerification}
                    disabled={state.isLoading}
                    variant="outline"
                    className="w-full py-4 px-6 text-sm rounded-md font-medium transition-all duration-75 ease-linear"
                  >
                    {state.isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Button>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-md text-sm font-medium transition-all ease-linear duration-75"
                  >
                    <Link href="/auth/login">
                      Go to Login
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

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent>
            <div className="mb-8 space-y-1 text-center">
              <h2 className="sm:text-3xl text-2xl font-bold text-text capitalize">Create your account</h2>
              <p className="text-sm text-muted">Your next experience begins here.</p>
            </div>

            <form method="post" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-5">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-base font-medium text-text">
                    First Name
                  </label>
                  <div>
                    <Input
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' },
                        maxLength: { value: 50, message: 'First name must be less than 50 characters' },
                      })}
                      type="text"
                      autoComplete="given-name"
                      className={errors.firstName ? 'border-red-500' : ''}
                      placeholder="First name"
                      onBlur={() => trigger('firstName')}
                    />
                    {errors.firstName && (
                      <div className='flex items-center gap-1 mt-1'>
                        <FaExclamationCircle className='text-red-600 text-xs flex-shrink-0' />
                        <p className="text-xs text-red-600">{errors.firstName.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-base font-medium text-text">
                    Last Name
                  </label>
                  <div>
                    <Input
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                        maxLength: { value: 50, message: 'Last name must be less than 50 characters' },
                      })}
                      type="text"
                      autoComplete="family-name"
                      className={errors.lastName ? 'border-red-500' : ''}
                      placeholder="Last name"
                      onBlur={() => trigger('lastName')}
                    />
                    {errors.lastName && (
                      <div className='flex items-center gap-1 mt-1'>
                        <FaExclamationCircle className='text-red-600 text-xs flex-shrink-0' />
                        <p className="text-xs text-red-600">{errors.lastName.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-base font-medium text-text">
                  Email Address
                </label>
                <div>
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    autoComplete="email"
                                          className={errors.email ? 'border-red-500' : ''}
                    placeholder="Email"
                    onBlur={() => trigger('email')}
                  />
                  {errors.email && (
                    <div className='flex items-center gap-1 mt-1'>
                      <FaExclamationCircle className='text-red-600 text-xs flex-shrink-0' />
                      <p className="text-xs text-red-600">{errors.email.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-base font-medium text-text">
                    Password
                  </label>
                </div>
                                <div className="relative">
                  <Input
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    autoComplete="new-password"
                    className={`${errors.password ? 'border-red-500' : ''} pr-12`}
                    onFocus={() => {
                      setIsPasswordFocused(true);
                    }}
                    onBlur={() => {
                      setIsPasswordFocused(false);
                      trigger('password');
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

                {errors.password && (
                  <div className='flex items-center gap-1 mt-1'>
                    <FaExclamationCircle className='text-red-600 text-xs flex-shrink-0' />
                    <p className="text-xs text-red-600">{errors.password.message}</p>
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
                        <div className={`flex items-center text-sm ${!password ? 'text-red-600' : hasNoPersonalInfo ? 'text-green-600' : 'text-red-600'}`}>
                          {!password ? (
                            <FaTimesCircle className="h-4 w-4 text-red-500 font-medium mr-2" />
                          ) : hasNoPersonalInfo ? (
                            <FaCheckCircle className="h-4 w-4 text-green-500 font-medium mr-2" />
                          ) : (
                            <FaTimesCircle className="h-4 w-4 text-red-500 font-medium mr-2" />
                          )}
                          <span>Can't contain your name or email address</span>
                        </div>
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

                            {/* Confirm Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="confirmPassword" className="block text-base font-medium text-text">
                    Confirm Password
                  </label>
                </div>
                <div className="relative">
                  <Input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`${errors.confirmPassword || (confirmPassword && !passwordsMatch) ? 'border-red-500' : ''} pr-12`}
                    placeholder="Confirm password"
                    onFocus={() => setHasInteracted(true)}
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

              <div className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  id="terms" 
                  {...register('terms', {
                    required: 'You must agree to the terms and conditions',
                    validate: (value) => value === true || 'You must agree to the terms and conditions',
                  })}
                  className={errors.terms ? 'border-red-500' : ''}
                />
                <Label htmlFor="terms" className="text-sm font-medium text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/privacy-policy" className='text-primary font-medium underline'>
                    Privacy Policy
                  </Link>
                  {' '}and{' '}
                  <Link href="/terms" className='text-primary font-medium underline'>
                    Terms of Service
                  </Link>
                </Label>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={state.isLoading}
                  className={`w-full py-4 px-6 text-white rounded-md text-sm font-medium transition-all duration-200 ease-linear bg-gradient-to-r from-[rgba(222,69,97,1)] to-[rgba(224,56,84,1)] hover:from-[rgba(200,60,85,1)] hover:to-[rgba(202,50,75,1)] ${state.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t " />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or Sign in with
                  </span>
                </div>
              </div>

              <div>
                <Button variant="outline" type="button" className="w-full my-2 py-4 px-6 bg-gray-300/60 border-0">
                  <FcGoogle className="mr-2" size={28} />
                  <span className='text-sm font-medium'>Sign in with Google</span>
                </Button>
              </div>

              <p className="text-sm text-muted mt-2 text-center">
                Already have an account?{' '}
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
