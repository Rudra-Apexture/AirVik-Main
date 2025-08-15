# Task Prompts for Password Reset & JWT Token Refresh

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

<!-- ## Backend Task B1: Extend MongoDB User Model
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Read and analyze: /Airvik-Main/Airvik-Improved/shared/contracts/models/user.contract.ts
- Read and analyze: /Airvik-Main/Airvik-Improved/backend/src/models/user.model.ts

List what you found to prove you read them.

CONTEXT:
You are implementing Password Reset feature. JWT Token Refresh already exists - DO NOT TOUCH IT.
The developer using this is a beginner who only copies prompts.

YOUR TASK:
Extend existing MongoDB user model with password reset token fields

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/backend/src/models/user.model.ts (MAXIMUM 400 lines)

REQUIREMENTS FROM CONTRACTS:
- Must add passwordResetToken: String (optional)
- Must add passwordResetExpiry: Date (optional)  
- Follow exact same pattern as emailVerificationToken and tokenExpiry
- Use exact field names from user.contract.ts

CODE STRUCTURE:
- Extend existing schema definition
- Add fields to USER_SCHEMA_FIELDS object
- Follow existing patterns exactly
- Do NOT create new files

DO NOT:
- Create any new files
- Exceed 400 lines
- Change existing JWT token refresh functionality
- Add fields not specified in contracts

GIT OPERATIONS:
After modifying successfully:
cd /Airvik-Main/Airvik-Improved
git add backend/src/models/user.model.ts
git commit -m "feat(password-reset): extend user model with reset token fields"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ Extended backend/src/models/user.model.ts - Added passwordResetToken and passwordResetExpiry fields
- Update "Next Task": B2
- Add to "Git Status": Last commit hash and message
Update /Airvik-Main/Airvik-Improved/docs/features/password-reset/progress.md task checklist

TEST YOUR WORK:
The developer will test by checking MongoDB accepts new fields
``` -->
<!-- 
## Backend Task B2: Extend Auth Service Layer
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Confirm user model was extended in B1
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Read and analyze: /Airvik-Main/Airvik-Improved/shared/contracts/services/auth-service.contract.ts
- Read and analyze: /Airvik-Main/Airvik-Improved/backend/src/services/auth/user-auth.service.ts

YOUR TASK:
Extend existing auth service with password reset business logic methods

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/backend/src/services/auth/user-auth.service.ts (MAXIMUM 400 lines)

REQUIREMENTS FROM CONTRACTS:
- Add requestPasswordReset(email: string): Promise<ServiceResponse>
- Add resetPassword(token: string, newPassword: string): Promise<ServiceResponse>
- Use exact method names from auth-service.contract.ts
- Follow existing email sending patterns (reuse createEmailTransporter, follow sendVerificationEmail pattern)
- Follow existing token generation patterns
- 15-minute token expiry
- Single-use tokens (invalidate after use)

IMPLEMENTATION DETAILS:
- Generate cryptographically secure reset token
- Store hashed token in database
- Send reset email with token
- Validate token on reset (check expiry, check used status)
- Hash new password before saving
- Return exact response structure from API-CONTRACT.md

DO NOT:
- Create new files
- Exceed 400 lines  
- Modify JWT token refresh functionality
- Create new email service (reuse existing)

GIT OPERATIONS:
After modifying successfully:
git add backend/src/services/auth/user-auth.service.ts
git commit -m "feat(password-reset): add service methods for password reset"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to B3
Update progress.md task checklist
``` -->
<!-- 
## Backend Task B3: Extend Auth Controller
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Verify service methods exist from B2
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Read and analyze: /Airvik-Main/Airvik-Improved/shared/contracts/api/auth-api.contract.ts
- Read and analyze: /Airvik-Main/Airvik-Improved/backend/src/controllers/auth/user-auth.controller.ts

YOUR TASK:
Extend existing auth controller with password reset HTTP request handling

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/backend/src/controllers/auth/user-auth.controller.ts (MAXIMUM 400 lines)

REQUIREMENTS FROM CONTRACTS:
- Add requestPasswordReset(req: Request, res: Response): Promise<Response>
- Add resetPassword(req: Request, res: Response): Promise<Response>
- Use exact method names from auth-api.contract.ts
- Import service methods from user-auth.service.ts
- Follow existing controller patterns exactly

RESPONSE FORMAT (CRITICAL):
MUST match API-CONTRACT.md exactly:
Success: { success: true, data: {...} }
Error: { success: false, error: "message", code: "ERROR_CODE" }

