"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "@/src/services/auth.service";
import type { LoginFormData } from "@/src/types/auth.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaExclamation, FaExclamationCircle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface LoginPageState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function LoginPage() {
  const router = useRouter();
  const [state, setState] = useState<LoginPageState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    trigger,
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await loginUser(data);

      if (response.success) {
        setState((prev) => ({
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
              <h3 className="text-sm font-medium text-gray-900">
                Login Successful
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Welcome back! Redirecting to dashboard...</p>
              </div>
            </div>
          </div>,
          {
            duration: 3000,
            className: "p-4 bg-white",
            style: {
              border: "1px solid #DDDDDD",
              borderRadius: "0.75rem",
              boxShadow:
                "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              padding: "1rem",
            },
            icon: null,
          }
        );

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        // Handle API error response
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || "Login failed",
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
              <h3 className="text-sm font-medium text-gray-900">
                Let's try that again
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>
                  {response.error ||
                    "Login failed. Please check your credentials and try again."}
                </p>
              </div>
            </div>
          </div>,
          {
            duration: 4000,
            className: "p-4 bg-white",
            style: {
              border: "1px solid #DDDDDD",
              borderRadius: "0.75rem",
              boxShadow:
                "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              padding: "1rem",
            },
            icon: null,
          }
        );

        // Handle validation errors
        if (response.code === "VALIDATION_ERROR" && response.details) {
          response.details.forEach((detail: string) => {
            if (detail.toLowerCase().includes("email")) {
              setError("email", { type: "manual", message: detail });
            } else if (detail.toLowerCase().includes("password")) {
              setError("password", { type: "manual", message: detail });
            }
          });
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Network error. Please check your connection and try again.",
      }));

      toast.error(
        <div className="flex items-start p-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center size-10 rounded-full bg-red-500">
              <FaExclamation className="text-white text-lg" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              Connection Error
            </h3>
            <div className="mt-1 text-sm text-gray-500">
              <p>Network error. Please check your connection and try again.</p>
            </div>
          </div>
        </div>,
        {
          duration: 4000,
          className: "p-4 bg-white",
          style: {
            border: "1px solid #DDDDDD",
            borderRadius: "0.75rem",
            boxShadow:
              "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            padding: "1rem",
          },
          icon: null,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center lg:py-10 py-5 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent>
            <div className="mb-8 space-y-1 text-center">
              <h2 className="sm:text-3xl text-2xl font-bold text-text capitalize">
                Welcome back
              </h2>
              <p className="text-sm text-muted">
                Sign in to your account to continue.
              </p>
            </div>
            <form
              method="post"
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-text"
                >
                  Email Address
                </label>
                <div>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="Email"
                    onBlur={() => trigger("email")}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <FaExclamationCircle className="text-red-600 text-xs flex-shrink-0" />
                      <p className="text-xs text-red-600">
                        {errors.email.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-base font-medium text-text"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    className={`${errors.password ? "border-red-500" : ""} pr-12`}
                    onBlur={() => trigger("password")}
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
                  <div className="flex items-center gap-1 mt-1">
                    <FaExclamationCircle className="text-red-600 text-xs flex-shrink-0" />
                    <p className="text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* Forgot Password Link */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox id="remember" />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Remember me
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:text-primary/90 font-medium underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={state.isLoading}
                  className={`w-full py-4 px-6 text-white rounded-md text-sm font-medium transition-all duration-200 ease-linear bg-gradient-to-r from-[rgba(222,69,97,1)] to-[rgba(224,56,84,1)] hover:from-[rgba(200,60,85,1)] hover:to-[rgba(202,50,75,1)] ${
                    state.isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
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
                  <span className="text-sm font-medium">
                    Sign in with Google
                  </span>
                </Button>
        </div>

              <p className="text-sm text-muted mt-2 text-center">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-primary hover:text-primary/90"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
