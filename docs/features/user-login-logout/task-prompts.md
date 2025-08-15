# Task Prompts for User Login Logout

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

<!-- ## Backend Task B1: Extend Auth Service with Login/Logout Methods

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md

List what you found to prove you read them

**CONTEXT:**
You are implementing user-login-logout feature. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Extend existing auth service with login, logout, and refreshToken methods

**FILES TO EXTEND:**
- `backend/src/services/auth/user-auth.service.ts` (MAXIMUM 400 lines)
- `backend/src/models/user.model.ts` (add refresh token fields)

**REQUIREMENTS FROM SPEC:**
- Add loginUser method: validate credentials, check email verification, generate tokens
- Add logoutUser method: invalidate refresh token
- Add refreshUserToken method: validate refresh token, generate new tokens
- Add rate limiting logic for login attempts
- Extend User model with refreshTokens array and login tracking fields

**CODE STRUCTURE:**
- Import existing user model and extend it
- Use bcrypt for password comparison
- Use jsonwebtoken for token generation
- Add proper error handling with specific error codes
- Follow existing service patterns

**DO NOT:**
- Create duplicate functions that already exist
- Exceed 400 lines
- Add fields not specified in API contract


**AFTER COMPLETING:**
Update docs/features/user-login-logout/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ Extended auth service with login/logout methods
- Update "Next Task": B2
- Add to "Git Status": Last commit hash and message

Update docs/features/user-login-logout/progress.md:
- Mark B1 as completed
- Update current state


**GIT OPERATIONS:**
After extending the files successfully:
```bash
git add backend/src/services/auth/user-auth.service.ts backend/src/models/user.model.ts
git commit -m "feat(user-login-logout): extend auth service with login/logout methods"
git push origin feature/test-user-login-logout
```

**TEST YOUR WORK:**
The developer will test by calling service methods from Node.js console -->

<!-- ## Backend Task B2: Extend Auth Controller with Login/Logout Endpoints

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Confirm what files exist from previous tasks
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md

**YOUR TASK:**
Extend existing auth controller with login, logout, and refreshToken endpoints

**FILE TO EXTEND:**
- `backend/src/controllers/auth/user-auth.controller.ts` (MAXIMUM 400 lines)

**USE THE SERVICE:**
Import methods from: ../../services/auth/user-auth.service.ts (extended in B1)

**IMPLEMENT ENDPOINTS:**
Based on API-CONTRACT.md, add controller methods:
- loginUser: Handle POST /api/v1/auth/login
- logoutUser: Handle POST /api/v1/auth/logout  
- refreshToken: Handle POST /api/v1/auth/refresh-token

**RESPONSE FORMAT:**
MUST match exactly what's in API-CONTRACT.md:
- Success: { success: true, data: {...}, message: "..." }
- Error: { success: false, error: "message", code: "ERROR_CODE" }

**REQUEST VALIDATION:**
Add Joi validation schemas for:
- Login: email (required, email format), password (required)
- Logout: refreshToken (required, string)
- RefreshToken: refreshToken (required, string)

**GIT OPERATIONS:**
After extending the file successfully:
```bash
git add backend/src/controllers/auth/user-auth.controller.ts
git commit -m "feat(user-login-logout): extend auth controller with login/logout endpoints"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update docs/features/user-login-logout/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ Extended auth controller with login/logout endpoints
- Update "Next Task": B3
- Add to "Git Status": Last commit hash and message

Update docs/features/user-login-logout/progress.md:
- Mark B2 as completed
- Update current state -->

<!-- ## Backend Task B3: Add Login/Logout Routes

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Verify controller exists from B2
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.mdS
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Check existing route files for patterns

**YOUR TASK:**
Extend existing auth routes with login, logout, and refresh-token endpoints

**FILE TO EXTEND:**
- `backend/src/routes/auth.routes.ts` (MAXIMUM 200 lines)

**IMPORT CONTROLLER:**
From: ../controllers/auth/user-auth.controller.ts (extended in B2)

**DEFINE ROUTES:**
Based on API-CONTRACT.md, add these routes:
- POST /api/v1/auth/login → userAuthController.loginUser
- POST /api/v1/auth/logout → userAuthController.logoutUser
- POST /api/v1/auth/refresh-token → userAuthController.refreshToken

**ADD MIDDLEWARE:**
- For logout route: require authentication middleware (to be created in B4)
- For other routes: existing rate limiting if present

**GIT OPERATIONS:**
After extending the file successfully:
```bash
git add backend/src/routes/auth.routes.ts
git commit -m "feat(user-login-logout): add login/logout routes"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to B4
Update progress.md with task completion and current state -->