REQUEST VALIDATION:
- Email: required, valid format
- Token: required
- NewPassword: required, min 8 chars, pattern validation
- ConfirmPassword: required, must match newPassword

ERROR HANDLING:
Follow existing error patterns, use same response utility functions

DO NOT:
- Create new files
- Exceed 400 lines
- Modify existing JWT refresh controller
- Change response format

GIT OPERATIONS:
After modifying successfully:
git add backend/src/controllers/auth/user-auth.controller.ts
git commit -m "feat(password-reset): add controller endpoints for password reset"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to B4
Update progress.md task checklist
``` -->
<!-- 
## Backend Task B4: Extend Auth Routes
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Verify controller methods exist from B3
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Read and analyze: /Airvik-Main/Airvik-Improved/shared/contracts/api/auth-api.contract.ts
- Read and analyze: /Airvik-Main/Airvik-Improved/backend/src/routes/auth.routes.ts
- Check existing route patterns for rate limiting

YOUR TASK:
Extend existing auth routes with password reset endpoints

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/backend/src/routes/auth.routes.ts (MAXIMUM 200 lines)

REQUIREMENTS FROM CONTRACTS:
- Add POST /request-password-reset → requestPasswordReset
- Add POST /reset-password → resetPassword
- Use exact URLs from auth-api.contract.ts
- Import controller methods from user-auth.controller.ts

ROUTE CONFIGURATION:
- Follow existing route patterns exactly
- Add rate limiting middleware (follow existing patterns)
- Use same validation middleware patterns
- Maintain existing routes unchanged

RATE LIMITING:
- Max 3 reset requests per email per hour
- Max 5 requests per IP per hour
- Follow existing rate limiting setup

DO NOT:
- Create new files
- Exceed 200 lines
- Modify existing JWT refresh routes
- Change existing route structure

GIT OPERATIONS:
After modifying successfully:
git add backend/src/routes/auth.routes.ts
git commit -m "feat(password-reset): add routes for password reset endpoints"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to B5
Update progress.md task checklist
``` -->
<!-- 
## Backend Task B5: Extend Postman Collection
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Find and read existing Postman collection file
- Verify all backend files exist from B1-B4

YOUR TASK:
Extend existing Postman collection with password reset endpoint tests for Newman CLI testing

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/postman/user-registration-email-verification.postman_collection.json

REQUIREMENTS:
Add these requests to existing collection:

1. "Request Password Reset"
   - Method: POST
   - URL: {{baseUrl}}/api/v1/auth/request-password-reset
   - Headers: Content-Type: application/json
   - Body: { "email": "test@example.com" }
   - Tests: Check status 200, response has success: true, data.message exists

2. "Reset Password"
   - Method: POST  
   - URL: {{baseUrl}}/api/v1/auth/reset-password
   - Headers: Content-Type: application/json
   - Body: { "token": "{{resetToken}}", "newPassword": "NewPass123", "confirmPassword": "NewPass123" }
   - Tests: Check status 200, response has success: true, data.message exists

3. Add environment variable: resetToken

TESTING STRUCTURE:
Follow existing collection patterns for:
- Request naming conventions
- Test scripts format
- Variable usage
- Error case testing

DO NOT:
- Create new collection file
- Modify existing JWT refresh tests
- Break existing test structure

TESTING COMMAND:
After creation, test with:
newman run postman/user-registration-email-verification.postman_collection.json --environment postman/environment.json

GIT OPERATIONS:
After modifying successfully:
git add postman/
git commit -m "feat(password-reset): add postman tests for password reset endpoints"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md - mark backend phase COMPLETE
Update progress.md task checklist
``` -->
<!-- 
## Frontend Task F1: Extend TypeScript Types
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Read and analyze: /Airvik-Main/Airvik-Improved/shared/contracts/api/auth-api.contract.ts
- Read and analyze: /Airvik-Main/Airvik-Improved/frontend/src/types/auth.types.ts
- Verify backend is complete and tested

YOUR TASK:
Extend existing TypeScript types with password reset interfaces

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/frontend/src/types/auth.types.ts (MAXIMUM 200 lines)

REQUIREMENTS FROM CONTRACTS:
Add these interfaces (exact names from auth-api.contract.ts):
- RequestPasswordResetRequest interface
- ResetPasswordRequest interface
- RequestPasswordResetSuccessData interface  
- ResetPasswordSuccessData interface

TYPES MUST MATCH:
Backend response structure EXACTLY as shown in API-CONTRACT.md
Follow existing type patterns in the file

INTERFACE STRUCTURE:
```typescript
export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Response types must match API-CONTRACT.md exactly
```

DO NOT:
- Create new files
- Exceed 200 lines
- Modify existing JWT refresh types
- Change existing type structure

GIT OPERATIONS:
After modifying successfully:
cd /Airvik-Main/Airvik-Improved
git add frontend/src/types/auth.types.ts
git commit -m "feat(password-reset): add TypeScript types for password reset"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F2
Update progress.md task checklist
``` -->
<!-- 
## Frontend Task F2: Extend API Service
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Read and analyze: /Airvik-Main/Airvik-Improved/frontend/src/services/auth.service.ts
- Verify types exist from F1

