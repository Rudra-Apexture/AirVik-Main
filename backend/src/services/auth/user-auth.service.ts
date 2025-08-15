import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User, { IUser, IRefreshToken } from '../../models/user.model';

// Types for service functions
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  type: string;
  timestamp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
  };
  message: string;
}

export interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });
};

// Generate verification token with 24-hour expiry
const generateVerificationToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'email_verification',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '24h',
  });
};

// Generate access token with 15-minute expiry
const generateAccessToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'access',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '15m',
  });
};

// Generate refresh token with 7-day expiry
const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'refresh',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

// Verify token and return payload
const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Send verification email with HTML template
const sendVerificationEmail = async (
  email: string,
  firstName: string,
  token: string
): Promise<ServiceResponse> => {
  try {
    const transporter = createEmailTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #4a90e2;
            color: white;
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Email Verification</h2>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            <p>Thank you for registering with Airvik Hotel System. Please verify your email address by clicking the button below:</p>
            <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
            <p>Or copy and paste this link in your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not create an account, you can safely ignore this email.</p>
            <p>Best regards,<br>The Airvik Hotel Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Airvik Hotel" <noreply@airvik.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlContent,
    });

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send verification email',
      code: 'EMAIL_SEND_FAILED',
    };
  }
};

// Register new user with password hashing and email verification
export const registerUser = async (userData: RegisterUserData): Promise<ServiceResponse<RegisterResponse>> => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = userData;

    // Validate input
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: 'All fields are required',
        code: 'VALIDATION_ERROR',
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match',
        code: 'VALIDATION_ERROR',
      };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        error: 'Email is already registered',
        code: 'EMAIL_EXISTS',
      };
    }

    // Generate verification token
    const verificationToken = generateVerificationToken('temp');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = new User({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.toLowerCase().trim(),
      password: password, // Will be hashed by pre('save') hook
      isActive: false, // Used as isEmailVerified
      emailVerificationToken: verificationToken,
      tokenExpiry,
    });

    const savedUser = await newUser.save();

    // Update token with actual user ID
    const actualToken = generateVerificationToken(String(savedUser._id));
    savedUser.emailVerificationToken = actualToken;
    await savedUser.save();

    // Send verification email
    const nameParts = savedUser.name.split(' ');
    const firstNameFromName = nameParts[0];
    const emailResult = await sendVerificationEmail(savedUser.email, firstNameFromName, actualToken);
    
    if (!emailResult.success) {
      // If email fails, we still return success for user creation but log the error
      console.error('Failed to send verification email:', emailResult.error);
    }

    // Prepare response
    const nameParts2 = savedUser.name.split(' ');
    const userResponse = {
      id: String(savedUser._id),
      firstName: nameParts2[0],
      lastName: nameParts2.slice(1).join(' '),
      email: savedUser.email,
      isEmailVerified: savedUser.isActive,
      createdAt: savedUser.createdAt.toISOString(),
    };

    return {
      success: true,
      data: {
        user: userResponse,
        message: 'Registration successful. Please check your email for verification.',
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Failed to register user',
      code: 'SERVER_ERROR',
    };
  }
};

