# User Login Logout Feature Specification

## Feature Overview
This feature implements secure user authentication with login and logout functionality for the Airvik Hotel System. It extends the existing user registration system to provide complete authentication flow with JWT tokens and session management.

## VikBooking Analysis
**Reference file found:** `vikbooking/site/class/login_sasl_client.php`
- Standard email/password authentication pattern
- Session-based authentication approach
- Security considerations for hotel booking systems

## User Flow

### Login Flow:
1. User navigates to `/auth/login` page
2. User enters email and password
3. System validates credentials against registered users
4. System checks if email is verified
5. System generates JWT access token (15 minutes) and refresh token (7 days)
6. User is redirected to dashboard with tokens stored securely
7. All subsequent API calls include access token in Authorization header

### Logout Flow:
1. User clicks logout button from any authenticated page
2. System invalidates refresh token on backend
3. Frontend clears all stored tokens
4. User is redirected to login page
5. All protected routes become inaccessible

### Token Refresh Flow:
1. When access token expires (15 minutes), API returns 401
2. Frontend automatically attempts refresh using refresh token
3. Backend validates refresh token and issues new tokens
4. Original request is retried with new access token
5. If refresh fails, user is logged out automatically

## API Endpoints

### POST /api/v1/auth/login
- **Purpose**: Authenticate user and issue tokens
- **Input**: email, password
- **Output**: user data, accessToken, refreshToken
- **Validation**: email format, password required, email verified

### POST /api/v1/auth/logout  
- **Purpose**: Invalidate refresh token and clear session
- **Input**: refreshToken (body), accessToken (header)
- **Output**: success message
- **Authorization**: Required (Bearer token)

### POST /api/v1/auth/refresh-token
- **Purpose**: Issue new tokens using refresh token
- **Input**: refreshToken
- **Output**: new accessToken and refreshToken
- **Security**: Validates refresh token signature and expiry

## Database Schema

### Extend User Model:
The existing `User` model will be extended with:
```typescript
// Already exists in user.model.ts:
// - _id, firstName, lastName, email, password, isEmailVerified
// - emailVerificationToken, emailVerificationExpires
// - createdAt, updatedAt

// Need to add:
refreshTokens: [{
  token: string;
  expiresAt: Date;
  createdAt: Date;
}]
lastLoginAt: Date;
loginAttempts: number;
lockUntil: Date;
```

## Validation Rules

### Login Request:
- **email**: required, valid email format, lowercase
- **password**: required, minimum 1 character (already validated during registration)

### Logout Request:
- **refreshToken**: required, valid JWT format
- **Authorization header**: required, valid Bearer token

### Refresh Token Request:
- **refreshToken**: required, valid JWT format, not expired, exists in user's refreshTokens array

## File Structure (Max 400 lines each)

### Backend Files:
- **Extend**: `backend/src/services/auth/user-auth.service.ts` - Add login, logout, refreshToken methods
- **Extend**: `backend/src/controllers/auth/user-auth.controller.ts` - Add login, logout, refreshToken controllers
- **Extend**: `backend/src/routes/auth.routes.ts` - Add new routes
- **Create**: `backend/src/middleware/auth.middleware.ts` - JWT verification middleware
- **Extend**: `backend/src/models/user.model.ts` - Add refresh token fields

### Frontend Files:
- **Extend**: `frontend/src/types/auth.types.ts` - Add login/logout types
- **Extend**: `frontend/src/services/auth.service.ts` - Add login/logout API calls
- **Create**: `frontend/src/components/auth/LoginForm.tsx` - Login form component
- **Create**: `frontend/src/app/auth/login/page.tsx` - Login page
- **Create**: `frontend/src/components/layout/LogoutButton.tsx` - Logout component
- **Create**: `frontend/src/hooks/useAuth.ts` - Authentication hook

### Testing Files:
- **Extend**: `postman/user-registration-email-verification.postman_collection.json` - Add login/logout tests

## Security Considerations

### Token Security:
- Access tokens: 15-minute expiry, stored in memory only
- Refresh tokens: 7-day expiry, stored in httpOnly cookies
- JWT secret from environment variables
- Refresh token rotation on each use

### Rate Limiting:
- Login attempts: Max 5 attempts per 15 minutes per email
- Account lockout: 15 minutes after 5 failed attempts
- Refresh token calls: Max 10 per minute per user

### Input Validation:
- All inputs sanitized and validated
- SQL injection prevention via Mongoose
- XSS prevention via input validation
- CSRF protection via proper CORS configuration
