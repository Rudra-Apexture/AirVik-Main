import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User, { IUser } from '../../models/user.model';

// Types for service functions
interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
}

interface RegisterResponse {
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

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate verification token with 24-hour expiry
export const generateVerificationToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'email_verification',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '24h',
  });
};

// Send verification email with HTML template
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  token: string
): Promise<ServiceResponse> => {
  try {
    const transporter = createEmailTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - AirVik Hotel System</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>AirVik Hotel System</h1>
                <p>Email Verification Required</p>
            </div>
            <div class="content">
                <h2>Welcome, ${firstName}!</h2>
                <p>Thank you for registering with AirVik Hotel System. To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
                <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
                <p>If you didn't create an account with AirVik, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 AirVik Hotel System. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textTemplate = `
    Welcome to AirVik Hotel System, ${firstName}!
    
    Thank you for registering. To complete your registration, please verify your email address by visiting:
    ${verificationUrl}
    
    This verification link will expire in 24 hours.
    
    If you didn't create an account with AirVik, please ignore this email.
    
    © 2025 AirVik Hotel System. All rights reserved.
    `;

    const mailOptions = {
      from: `"AirVik Hotel System" <${process.env.SMTP_FROM || 'noreply@airvik.com'}>`,
      to: email,
      subject: 'Verify Your Email Address - AirVik Hotel System',
      text: textTemplate,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      data: { message: 'Verification email sent successfully' },
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send verification email',
      code: 'EMAIL_SEND_ERROR',
    };
  }
};

// Register new user with password hashing and email verification
export const registerUser = async (userData: RegisterUserData): Promise<ServiceResponse<RegisterResponse>> => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = userData;

    // Validation
    const validationErrors: string[] = [];

    if (!firstName || firstName.length < 2 || firstName.length > 50) {
      validationErrors.push('First name must be between 2 and 50 characters');
    }

    if (!lastName || lastName.length < 2 || lastName.length > 50) {
      validationErrors.push('Last name must be between 2 and 50 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      validationErrors.push('Email format is invalid');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      validationErrors.push('Password must be at least 8 characters long with 1 uppercase, 1 lowercase, and 1 number');
    }

    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validationErrors,
      };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists',
        code: 'EMAIL_EXISTS',
      };
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const tempUserId = new Date().getTime().toString(); // Temporary ID for token generation
    const verificationToken = generateVerificationToken(tempUserId);
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      tokenExpiry,
    });

    const savedUser = await newUser.save();

    // Update token with actual user ID
    const actualToken = generateVerificationToken(String(savedUser._id));
    savedUser.emailVerificationToken = actualToken;
    await savedUser.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(savedUser.email, savedUser.firstName, actualToken);
    
    if (!emailResult.success) {
      // If email fails, we still return success for user creation but log the error
      console.error('Failed to send verification email:', emailResult.error);
    }

    // Prepare response
    const userResponse = {
      id: String(savedUser._id),
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      isEmailVerified: savedUser.isEmailVerified,
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
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
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
    if (user.isEmailVerified) {
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
    user.isEmailVerified = true;
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
      code: 'INTERNAL_ERROR',
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
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

    // Check if already verified
    if (user.isEmailVerified) {
      return {
        success: false,
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED',
      };
    }

    // Generate new verification token
    const newToken = generateVerificationToken(String(user._id));
    const newTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.emailVerificationToken = newToken;
    user.tokenExpiry = newTokenExpiry;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.firstName, newToken);
    
    if (!emailResult.success) {
      return {
        success: false,
        error: 'Failed to send verification email',
        code: 'EMAIL_SEND_ERROR',
      };
    }

    return {
      success: true,
      data: {
        message: 'Verification email sent successfully',
      },
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Export all functions
export const userAuthService = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  generateVerificationToken,
  sendVerificationEmail,
};

export default userAuthService;
