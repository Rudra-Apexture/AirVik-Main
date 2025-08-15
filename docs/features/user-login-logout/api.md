# User Login Logout API Documentation

This is CRITICAL - prevents API mismatches!

## User Login - POST /api/v1/auth/login

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (extend existing)
- Validation: Joi schema in controller file

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts` (extend existing)
- Component: `frontend/src/components/auth/LoginForm.tsx`

### Request:
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Email not verified. Please verify your email first.",
  "code": "EMAIL_NOT_VERIFIED"
}
```

## User Logout - POST /api/v1/auth/logout

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (extend existing)
- Middleware: `backend/src/middleware/auth.middleware.ts` (create new)

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts` (extend existing)
- Component: `frontend/src/components/layout/LogoutButton.tsx`

### Request:
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {},
  "message": "Logout successful"
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

## Refresh Token - POST /api/v1/auth/refresh-token

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (extend existing)

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts` (extend existing)
- Auto-called by HTTP interceptor on 401 responses

### Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Invalid or expired refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

## Data Models

### LoginRequest:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### LoginResponse:
```typescript
interface LoginResponse {
  success: true;
  data: {
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
  };
  message: string;
}
```

### LogoutRequest:
```typescript
interface LogoutRequest {
  refreshToken: string;
}
```

### RefreshTokenRequest:
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}
```

### RefreshTokenResponse:
```typescript
interface RefreshTokenResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
```

### ApiError:
```typescript
interface ApiError {
  success: false;
  error: string;
  code: string;
}
```
