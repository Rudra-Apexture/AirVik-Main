// AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY
// This contract defines the EXACT user model structure from user.model.ts
// ALL future development MUST use these exact field names and types

/**
 * CRITICAL NAMING RULES:
 * - MUST use "name" (NOT firstName/lastName separately in model)
 * - MUST use "isActive" (NOT isEmailVerified in model, though API uses isEmailVerified)
 * - MUST use "emailVerificationToken" (NOT verificationToken)
 * - MUST use "tokenExpiry" (NOT expiresAt or expiry)
 * - MUST use "refreshTokens" (plural, NOT refreshToken)
 * - MUST use "lastLoginAt" (NOT lastLogin)
 * - MUST use "loginAttempts" (NOT attempts or loginCount)
 * - MUST use "lockUntil" (NOT lockedUntil or accountLocked)
 */

// ============================================================================
// REFRESH TOKEN INTERFACE (EXACT FROM user.model.ts)
// ============================================================================

export interface IRefreshToken {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// ============================================================================
// USER INTERFACE (EXACT FROM user.model.ts)
// ============================================================================

export interface IUser {
  email: string;
  password: string;
  name: string;                           // MUST use "name" - stores "firstName lastName"
  role: string;                          // enum: 'user', 'admin', 'staff'
  isActive: boolean;                     // CRITICAL: Used as isEmailVerified in API responses
  emailVerificationToken?: string;      // MUST use emailVerificationToken
  tokenExpiry?: Date;                   // MUST use tokenExpiry
  passwordResetToken?: string;          // MUST use passwordResetToken
  passwordResetExpiry?: Date;           // MUST use passwordResetExpiry
  refreshTokens: IRefreshToken[];       // MUST be plural
  lastLoginAt?: Date;                   // MUST use lastLoginAt
  loginAttempts: number;                // MUST use loginAttempts
  lockUntil?: Date;                     // MUST use lockUntil
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// USER DOCUMENT INTERFACE (EXACT FROM user.model.ts)
// ============================================================================

export interface IUserDocument extends IUser {
  _id: string | mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
}

// ============================================================================
// SCHEMA FIELD DEFINITIONS (EXACT FROM user.model.ts)
// ============================================================================

export const USER_SCHEMA_FIELDS = {
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'staff'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerificationToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  },
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastLoginAt: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
} as const;

// ============================================================================
// SCHEMA OPTIONS (EXACT FROM user.model.ts)
// ============================================================================

export const USER_SCHEMA_OPTIONS = {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      // Remove sensitive fields from JSON output
      if ('password' in ret) delete ret.password;
      if ('__v' in ret) delete ret.__v;
      // Convert _id to id
      if ('_id' in ret) {
        ret.id = ret._id;
        delete ret._id;
      }
      return ret;
    }
  }
} as const;

// ============================================================================
// ROLE ENUM (EXACT FROM user.model.ts)
// ============================================================================

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  STAFF: 'staff'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ============================================================================
// METHOD SIGNATURES (EXACT FROM user.model.ts)
// ============================================================================

export interface UserModelMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
}

export interface UserModelStatics {
  findByEmailWithPassword(email: string): Promise<IUserDocument | null>;
  findByRole(role: string): Promise<IUserDocument[]>;
}

// ============================================================================
// API RESPONSE USER FORMAT (CRITICAL: Different from model!)
// ============================================================================

/**
 * CRITICAL: API responses split "name" into firstName/lastName
 * Model stores: name: "John Doe"
 * API returns: firstName: "John", lastName: "Doe"
 * 
 */
export interface ApiUserResponse {
  id: string;
  firstName: string;    // Extracted from name.split(' ')[0]
  lastName: string;     // Extracted from name.split(' ').slice(1).join(' ')
  email: string;
  isEmailVerified: boolean;  // CRITICAL: Uses isEmailVerified (from model.isActive)
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const USER_VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  BCRYPT_SALT_ROUNDS: 12
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - firstName, lastName (use "name" in model)
 * - isEmailVerified (use "isActive" in model)
 * - verificationToken (use "emailVerificationToken")
 * - expiresAt, expiry (use "tokenExpiry")
 * - refreshToken (use "refreshTokens" plural)
 * - lastLogin (use "lastLoginAt")
 * - attempts, loginCount (use "loginAttempts")
 * - lockedUntil, accountLocked (use "lockUntil")
 */