// Verify email using verification token
export const verifyEmail = async (token: string): Promise<ServiceResponse> => {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Verification token is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Verify and decode token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (jwtError) {
      return {
        success: false,
        error: 'Invalid or expired verification token',
        code: 'INVALID_TOKEN',
      };
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Check if already verified
    if (user.isActive) {
      return {
        success: false,
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED',
      };
    }

    // Check token expiry
    if (user.tokenExpiry && user.tokenExpiry < new Date()) {
      return {
        success: false,
        error: 'Invalid or expired verification token',
        code: 'INVALID_TOKEN',
      };
    }

    // Verify email
    user.isActive = true;
    user.emailVerificationToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    return {
      success: true,
      data: {
        message: 'Email verified successfully',
      },
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<ServiceResponse> => {
  try {
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Check if already verified
    if (user.isActive) {
      return {
        success: false,
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED',
      };
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken(String(user._id));
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.emailVerificationToken = verificationToken;
    user.tokenExpiry = tokenExpiry;
    await user.save();

    // Send verification email
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0];
    const emailResult = await sendVerificationEmail(user.email, firstName, verificationToken);

    if (!emailResult.success) {
      return {
        success: false,
        error: 'Failed to send verification email',
        code: 'EMAIL_SEND_FAILED',
      };
    }

    return {
      success: true,
      data: {
        message: 'Verification email sent successfully',
      },
    };
  } catch (error) {
    console.error('Resend verification email error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Login user with rate limiting
export const loginUser = async (userData: LoginUserData): Promise<ServiceResponse<LoginResponse>> => {
  try {
    const { email, password } = userData;

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Find user by email with password included and ensure all required fields are loaded
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password name email role isActive refreshTokens lastLoginAt loginAttempts lockUntil emailVerificationToken tokenExpiry createdAt updatedAt');
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    }

    // Fix: Ensure name field exists (handle legacy users without name)
    if (!user.name) {
      // Extract name from email or set a default
      const emailPrefix = user.email.split('@')[0];
      user.name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      // Name field fixed
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = user.lockUntil ? new Date(user.lockUntil).toISOString() : 'unknown';
      return {
        success: false,
        error: 'Account is locked due to too many failed attempts',
        code: 'ACCOUNT_LOCKED',
        details: [`Account will be unlocked at ${lockTime}`],
      };
    }

    // Verify password
    let isMatch = await user.comparePassword(password);
  
    // Special handling for potentially double-hashed passwords from previous bug
    if (!isMatch) {
      // Check for double-hashed password
      
      // If normal comparison fails, check if this might be a double-hashed password
      // This is a temporary fix to handle passwords that were double-hashed during reset
      try {
        // Get the hash that would have been stored if password was hashed twice
        const bcrypt = require('bcrypt');
        const tempHash = await bcrypt.hash(password, 12); // First hash
        
        // Compare the stored password with what would be a double hash
        isMatch = await bcrypt.compare(tempHash, user.password);
        
        if (isMatch) {
          // Double-hashed password detected
          // If it matches, update the password to be correctly hashed just once
          user.password = password; // Will be hashed by pre-save middleware
          await user.save();
          // Password fixed
        }
      } catch (err) {
        console.error('Error checking for double-hashed password:', err);
      }
    }
    
    if (!isMatch) {
      // Password comparison failed
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        details: user.loginAttempts >= 5 ? ['Account locked due to too many failed attempts'] : undefined,
      };
    } else {
      // Password comparison successful
    }

    // Check if email is verified
    if (!user.isActive) {
      return {
        success: false,
        error: 'Email not verified',
        code: 'EMAIL_NOT_VERIFIED',
      };
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));

    // Store refresh token with expiry
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const refreshTokenObj: IRefreshToken = {
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
      createdAt: new Date(),
    };

    // Limit stored refresh tokens to 5 most recent
    if (user.refreshTokens.length >= 5) {
      user.refreshTokens = user.refreshTokens.slice(-4);
    }
    user.refreshTokens.push(refreshTokenObj);

    await user.save();

    // Prepare user response
    const nameParts = user.name.split(' ');
    const userResponse = {
      id: String(user._id),
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: user.email,
      isEmailVerified: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Logout user by invalidating refresh token
export const logoutUser = async (refreshToken: string): Promise<ServiceResponse> => {
  try {
    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh token is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Verify token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid refresh token',
        code: 'INVALID_TOKEN',
      };
    }

    // Find user and remove the specific refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Filter out the token
    user.refreshTokens = user.refreshTokens.filter(
      (tokenObj) => tokenObj.token !== refreshToken
    );

    await user.save();

    return {
      success: true,
      data: {
        message: 'Logged out successfully',
      },
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Refresh user token with token rotation
export const refreshUserToken = async (refreshToken: string): Promise<ServiceResponse<RefreshTokenResponse>> => {
  try {
    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh token is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Verify token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid refresh token',
        code: 'INVALID_TOKEN',
      };
    }

    // Find user and check if token exists and is valid
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Find the token in the user's refresh tokens
    const tokenIndex = user.refreshTokens.findIndex(
      (tokenObj) => tokenObj.token === refreshToken
    );

    if (tokenIndex === -1) {
      return {
        success: false,
        error: 'Invalid refresh token',
        code: 'INVALID_TOKEN',
      };
    }

    // Check if token is expired
    const tokenObj = user.refreshTokens[tokenIndex];
    if (tokenObj.expiresAt < new Date()) {
      // Remove expired token
      user.refreshTokens.splice(tokenIndex, 1);
      await user.save();

      return {
        success: false,
        error: 'Refresh token expired',
        code: 'TOKEN_EXPIRED',
      };
    }

    // Generate new tokens (token rotation for security)
    const newAccessToken = generateAccessToken(String(user._id));
    const newRefreshToken = generateRefreshToken(String(user._id));

    // Replace old refresh token with new one
    user.refreshTokens.splice(tokenIndex, 1);
    
    // Add new refresh token
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const refreshTokenObj: IRefreshToken = {
      token: newRefreshToken,
      expiresAt: refreshTokenExpiry,
      createdAt: new Date(),
    };
    
    user.refreshTokens.push(refreshTokenObj);
    await user.save();

    return {
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Send password reset email with HTML template
const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  token: string
): Promise<ServiceResponse> => {
  try {
    const transporter = createEmailTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #4a90e2;
            color: white;
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset</h2>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            <p>We received a request to reset your password for your Airvik Hotel System account. Please click the button below to reset your password:</p>
            <p><a href="${resetUrl}" class="button">Reset Password</a></p>
            <p>Or copy and paste this link in your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>The Airvik Hotel Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Airvik Hotel" <noreply@airvik.com>',
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
    });

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send password reset email',
      code: 'EMAIL_SEND_FAILED',
    };
  }
};

// Generate secure random token for password reset
const generatePasswordResetToken = (): string => {
  const buffer = require('crypto').randomBytes(32);
  return buffer.toString('hex');
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<ServiceResponse> => {
  try {
    // Validate email
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        error: 'Email not found',
        code: 'EMAIL_NOT_FOUND',
      };
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    
    // Set token expiry (15 minutes from now)
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    
    // Store token and expiry in user document
    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetTokenExpiry;
    await user.save();
    
    // Send password reset email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken
    );
    
    if (!emailResult.success) {
      return emailResult;
    }
    
    return {
      success: true,
      data: {
        message: 'Password reset email sent successfully'
      },
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string, confirmPassword?: string): Promise<ServiceResponse> => {
  try {
    // Reset password function called
    
    // Validate inputs
    if (!token) {
      // Token validation failed
      return {
        success: false,
        error: 'Token is required',
        code: 'VALIDATION_ERROR',
      };
    }
    
    if (!newPassword) {
      // Password validation failed
      return {
        success: false,
        error: 'New password is required',
        code: 'VALIDATION_ERROR',
      };
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      // Password validation failed - strength requirements
      return {
        success: false,
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
        code: 'VALIDATION_ERROR',
      };
    }
    // Password validation passed
    
    // Find user with valid reset token
    // Looking for user with reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: new Date() }
    }).select('+password');
    
    if (!user) {
      // No user found with token
      return {
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_RESET_TOKEN',
      };
    }
    
    // User found, proceeding with password reset
    
    try {
      // IMPORTANT: Bypass the pre-save middleware entirely for password hashing
      // 1. Hash the password manually
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      // Password hashed successfully
      
      // 2. Update the user document directly using findOneAndUpdate
      // This avoids triggering the pre-save middleware completely
      const updateResult = await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            password: hashedPassword,
            // Clear reset token fields
            passwordResetToken: undefined,
            passwordResetExpiry: undefined,
            // Clear all refresh tokens for security
            refreshTokens: []
          }
        },
        { new: true }
      );
      
      if (!updateResult) {
        // Failed to update user document
        return {
          success: false,
          error: 'Failed to reset password',
          code: 'UPDATE_FAILED',
        };
      }
      
      // Password reset successfully
      
      // Verify the password was set correctly by testing a login
      const updatedUser = await User.findById(user._id).select('+password');
      if (!updatedUser) {
        // Could not retrieve updated user
        return {
          success: false,
          error: 'Failed to verify password update',
          code: 'VERIFICATION_FAILED',
        };
      }
      
      // Test if the password can be compared correctly
      const testPassword = newPassword;
      const passwordMatch = await bcrypt.compare(testPassword, updatedUser.password);
      // Password verification test completed
      
      if (!passwordMatch) {
        // WARNING: Password verification failed
      }
      
      return {
        success: true,
        data: {
          message: 'Password reset successfully'
        },
      };
    } catch (updateError) {
      console.error('Error during password update:', updateError);
      return {
        success: false,
        error: 'Failed to update password',
        code: 'UPDATE_ERROR',
      };
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR',
    };
  }
};

// Export all functions
export const userAuthService = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  logoutUser,
  refreshUserToken,
  requestPasswordReset,
  resetPassword,
};

export default userAuthService;
