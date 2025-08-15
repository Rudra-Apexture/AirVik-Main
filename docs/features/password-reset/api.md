# Password Reset & JWT Token Refresh API Documentation

## CRITICAL - prevents API mismatches!

## Request Password Reset - POST /api/v1/auth/request-password-reset

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts`
- Service: `backend/src/services/auth/user-auth.service.ts`
- Route: `backend/src/routes/auth.routes.ts`
- Validation: Use existing validation patterns

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts`
- Component: `frontend/src/components/auth/ForgotPasswordForm.tsx`

### Request:
```json
{
  "email": "user@example.com"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent successfully"
  }
}
```

### Response Error (404):
```json
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

### Response Error (429):
```json
{
  "success": false,
  "error": "Too many requests",
  "code": "RATE_LIMITED"
}
```

---

## Reset Password - POST /api/v1/auth/reset-password

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts`
- Service: `backend/src/services/auth/user-auth.service.ts`
- Route: `backend/src/routes/auth.routes.ts`
- Validation: Password strength + token validation

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts`
- Component: `frontend/src/components/auth/ResetPasswordForm.tsx`

### Request:
```json
{
  "token": "abc123resettoken",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_RESET_TOKEN"
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": ["Passwords do not match"]
}
```

---

## JWT Token Refresh - POST /api/v1/auth/refresh-token (ALREADY EXISTS)

### Contract Agreement:
**NO CHANGES NEEDED - ALREADY IMPLEMENTED AND WORKING**

### Backend Implementation:
- ✅ Controller: `backend/src/controllers/auth/user-auth.controller.ts` (exists)
- ✅ Service: `backend/src/services/auth/user-auth.service.ts` (exists)
- ✅ Route: `backend/src/routes/auth.routes.ts` (exists)

### Frontend Usage:
- ✅ Service call: `frontend/src/services/auth.service.ts` (exists)
- ✅ Automatic token refresh logic (working)

### Request:
```json
{
  "refreshToken": "existing-refresh-token-here"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

---

## Common Error Response Format

All endpoints MUST use this exact error structure:

```json
{
  "success": false,
  "error": "Human readable message",
  "code": "ERROR_CODE",
  "details": ["optional", "validation", "errors"]
}
```

## HTTP Status Code Mapping

### Success Codes:
- 200: Password reset email sent
- 200: Password reset successfully
- 200: Token refreshed successfully

### Error Codes:
- 400: Validation errors, invalid tokens
- 404: Email not found, user not found
- 429: Rate limit exceeded
- 500: Internal server error

## Rate Limiting Rules

### Password Reset Endpoints:
- Max 3 requests per email per hour
- Max 5 requests per IP per hour
- Use existing rate limiting middleware patterns

### Token Refresh Endpoint:
- No rate limiting (already implemented securely)

## Validation Requirements

### Email Validation:
- Must be valid email format
- Must exist in database
- Case insensitive matching

### Token Validation:
- Must be valid reset token
- Must not be expired (15 minutes)
- Must not have been used already

### Password Validation:
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter  
- Must contain number
- confirmPassword must match newPassword

## Security Headers

All responses should include:
```
Content-Type: application/json
Cache-Control: no-store
X-Frame-Options: DENY
```

## Integration Notes

### Email Service:
- Reuse existing email transporter
- Follow existing template patterns
- Handle email sending failures gracefully

### Database Updates:
- Store reset token hashed
- Set expiry timestamp
- Invalidate token after use

### Frontend Integration:
- Handle all loading states
- Show appropriate error messages
- Redirect flows after success
- Auto-redirect if token expired