<!-- ## Backend Task B4: Create JWT Middleware for Protected Routes

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify all previous backend files exist

**YOUR TASK:**
Create JWT authentication middleware for protecting routes

**FILE TO CREATE:**
- `backend/src/middleware/auth.middleware.ts` (MAXIMUM 400 lines)

**INCLUDE FUNCTIONS:**
- verifyAccessToken: Main middleware function for protected routes
- extractUserFromToken: Helper to decode and validate JWT
- requireAuth: Wrapper middleware for easy route protection

**FUNCTIONALITY:**
- Extract Bearer token from Authorization header
- Verify JWT signature and expiration
- Attach user data to request object
- Handle expired/invalid token errors
- Return proper error responses matching API-CONTRACT.md

**ERROR HANDLING:**
For invalid/expired tokens, return:
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/middleware/auth.middleware.ts
git commit -m "feat(user-login-logout): add JWT authentication middleware"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to B5
Update progress.md with task completion and current state -->

<!-- ## Backend Task B5: Extend Postman Collection for Login/Logout

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify all backend files exist

**YOUR TASK:**
Extend existing Postman collection with login/logout test requests

**FILE TO EXTEND:**
- `postman/user-registration-email-verification.postman_collection.json`

**ADD NEW REQUESTS:**
1. **User Login** - POST {{baseUrl}}/api/v1/auth/login
2. **User Logout** - POST {{baseUrl}}/api/v1/auth/logout  
3. **Refresh Token** - POST {{baseUrl}}/api/v1/auth/refresh-token

**INCLUDE FOR EACH REQUEST:**
- Request name and description
- Method and URL with variables
- Headers (Content-Type: application/json)
- Body with example data from API-CONTRACT.md
- Tests to verify response structure and status codes

**ENVIRONMENT VARIABLES:**
- {{baseUrl}} = http://localhost:5000
- {{accessToken}} = captured from login response
- {{refreshToken}} = captured from login response

**TEST SCRIPTS:**
For each request, add tests that verify:
- Status code is correct (200, 400, 401)
- Response has success field
- Response data matches expected structure
- Tokens are properly formatted (for login)

**NEWMAN TESTING:**
Ensure collection can run with:
```bash
newman run postman/user-registration-email-verification.postman_collection.json
```

**GIT OPERATIONS:**
After extending the file successfully:
```bash
git add postman/user-registration-email-verification.postman_collection.json
git commit -m "feat(user-login-logout): extend Postman collection with login/logout tests"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and mark backend phase COMPLETE
Update progress.md with all backend tasks completed -->

<!-- ## Frontend Task F1: Extend TypeScript Types for Login/Logout

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify backend is complete and tested

**YOUR TASK:**
Extend existing TypeScript types with login/logout interfaces

**FILE TO EXTEND:**
- `frontend/src/types/auth.types.ts` (MAXIMUM 200 lines)

**TYPES TO ADD:**
Based on API-CONTRACT.md, add these interfaces:
- LoginRequest: { email: string; password: string; }
- LoginResponse: matching backend login response exactly
- LogoutRequest: { refreshToken: string; }
- RefreshTokenRequest: { refreshToken: string; }
- RefreshTokenResponse: matching backend refresh response exactly

**MUST MATCH:**
Types must match backend responses EXACTLY as shown in API-CONTRACT.md

**EXPORT ALL TYPES:**
Make sure all new interfaces are exported for use in components

**GIT OPERATIONS:**
After extending the file successfully:
```bash
git add frontend/src/types/auth.types.ts
git commit -m "feat(user-login-logout): extend TypeScript types for login/logout"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F2
Update progress.md with task completion and current state -->

<!-- ## Frontend Task F2: Extend API Service with Login/Logout Methods

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify types exist from F1

**YOUR TASK:**
Extend existing API service with login/logout methods

**FILE TO EXTEND:**
- `frontend/src/services/auth.service.ts` (MAXIMUM 400 lines)

**IMPORT TYPES:**
From: ../types/auth.types.ts (extended in F1)

**IMPLEMENT METHODS:**
For each endpoint in API-CONTRACT.md:
- login(data: LoginRequest): Promise<LoginResponse>
- logout(refreshToken: string): Promise<void>
- refreshToken(token: string): Promise<RefreshTokenResponse>

**API CALLS:**
- Use fetch or axios to call backend endpoints
- Include proper error handling
- Return exact types as defined
- Add Authorization headers where required

