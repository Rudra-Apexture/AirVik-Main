# Password Reset & JWT Token Refresh Tasks

## Developer: [Name] - Completes ALL tasks in order

## IMPORTANT NOTES:
- JWT Token Refresh (1.6) is **ALREADY IMPLEMENTED** - no work needed
- Focus ONLY on Password Reset (1.5) functionality
- Must **EXTEND existing files**, do NOT create new auth files
- Must use **EXACT property names** from contracts

## Backend Phase (Test each with Postman before moving on):

### Task B1: Extend MongoDB User Model
**File to modify**: `backend/src/models/user.model.ts` (max 400 lines)
**What it does**: Add password reset token fields to existing schema
**Must include**: 
- `passwordResetToken: String` (optional)
- `passwordResetExpiry: Date` (optional)
- Follow existing `emailVerificationToken` pattern exactly
**Test**: Verify schema accepts new fields in MongoDB
**Git**: Add, commit with "feat(password-reset): extend user model with reset token fields", push

### Task B2: Extend Auth Service Layer  
**File to modify**: `backend/src/services/auth/user-auth.service.ts` (max 400 lines)
**What it does**: Add password reset business logic methods
**Must include**: 
- `requestPasswordReset(email: string): Promise<ServiceResponse>`
- `resetPassword(token: string, newPassword: string): Promise<ServiceResponse>`
- Reuse existing email sending patterns
- Follow existing token generation patterns
**Test**: Call functions from Node.js console with test data
**Git**: Add, commit with "feat(password-reset): add service methods for password reset", push

### Task B3: Extend Auth Controller
**File to modify**: `backend/src/controllers/auth/user-auth.controller.ts` (max 400 lines)
**What it does**: Add HTTP request handling for reset endpoints
**Must include**:
- `requestPasswordReset(req, res): Promise<Response>`
- `resetPassword(req, res): Promise<Response>`
- **Must match**: Exact format in API-CONTRACT.md
- Follow existing controller patterns exactly
**Test**: Use curl or Postman to test endpoints
**Git**: Add, commit with "feat(password-reset): add controller endpoints for password reset", push

### Task B4: Extend Auth Routes
**File to modify**: `backend/src/routes/auth.routes.ts` (max 200 lines)
**What it does**: Add URL routes for reset endpoints
**Must include**:
- `POST /request-password-reset` → `requestPasswordReset`
- `POST /reset-password` → `resetPassword`
- Add rate limiting middleware (follow existing patterns)
**Test**: Routes appear in Express route list
**Git**: Add, commit with "feat(password-reset): add routes for password reset endpoints", push

### Task B5: Extend Postman Collection
**File to modify**: `postman/user-registration-email-verification.postman_collection.json`
**Must include**: 
- Request Password Reset endpoint with example data
- Reset Password endpoint with example data
- Tests to verify response structure matches API-CONTRACT.md
**Testing method**: Run `newman run postman/[collection-name].json` in terminal
**Git**: Add, commit with "feat(password-reset): add postman tests for password reset", push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Extend TypeScript Types
**File to modify**: `frontend/src/types/auth.types.ts` (max 200 lines)
**Must include**:
- `RequestPasswordResetRequest` interface
- `ResetPasswordRequest` interface  
- `RequestPasswordResetResponse` interface
- `ResetPasswordResponse` interface
- **Must match**: Backend response structure EXACTLY from API-CONTRACT.md
**Test**: No TypeScript errors in project
**Git**: Add, commit with "feat(password-reset): add TypeScript types for password reset", push

### Task F2: Extend API Service
**File to modify**: `frontend/src/services/auth.service.ts` (max 400 lines)
**Must include**:
- `requestPasswordReset(email: string): Promise<RequestPasswordResetResponse>`
- `resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse>`
- **Must match**: API-CONTRACT.md exactly
- Follow existing service method patterns
**Test**: Console log responses match expected structure
**Git**: Add, commit with "feat(password-reset): add API service methods for password reset", push

### Task F3: Create Password Reset UI Components
**Files to create**: 
- `frontend/src/components/auth/ForgotPasswordForm.tsx` (max 400 lines)
- `frontend/src/components/auth/ResetPasswordForm.tsx` (max 400 lines)
**What it does**: User interface for password reset flow
**Must include**:
- Email input with validation (forgot password form)
- Password + confirm password inputs (reset form)
- Loading states, error handling, success feedback
- Responsive design with Tailwind CSS
**Test**: Components render with mock data
**Git**: Add, commit with "feat(password-reset): add password reset UI components", push

### Task F4: Create Password Reset Pages
**Files to create**: 
- `frontend/src/app/auth/forgot-password/page.tsx` (max 200 lines)
- `frontend/src/app/auth/reset-password/page.tsx` (max 200 lines)
**What it does**: Next.js pages for reset flow
**Must include**:
- Import and use components from F3
- Proper page metadata and titles
- Handle URL parameters (reset token from email)
**Test**: Can navigate to pages
**Git**: Add, commit with "feat(password-reset): add password reset pages", push

### Task F5: Connect to Backend
**Files to modify**: Components and service files created in F3
**What it does**: Replace mock data with real API calls
**Must include**:
- Real API calls to reset endpoints
- Error handling for all error codes
- Success redirects (to login after password reset)
- Loading states during API calls
**Test**: Full password reset flow works end-to-end
**Git**: Add, commit with "feat(password-reset): complete backend integration", push

## Testing Phase:

### End-to-End Testing:
1. User requests password reset → email sent
2. User clicks email link → redirected to reset page
3. User enters new password → password updated
4. User logs in with new password → success
5. JWT token refresh continues working (no changes made)

### Error Case Testing:
- Invalid email → proper error message
- Expired token → proper error message  
- Weak password → validation errors
- Rate limiting → proper throttling

## Integration Requirements:

### Email Integration:
- Reuse existing `createEmailTransporter()` function
- Follow existing email template patterns
- Handle email failures gracefully

### Security Integration:
- Use existing password hashing utilities
- Follow existing token generation patterns
- Implement rate limiting like existing endpoints

### Frontend Integration:
- Add "Forgot Password?" link to login page
- Handle all error states with user feedback
- Maintain consistent UI/UX with existing auth pages

## Definition of Done:
- [ ] All backend endpoints working and tested
- [ ] All frontend components functional
- [ ] Password reset email sent and working
- [ ] New password successfully updates database
- [ ] User can login with new password
- [ ] JWT token refresh unchanged and working
- [ ] All error cases handled
- [ ] Rate limiting prevents abuse
- [ ] Code follows existing patterns exactly
