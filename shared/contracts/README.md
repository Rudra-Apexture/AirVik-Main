# Authentication Contracts Documentation

**AUTO-GENERATED FROM EXISTING CODE - DO NOT MODIFY**

This directory contains comprehensive contract files that define the EXACT patterns, naming conventions, and structures used in the Airvik Hotel System authentication codebase. ALL future development MUST follow these contracts to prevent mismatches between frontend/backend and between different developers' AI implementations.

## 📋 Contract Files Overview

### 🗂️ Models
- **`models/user.contract.ts`** - User model structure, field names, and validation rules
  - Defines exact MongoDB schema fields
  - Covers user model vs API response differences
  - Includes method signatures and static methods

### 🔧 Services  
- **`services/auth-service.contract.ts`** - Service layer method signatures and patterns
  - Exact method names (registerUser, loginUser, etc.)
  - Request/response interfaces
  - Token generation and email service patterns

### 🌐 API
- **`api/auth-api.contract.ts`** - API endpoints, validation, and controller patterns
  - Exact endpoint paths (/api/v1/auth/*)
  - HTTP methods and status codes
  - Request/response validation rules

- **`api/response.contract.ts`** - Standardized API response format
  - Success response structure: `{ success: true, data: T }`
  - Error response structure: `{ success: false, error: string }`
  - HTTP status code mappings

### 🏷️ Types
- **`types/auth-types.contract.ts`** - TypeScript interfaces and type definitions
  - Form data interfaces
  - API request/response types
  - UI state and validation types
  - Hook return types

### 🛡️ Middleware
- **`middleware/auth-middleware.contract.ts`** - Authentication middleware patterns
  - JWT token validation
  - User attachment to request object
  - Error handling patterns

## 🚨 CRITICAL RULES

### 1. **EXACT NAMING COMPLIANCE**
- Use EXACT property names as defined in contracts
- Use EXACT method names as defined in contracts  
- Use EXACT interface names as defined in contracts
- Any deviation will cause integration failures

### 2. **MODEL vs API DIFFERENCES**
```typescript
// ❌ WRONG - Don't confuse model and API structures
// Model stores: { name: "John Doe", isActive: true }
// API returns: { firstName: "John", lastName: "Doe", isEmailVerified: true }

// ✅ CORRECT - Follow the exact pattern
// Model: IUser.name, IUser.isActive  
// API: User.firstName, User.lastName, User.isEmailVerified
```

### 3. **RESPONSE FORMAT CONSISTENCY**
```typescript
// ✅ CORRECT - Always use this exact format
{
  "success": true,
  "data": { /* actual data */ },
  "message": "optional message"
}

// ❌ WRONG - Don't use these variations
{ "status": "success", "result": data }
{ "ok": true, "payload": data }
```

### 4. **ERROR HANDLING STANDARDIZATION**
```typescript
// ✅ CORRECT - Always use this exact format
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": ["validation errors"]
}
```

## 📖 Usage in AI Prompts

When instructing AI to create new features, ALWAYS include these instructions:

### For Backend Development:
```
CRITICAL: Follow authentication contracts exactly:
- Import from: shared/contracts/models/user.contract.ts
- Import from: shared/contracts/services/auth-service.contract.ts  
- Import from: shared/contracts/api/auth-api.contract.ts
- Import from: shared/contracts/api/response.contract.ts

MUST use exact method names: registerUser, loginUser, verifyEmail, etc.
MUST use exact response format: { success: boolean, data?: T, error?: string }
MUST use exact field names: firstName/lastName in API, name in model
```

### For Frontend Development:
```
CRITICAL: Follow authentication contracts exactly:
- Import from: shared/contracts/types/auth-types.contract.ts
- Import from: shared/contracts/api/auth-api.contract.ts
- Import from: shared/contracts/api/response.contract.ts

