# Password Reset & JWT Token Refresh Feature Specification

## Feature Overview
Password Reset (1.5) allows users to securely reset their forgotten passwords via email verification. JWT Token Refresh (1.6) is already implemented and working - no changes needed.

## VikBooking Analysis
**Existing Infrastructure Found:**
- ✅ User authentication system with email verification
- ✅ JWT token system with access/refresh tokens  
- ✅ Email service with nodemailer configuration
- ✅ Rate limiting middleware for auth endpoints
- ✅ Password hashing with bcrypt
- ✅ MongoDB user model with token fields

## User Flow

### Password Reset Flow:
1. User clicks "Forgot Password" on login page
2. User enters email address
3. System validates email exists
4. System generates secure reset token (15-minute expiry)
5. System sends email with reset link
6. User clicks link in email → redirected to reset password page
7. User enters new password + confirm password
8. System validates token and updates password
9. User redirected to login page with success message

### JWT Token Refresh Flow (Already Working):
1. Frontend detects access token near expiry
2. Frontend automatically calls refresh endpoint
3. Backend validates refresh token
4. Backend returns new access + refresh tokens
5. Frontend stores new tokens and retries original request

## API Endpoints

### Password Reset (New):
- `POST /api/v1/auth/request-password-reset` - Send reset email
- `POST /api/v1/auth/reset-password` - Update password with token

### JWT Token Refresh (Existing):
- `POST /api/v1/auth/refresh-token` - Refresh expired tokens

## Database Schema Extensions

### User Model Extensions (extend existing):
```typescript
interface IUser {
  // ... existing fields ...
  passwordResetToken?: string;      // MUST use exact name
  passwordResetExpiry?: Date;       // MUST use exact name
}
```

## Validation Rules

### Request Password Reset:
- **email**: required, valid email format, must exist in database

### Reset Password:
- **token**: required, valid reset token, not expired
- **newPassword**: required, min 8 chars, must contain uppercase/lowercase/number
- **confirmPassword**: required, must match newPassword

### Token Refresh (existing):
- **refreshToken**: required, valid refresh token, not expired

## File Structure

### Backend Extensions (max 400 lines each):
- `backend/src/models/user.model.ts` - Add reset token fields to schema
- `backend/src/services/auth/user-auth.service.ts` - Add requestPasswordReset, resetPassword methods
- `backend/src/controllers/auth/user-auth.controller.ts` - Add reset endpoints
- `backend/src/routes/auth.routes.ts` - Add reset routes with rate limiting

### Frontend (max 400 lines each):
- `frontend/src/types/auth.types.ts` - Add reset interfaces
- `frontend/src/services/auth.service.ts` - Add reset API methods
- `frontend/src/components/auth/PasswordResetForm.tsx` - Reset form component
- `frontend/src/app/auth/forgot-password/page.tsx` - Request reset page
- `frontend/src/app/auth/reset-password/page.tsx` - Reset password page

### Testing:
- Extend existing Postman collection with reset endpoints
- Newman CLI tests for automated testing

## Security Requirements

### Password Reset Token:
- Cryptographically secure random token
- 15-minute expiry time
- Single-use only (invalidated after use)
- Stored hashed in database

### Rate Limiting:
- Max 3 reset requests per email per hour
- Max 5 reset attempts per IP per hour

### Email Security:
- Reset link contains token, not user ID
- HTTPS-only reset URLs
- Email template shows partial email for confirmation

## Integration Points

### Email Service:
- Reuse existing email transporter configuration
- Follow existing email template patterns
- Use same error handling as email verification

### Authentication System:
- Integrate with existing rate limiting
- Follow same response format patterns
- Use existing password hashing utilities

### Frontend Integration:
- Link from login page to forgot password
- Handle all error states with user feedback
- Redirect flows after successful reset

## Success Criteria
- [ ] User can request password reset via email
- [ ] Reset email sent within 30 seconds
- [ ] Reset link works and expires after 15 minutes
- [ ] Password successfully updated with new secure password
- [ ] User can login with new password immediately
- [ ] All error cases handled gracefully
- [ ] Rate limiting prevents abuse
- [ ] JWT token refresh continues working unchanged
