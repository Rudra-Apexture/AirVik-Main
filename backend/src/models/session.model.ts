import mongoose, { Document, Schema } from 'mongoose';

// Session interface for TypeScript
export interface ISession {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session document interface extending Mongoose Document
export interface ISessionDocument extends ISession, Document {}

// Session schema definition
const sessionSchema = new Schema<ISessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
      unique: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: true
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      transform: function(doc, ret: any) {
        // Remove sensitive fields from JSON output
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

// Create indexes for better performance
sessionSchema.index({ userId: 1 });
sessionSchema.index({ refreshToken: 1 }, { unique: true });
sessionSchema.index({ expiresAt: 1 });

// Static method to find active session by refresh token
sessionSchema.statics.findByRefreshToken = function(refreshToken: string) {
  return this.findOne({
    refreshToken,
    isActive: true,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to find all active sessions for a user
sessionSchema.statics.findActiveSessionsByUserId = function(userId: mongoose.Types.ObjectId) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to deactivate all sessions for a user
sessionSchema.statics.deactivateAllUserSessions = function(userId: mongoose.Types.ObjectId) {
  return this.updateMany(
    { userId, isActive: true },
    { isActive: false }
  );
};

// Create and export the Session model
const Session = mongoose.model<ISessionDocument>('Session', sessionSchema);

export default Session;
