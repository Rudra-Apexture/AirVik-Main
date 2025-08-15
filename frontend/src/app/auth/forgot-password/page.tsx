'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { requestPasswordReset } from '@/src/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FaExclamation, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'sonner';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordPageState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<ForgotPasswordPageState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
  } = useForm<ForgotPasswordFormData>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await requestPasswordReset(data.email);

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
              <h3 className="text-sm font-medium text-gray-900">Email Sent</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Password reset instructions have been sent to your email.</p>
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
        // Handle API error response
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to send reset email',
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
                <p>{response.error || 'Failed to send reset email. Please try again.'}</p>
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
            if (detail.toLowerCase().includes('email')) {
              setError('email', { type: 'manual', message: detail });
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

  if (state.isSuccess) {
  return (
      <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent>
              <div className="text-center space-y-5">
                <div className="mx-auto flex items-center justify-center flex-shrink-0">
                  <div className="flex items-center justify-center sm:size-14 size-12 rounded-full bg-green-100">
                    <FaExclamation className="text-green-600 text-xl" />
                  </div>
                </div>
                <h2 className="lg:text-2xl text-xl font-bold text-text">
                  Check Your Email
                </h2>
                <p className="text-muted">
                  We've sent password reset instructions to your email address.
                </p>
                <p className="text-sm text-muted">
                  Please check your inbox and follow the instructions to reset your password.
                </p>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-md text-sm font-medium transition-all ease-linear duration-75"
                  >
                    <Link href="/auth/login">
                      Back to Login
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setState(prev => ({ ...prev, isSuccess: false }))}
                    className="w-full py-4 px-6 text-sm rounded-md bg-gray-200 text-black/60 font-semibold transition-all duration-75 ease-linear"
                  >
                    Send Another Email
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
              <h2 className="sm:text-3xl text-2xl font-bold text-text capitalize">Forgot Password</h2>
              <p className="text-sm text-muted">Enter your email to receive reset instructions.</p>
            </div>

            <form method="post" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Enter your email address"
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
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Email'
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