YOUR TASK:
Extend existing API service with password reset API methods

FILE TO MODIFY:
/Airvik-Main/Airvik-Improved/frontend/src/services/auth.service.ts (MAXIMUM 400 lines)

REQUIREMENTS FROM CONTRACTS:
Add these methods:
- requestPasswordReset(email: string): Promise<ApiResponse<RequestPasswordResetSuccessData>>
- resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordSuccessData>>

IMPLEMENTATION:
- Import types from ../types/auth.types.ts
- Use exact API endpoints from API-CONTRACT.md
- Follow existing service method patterns
- Use same error handling as existing methods
- Return exact types as defined

API CALLS:
- Use fetch or axios (follow existing pattern)
- POST to /api/v1/auth/request-password-reset
- POST to /api/v1/auth/reset-password
- Include proper headers (Content-Type: application/json)
- Handle errors according to API-CONTRACT.md

DO NOT:
- Create new files
- Exceed 400 lines
- Modify existing JWT refresh service methods
- Change existing service patterns

GIT OPERATIONS:
After modifying successfully:
git add frontend/src/services/auth.service.ts
git commit -m "feat(password-reset): add API service methods for password reset"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F3
Update progress.md task checklist
``` -->
<!-- 
## Frontend Task F3: Create Password Reset UI Components
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Check existing auth components for UI patterns
- Verify API service exists from F2

YOUR TASK:
Create password reset UI components with mock data first

FILES TO CREATE:
1. /Airvik-Main/Airvik-Improved/frontend/src/components/auth/ForgotPasswordForm.tsx (MAXIMUM 400 lines)
2. /Airvik-Main/Airvik-Improved/frontend/src/components/auth/ResetPasswordForm.tsx (MAXIMUM 400 lines)

COMPONENT 1 - ForgotPasswordForm:
- Email input with validation
- Submit button
- Loading state (spinner/disabled)
- Success message display
- Error message display
- Link back to login
- Responsive design with Tailwind CSS

COMPONENT 2 - ResetPasswordForm:
- New password input with validation
- Confirm password input  
- Password strength indicator
- Submit button
- Loading state
- Success/error message display
- Token validation handling
- Responsive design with Tailwind CSS

USE MOCK DATA FIRST:
- Hardcode responses for testing UI
- Don't connect to API yet (that's F5)
- Focus on UI/UX and form validation

COMPONENT STRUCTURE:
- Use React hooks (useState, useEffect)
- TypeScript interfaces for props
- Follow existing component patterns
- Make components reusable
- Include proper accessibility

STYLING:
- Use Tailwind CSS classes
- Follow existing auth component styling
- Responsive design (mobile-first)
- Consistent with app design system

DO NOT:
- Connect to real API (use mock data)
- Exceed 400 lines per file
- Modify existing auth components

GIT OPERATIONS:
After creating successfully:
git add frontend/src/components/auth/
git commit -m "feat(password-reset): add password reset UI components with mock data"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F4
Update progress.md task checklist
``` -->
<!-- 
## Frontend Task F4: Create Password Reset Pages
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Verify components exist from F3
- Check existing Next.js app structure

YOUR TASK:
Create Next.js pages for password reset flow

FILES TO CREATE:
1. /Airvik-Main/Airvik-Improved/frontend/src/app/auth/forgot-password/page.tsx (MAXIMUM 200 lines)
2. /Airvik-Main/Airvik-Improved/frontend/src/app/auth/reset-password/page.tsx (MAXIMUM 200 lines)