**TOKEN MANAGEMENT:**
- Add methods to store/retrieve tokens securely
- Add HTTP interceptor for automatic token refresh on 401 errors
- Handle token expiration gracefully

**GIT OPERATIONS:**
After extending the file successfully:
```bash
git add frontend/src/services/auth.service.ts
git commit -m "feat(user-login-logout): extend API service with login/logout methods"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F3
Update progress.md with task completion and current state -->

<!-- ## Frontend Task F3: Create Login UI Component

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify API service exists from F2
Check UI/UX requirements from spec.md

**YOUR TASK:**
Create main login form component

**FILE TO CREATE:**
- `frontend/src/components/auth/LoginForm.tsx` (MAXIMUM 400 lines)

**USE MOCK DATA FIRST:**
Create component with hardcoded data to test UI
Don't connect to API yet (that's F5)

**COMPONENT FEATURES:**
- Email and password input fields
- Form validation on submit
- Loading states during form submission
- Error display for invalid credentials
- Success feedback
- Responsive design with Tailwind CSS
- Link to registration page
- "Forgot password" placeholder link

**COMPONENT STRUCTURE:**
- Use React hooks (useState, useEffect)
- Separate concerns (UI vs logic)
- Make it reusable
- Follow existing component patterns

**STYLING:**
- Use Tailwind CSS classes
- Modern, clean design
- Mobile-responsive
- Consistent with existing auth pages

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/components/auth/LoginForm.tsx
git commit -m "feat(user-login-logout): create login form component"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F4
Update progress.md with task completion and current state -->

<!-- ## Frontend Task F4: Create Login Page and Logout Component

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify component exists from F3
Check Next.js app structure

**YOUR TASK:**
Create Next.js login page and logout button component

**FILES TO CREATE:**
- `frontend/src/app/auth/login/page.tsx` (MAXIMUM 200 lines)
- `frontend/src/components/layout/LogoutButton.tsx` (MAXIMUM 200 lines)

**LOGIN PAGE CONTENT:**
- Import and use LoginForm component from F3
- Add page title and metadata
- Include any layout requirements
- Add navigation breadcrumbs if needed
- Handle authentication redirects

**LOGOUT COMPONENT:**
- Simple button that triggers logout
- Show loading state during logout
- Handle logout success/error
- Redirect to login page after logout

**ROUTE SETUP:**
The file location creates the route automatically:
- File: app/auth/login/page.tsx
- Route: /auth/login

**GIT OPERATIONS:**
After creating the files successfully:
```bash
git add frontend/src/app/auth/login/ frontend/src/components/layout/LogoutButton.tsx
git commit -m "feat(user-login-logout): create login page and logout component"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F5
Update progress.md with task completion and current state -->

<!-- ## Frontend Task F5: Connect Frontend to Backend APIs

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/user-login-logout/CURRENT-STATE.md
Read and analyze: docs/features/user-login-logout/API-CONTRACT.md
Read and analyze: docs/features/user-login-logout/spec.md
Read and analyze: docs/features/user-login-logout/api.md
Read and analyze: docs/features/user-login-logout/tasks.md
Read and analyze: docs/features/user-login-logout/progress.md
Verify all frontend files exist
Test backend is working with Postman

**YOUR TASK:**
Connect frontend components to real backend APIs

**FILES TO MODIFY:**
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/layout/LogoutButton.tsx`
- `frontend/src/services/auth.service.ts`

**CHANGES TO MAKE:**
- Import API service from F2
- Replace mock data with real API calls
- Add proper loading states during API calls
- Handle API errors and display to user
- Add success handling (redirect or message)
- Implement token storage and retrieval
- Add automatic token refresh on API failures

**TOKEN MANAGEMENT:**
- Store tokens securely (localStorage or httpOnly cookies)
- Include Authorization header in protected API calls
- Handle token expiration with automatic refresh
- Clear tokens on logout

**INTEGRATION TESTING:**
- Login with valid credentials → success redirect
- Login with invalid credentials → error message
- Logout → tokens cleared → redirect to login
- Token refresh → new tokens stored

**GIT OPERATIONS:**
After modifying successfully:
```bash
git add frontend/src/components/auth/ frontend/src/components/layout/ frontend/src/services/
git commit -m "feat(user-login-logout): complete backend integration"
git push origin feature/test-user-login-logout
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md:
- Mark feature as COMPLETE
- List all files created/modified
- Note any issues for PROBLEMS-LOG.md

Update progress.md:
- Mark all tasks completed
- Update final status
- Add integration test results -->
