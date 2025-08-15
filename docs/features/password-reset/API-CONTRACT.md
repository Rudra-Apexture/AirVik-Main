# Password Reset & JWT Token Refresh API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### Request Password Reset - POST /api/v1/auth/request-password-reset
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/request-password-reset
- Request Body:
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent successfully"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
- Handle loading states during email sending

---

### Reset Password - POST /api/v1/auth/reset-password
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/reset-password
- Request Body:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_RESET_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- Handle token validation errors
- Redirect to login on success

---

### JWT Token Refresh - POST /api/v1/auth/refresh-token (ALREADY EXISTS)
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/refresh-token  
- Request Body:
```json
{
  "refreshToken": "existing-refresh-token"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

**NOTE:** This endpoint is already implemented and working. No changes needed.

## CRITICAL VALIDATION RULES:
- Email: required, valid email format
- Token: required, string
- NewPassword: required, min 8 chars, must contain uppercase, lowercase, number
- ConfirmPassword: required, must match newPassword
- RefreshToken: required, string

## ERROR CODES TO HANDLE:
- VALIDATION_ERROR (400)
- EMAIL_NOT_FOUND (404) 
- INVALID_RESET_TOKEN (400)
- EXPIRED_RESET_TOKEN (400)
- RESET_TOKEN_USED (400)
- EMAIL_SEND_ERROR (400)
- INVALID_REFRESH_TOKEN (400)
- RATE_LIMITED (429)

## SUCCESS STATUS CODES:
- REQUEST_PASSWORD_RESET: 200
- RESET_PASSWORD: 200
- REFRESH_TOKEN: 200