PAGE 1 - Forgot Password:
- Import and use ForgotPasswordForm component
- Page title: "Forgot Password"
- Meta description for SEO
- Breadcrumb navigation
- Layout consistent with existing auth pages

PAGE 2 - Reset Password:
- Import and use ResetPasswordForm component  
- Page title: "Reset Password"
- Handle URL search params (token from email)
- Pass token to component as prop
- Handle invalid/expired token states
- Meta description for SEO
- Layout consistent with existing auth pages

ROUTE STRUCTURE:
- File: app/auth/forgot-password/page.tsx → Route: /auth/forgot-password
- File: app/auth/reset-password/page.tsx → Route: /auth/reset-password

NEXT.JS FEATURES:
- Use 'use client' directive if needed
- Proper metadata export
- Follow existing page patterns
- Handle URL parameters correctly

PAGE METADATA:
```typescript
export const metadata = {
  title: 'Forgot Password | Airvik Hotel',
  description: 'Reset your password securely'
};
```

DO NOT:
- Exceed 200 lines per file
- Modify existing auth pages
- Connect to real API yet (components use mock data)

GIT OPERATIONS:
After creating successfully:
git add frontend/src/app/auth/
git commit -m "feat(password-reset): add Next.js pages for password reset flow"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F5
Update progress.md task checklist
``` -->

## Frontend Task F5: Backend Integration
```
use planning mode:

MANDATORY FIRST STEPS:
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/CURRENT-STATE.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/API-CONTRACT.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/spec.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/api.md
- Read and analyze: /Airvik-Main/Airvik-Improved/docs/features/password-reset/tasks.md
- Verify all frontend files exist from F1-F4
- Test backend endpoints with Postman first

YOUR TASK:
Connect frontend components to real backend API, replacing mock data

FILES TO MODIFY:
1. /Airvik-Main/Airvik-Improved/frontend/src/components/auth/ForgotPasswordForm.tsx
2. /Airvik-Main/Airvik-Improved/frontend/src/components/auth/ResetPasswordForm.tsx

INTEGRATION CHANGES:

ForgotPasswordForm Component:
- Import requestPasswordReset from auth.service.ts
- Replace mock data with real API call
- Handle loading state during API call
- Display success message: "Password reset email sent"
- Handle all error codes from API-CONTRACT.md:
  - EMAIL_NOT_FOUND: "Email address not found"
  - RATE_LIMITED: "Too many requests, please try again later"
  - EMAIL_SEND_ERROR: "Failed to send email, please try again"
- Add proper error styling and messaging

ResetPasswordForm Component:
- Import resetPassword from auth.service.ts
- Replace mock data with real API call
- Handle loading state during API call
- Display success message and redirect to login
- Handle all error codes from API-CONTRACT.md:
  - INVALID_RESET_TOKEN: "Invalid or expired reset link"
  - EXPIRED_RESET_TOKEN: "Reset link has expired, please request a new one"
  - RESET_TOKEN_USED: "Reset link has already been used"
  - VALIDATION_ERROR: Show specific validation errors
- Add proper error styling and messaging
- Auto-redirect to login on successful password reset

ERROR HANDLING:
- Graceful handling of network errors
- User-friendly error messages
- Loading states during API calls
- Clear success feedback

SUCCESS FLOWS:
- ForgotPassword: Show success message, option to resend
- ResetPassword: Show success message, auto-redirect to /auth/login after 3 seconds

TESTING INTEGRATION:
Test full flow:
1. Request password reset → email sent
2. Use reset token → password updated
3. Login with new password → success
4. Verify JWT refresh still works → unchanged

DO NOT:
- Change component structure significantly
- Modify JWT refresh functionality
- Break existing functionality

GIT OPERATIONS:
After modifying successfully:
cd /Airvik-Main/Airvik-Improved
git add frontend/src/components/auth/
git commit -m "feat(password-reset): complete backend integration for password reset"
git push origin yash/feature/password-reset-jwt-refresh-jenali

AFTER COMPLETING:
Update CURRENT-STATE.md:
- Mark feature as COMPLETE
- List all files created/modified
- Note any issues for PROBLEMS-LOG.md
Update progress.md - mark all tasks complete

FINAL TESTING CHECKLIST:
- [ ] Request password reset email works
- [ ] Reset email contains valid token
- [ ] Reset password page accepts token
- [ ] New password successfully saves
- [ ] Login with new password works
- [ ] All error cases handled properly
- [ ] JWT token refresh unchanged and working
- [ ] Rate limiting prevents abuse
```
