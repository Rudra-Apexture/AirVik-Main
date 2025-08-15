import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Refresh token interface
export interface IRefreshToken {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// User interface for TypeScript
export interface IUser {
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean; // Used as isEmailVerified in API responses
  emailVerificationToken?: string; // For email verification
  tokenExpiry?: Date; // For token expiration
  passwordResetToken?: string; // For password reset
  passwordResetExpiry?: Date; // For password reset token expiration
  refreshTokens: IRefreshToken[];
  lastLoginAt?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User document interface extending Mongoose Document
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
}

// User schema definition
const userSchema = new Schema<IUserDocument>(
  {
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
      select: false // Don't include password in queries by default
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
    passwordResetToken: {
      type: String
    },
    passwordResetExpiry: {
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      transform: function(doc, ret: any) {
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
  }
);

// Create unique index on email field
userSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to check if account is locked
userSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Static method to find user by email with password field
userSchema.statics.findByEmailWithPassword = function(email: string) {
  return this.findOne({ email }).select('+password');
};

// Static method to find user by role
userSchema.statics.findByRole = function(role: string) {
  return this.find({ role });
};

// Create and export the User model
const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
