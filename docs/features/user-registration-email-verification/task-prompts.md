# AI Task Prompts for User Registration & Email Verification

## Purpose: Copy-paste prompts for AI assistance during development and maintenance

---

## Backend Task B1: MongoDB Schema
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create MongoDB schema for user registration with email verification


**FILE TO CREATE:**
`backend/src/models/user.model.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM SPEC.MD:**
- User interface with firstName, lastName, email (unique), password
- isEmailVerified boolean field
- emailVerificationToken and tokenExpiry fields
- Pre-save middleware for bcrypt password hashing (12 rounds)
- Instance method comparePassword()
- Timestamps: true

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines
- Add fields not in spec

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add backend/src/models/user.model.ts`
2. Commit with message: `git commit -m "feat(user-registration): add User model with email verification"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/models/user.model.ts - User model with email verification fields
- Update "Next Task": B2
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.


**TEST YOUR WORK:**
The developer will test by creating a document in MongoDB

---

## Backend Task B2: Service Layer
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create authentication service layer for user registration and email verification

**FILE TO CREATE:**
`backend/src/services/auth/user-auth.service.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM SPEC.MD:**
- registerUser() function with password hashing
- verifyEmail() function with token validation
- resendVerificationEmail() function
- generateVerificationToken() with 24-hour expiry
- sendVerificationEmail() with HTML template
- Use bcrypt, jsonwebtoken, nodemailer

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines
- Add functions not in spec

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add backend/src/services/auth/user-auth.service.ts`
2. Commit with message: `git commit -m "feat(user-registration): add authentication service layer"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/services/auth/user-auth.service.ts - Auth service with email verification
- Update "Next Task": B3
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test by calling functions from Node.js console

---

## Backend Task B3: Controller Layer
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create authentication controllers that handle HTTP requests

**FILE TO CREATE:**
`backend/src/controllers/auth/user-auth.controller.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM SPEC.MD:**
- registerUser controller method (HTTP 201 response)
- verifyEmail controller method (HTTP 200 response)
- resendVerification controller method (HTTP 200 response)
- Use existing response utilities (sendSuccess, sendError)
- Input validation with joi or express-validator
- Must match API-CONTRACT.md exactly

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines
- Change API response format from contract

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add backend/src/controllers/auth/user-auth.controller.ts`
2. Commit with message: `git commit -m "feat(user-registration): add auth controllers"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/controllers/auth/user-auth.controller.ts - Auth controllers
- Update "Next Task": B4
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test using Postman

---

## Backend Task B4: Routes Setup
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create authentication routes and integrate with main server

**FILES TO CREATE:**
`backend/src/routes/auth.routes.ts` (MAXIMUM 400 lines)

**FILES TO MODIFY:**
`backend/src/server.ts` - Add route mounting

**REQUIREMENTS FROM SPEC.MD:**
- POST /register route with rate limiting
- POST /verify-email route with rate limiting
- POST /resend-verification route with rate limiting
- Mount routes at /api/v1/auth in server.ts
- Apply validation middleware

**DO NOT:**/
- Create additional route files
- Exceed 400 lines per file
- Change existing server configuration beyond adding routes

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add backend/src/routes/auth.routes.ts backend/src/server.ts`
2. Commit with message: `git commit -m "feat(user-registration): add auth routes"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/routes/auth.routes.ts - Auth routes with rate limiting
- Update "Next Task": B5
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test that routes appear in Express route list

---

## Backend Task B5: Postman Collection
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them.

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create comprehensive Postman collection for testing all endpoints

**FILE TO CREATE:**
`postman/user-registration-email-verification.postman_collection.json`

**REQUIREMENTS FROM docs/features/user-registration-email-verification/SPEC.MD:**
- Test all 3 endpoints with valid data
- Test error scenarios (duplicate email, invalid tokens)
- Include environment variables for base URL
- Pre-request scripts for dynamic data
- Response validation tests

**DO NOT:**
- Create any other files
- Modify any existing files
- Add endpoints not in spec

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add postman/user-registration-email-verification.postman_collection.json`
2. Commit with message: `git commit -m "test(user-registration): add Postman collection"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ postman/user-registration-email-verification.postman_collection.json - Complete API tests
- Update "Next Task": F1
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test by running all requests in Postman

---

## Frontend Task F1: TypeScript Types
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create TypeScript type definitions for authentication functionality

**FILE TO CREATE:**
`frontend/src/types/auth.types.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM docs/features/user-registration-email-verification/SPEC.MD:**
- User interface matching backend model (no sensitive fields)
- API request/response types for all endpoints
- Form data interfaces for registration
- Error response types
- Export all types

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines
- Add types not needed by frontend

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add frontend/src/types/auth.types.ts`
2. Commit with message: `git commit -m "feat(user-registration): add frontend TypeScript types"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/types/auth.types.ts - TypeScript type definitions
- Update "Next Task": F2
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test TypeScript compilation

