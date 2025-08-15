# User Login Logout API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### User Login
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/login
- Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isEmailVerified": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "Login successful"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Email not verified. Please verify your email first.",
  "code": "EMAIL_NOT_VERIFIED"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
- Store accessToken and refreshToken securely
- Redirect to dashboard on success

### User Logout
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/logout
- Headers: Authorization: Bearer {accessToken}
- Request Body:
```json
{
  "refreshToken": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Logout successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- Clear all stored tokens
- Redirect to login page on success

### Refresh Token
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/refresh-token
- Request Body:
```json
{
  "refreshToken": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid or expired refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- Update stored tokens
- Retry original request with new token