MUST use exact interface names: RegisterUserRequest, LoginResponse, etc.
MUST use exact API endpoints: /api/v1/auth/register, /api/v1/auth/login
MUST handle exact response format with success boolean field
```

### For New Authentication Features:
```
CRITICAL: Before implementing ANY auth-related feature:
1. Read ALL contract files in shared/contracts/
2. Use EXACT patterns from existing contracts
3. Follow EXACT naming conventions
4. Use EXACT response formats
5. Test against existing API contracts

DO NOT create new patterns - extend existing ones following the same structure.
```

## 🔍 Key Naming Patterns Summary

### Model Field Names (Backend)
- `name` (stores "firstName lastName")
- `isActive` (represents email verification status)
- `emailVerificationToken` 
- `tokenExpiry`
- `refreshTokens` (plural)
- `lastLoginAt`
- `loginAttempts`
- `lockUntil`

### API Field Names (Frontend/Backend Interface)
- `firstName` / `lastName` (split from model.name)
- `isEmailVerified` (from model.isActive)
- `accessToken` / `refreshToken`
- `createdAt` / `updatedAt`

### Method Names
- `registerUser()` (NOT register, signUp, createUser)
- `loginUser()` (NOT login, signIn, authenticate)
- `verifyEmail()` (NOT verify, confirmEmail)
- `logoutUser()` (NOT logout, signOut)
- `refreshUserToken()` (NOT refreshToken, renewToken)

### API Endpoints
- `/api/v1/auth/register`
- `/api/v1/auth/login`
- `/api/v1/auth/verify-email`
- `/api/v1/auth/resend-verification`
- `/api/v1/auth/logout`
- `/api/v1/auth/refresh-token`

### Middleware Names
- `verifyAccessToken()` (NOT authenticate, checkAuth)
- `requireAuth()` (NOT protect, secured)
- `req.user` (NOT req.currentUser, req.authenticatedUser)

## ⚠️ Common Mistakes to Avoid

### ❌ Field Name Mistakes
```typescript
// DON'T USE:
firstName, lastName  // in model (use "name")
isEmailVerified      // in model (use "isActive") 
name                 // in API (use firstName/lastName)
refreshToken         // in model (use "refreshTokens" plural)
```

### ❌ Method Name Mistakes  
```typescript
// DON'T USE:
register()     // use registerUser()
login()        // use loginUser()
authenticate() // use loginUser()
verify()       // use verifyEmail()
logout()       // use logoutUser()
```

### ❌ Response Format Mistakes
```typescript
// DON'T USE:
{ status: "success" }     // use { success: true }
{ ok: true }              // use { success: true }
{ result: data }          // use { data: data }
{ message: "error" }      // use { error: "message" }
```

### ❌ API Endpoint Mistakes
```typescript
// DON'T USE:
/auth/signup         // use /api/v1/auth/register
/api/auth/signin     // use /api/v1/auth/login  
/verify              // use /api/v1/auth/verify-email
```

## 🔄 Contract Updates

These contracts are auto-generated from existing code. When the authentication system evolves:

1. **Update the source code first**
2. **Regenerate contracts from the updated code**  
3. **Update documentation accordingly**
4. **Ensure all developers use updated contracts**

**NEVER manually edit contract files** - they must always reflect the actual implementation.

## 📞 Integration Testing

Before deploying any authentication-related code:

1. ✅ Verify all field names match contracts
2. ✅ Verify all method names match contracts
3. ✅ Verify all API endpoints match contracts
4. ✅ Verify all response formats match contracts  
5. ✅ Test frontend/backend integration
6. ✅ Run API contract tests

## 🤝 Developer Collaboration

When multiple developers work on authentication features:

1. **Share this README with all developers**
2. **Require contract compliance in code reviews**
3. **Use contracts as single source of truth**
4. **Resolve conflicts by updating contracts, not code**
5. **Keep contracts in sync across all repositories**

---

**Remember: Consistency is key to preventing integration failures. When in doubt, check the contracts first!**