---

## Frontend Task F2: API Service
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create API service for authentication functionality

**FILE TO CREATE:**
`frontend/src/services/auth.service.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM docs/features/user-registration-email-verification/SPEC.MD:**
- registerUser() function
- verifyEmail() function
- resendVerification() function
- Use axios or fetch for HTTP requests
- Proper TypeScript return types
- Error handling with try/catch

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines
- Add functions not needed

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add frontend/src/services/auth.service.ts`
2. Commit with message: `git commit -m "feat(user-registration): add frontend API service"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/services/auth.service.ts - API service for auth calls
- Update "Next Task": F3
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test API calls in browser dev tools

---

## Frontend Task F3: Registration Form Component
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create a modern, responsive registration form component

**FILE TO CREATE:**
`frontend/src/components/auth/RegistrationForm.tsx` (MAXIMUM 400 lines)

**REQUIREMENTS FROM docs/features/user-registration-email-verification/SPEC.MD:**
- React functional component with TypeScript
- React Hook Form for form management
- Tailwind CSS for styling
- Real-time validation with error messages
- Loading states during API calls
- Mobile-first responsive design

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines
- Add fields not in spec

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add frontend/src/components/auth/RegistrationForm.tsx`
2. Commit with message: `git commit -m "feat(user-registration): add registration form component"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/components/auth/RegistrationForm.tsx - Registration form with validation
- Update "Next Task": F4
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test form validation and mobile responsiveness

---

## Frontend Task F4: Next.js Pages
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create Next.js App Router pages for authentication

**FILES TO CREATE:**
`frontend/src/app/auth/register/page.tsx` (MAXIMUM 400 lines)
`frontend/src/app/auth/verify-email/page.tsx` (MAXIMUM 400 lines)

**REQUIREMENTS FROM docs/features/user-registration-email-verification/spec.md file:**
- Use Next.js 14 App Router conventions
- Import and use authentication components
- Proper SEO metadata
- Error boundary handling
- URL parameter extraction for verification tokens

**DO NOT:**
- Create any other files
- Modify any existing files
- Exceed 400 lines per file
- Add pages not needed

**GIT OPERATIONS:**
After creating the file successfully:
1. Stage changes: `git add frontend/src/app/auth/register/page.tsx frontend/src/app/auth/verify-email/page.tsx`
2. Commit with message: `git commit -m "feat(user-registration): add auth pages"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/app/auth/register/page.tsx - Registration page
- Add to "What Exists Now": ✅ frontend/src/app/auth/verify-email/page.tsx - Email verification page
- Update "Next Task": F5
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test page navigation and component rendering

---

## Frontend Task F5: Frontend-Backend Integration
**MANDATORY FIRST STEPS:**
use planning mode:

Read and analyze: docs/features/user-registration-email-verification/CURRENT-STATE.md
Read and analyze: docs/features/user-registration-email-verification/API-CONTRACT.md
Read and analyze: docs/features/user-registration-email-verification/SPEC.MD
Read and analyze: docs/features/user-registration-email-verification/api.md
Read and analyze: docs/features/user-registration-email-verification/tasks.md
List what you found to prove you read them

**CONTEXT:**
You are implementing user-registration-email-verification. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Complete integration testing and connect frontend to backend APIs

**FILES TO MODIFY:**
Any frontend files that need integration updates (MAXIMUM 400 lines per file)

**REQUIREMENTS FROM docs/features/user-registration-email-verification/spec.md file:**
- Replace any mock data with real API calls
- Test complete user registration flow
- Test email verification flow
- Ensure all error states are handled properly
- Verify mobile responsiveness

**DO NOT:**
- Create new files (only modify existing)
- Exceed 400 lines per file
- Change API contracts

**GIT OPERATIONS:**
After completing integration:
1. Stage changes: `git add .` (stage all modified files)
2. Commit with message: `git commit -m "feat(user-registration): complete frontend-backend integration"`
3. Push to remote: `git push origin yash/feature/user-registration-email-verification`

**AFTER COMPLETING:**
Update docs/features/user-registration-email-verification/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ Frontend-backend integration complete
- Update "Next Task": FEATURE COMPLETE
- Add to "Git Status": Latest commit hash and message

Read and analyze: docs/features/user-registration-email-verification/progress.md and mark completed tasks with ✅ Tick and update completed tasks.

**TEST YOUR WORK:**
The developer will test complete end-to-end user registration and email verification flow
