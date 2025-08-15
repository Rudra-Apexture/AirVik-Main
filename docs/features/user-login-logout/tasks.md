# User Login Logout Tasks

## Developer: [Name] - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Extend Auth Service with Login/Logout Methods
**Files to extend**: 
- `backend/src/services/auth/user-auth.service.ts` (max 400 lines)
- `backend/src/models/user.model.ts` (add refresh token fields)
**What it does**: Add login, logout, refreshToken methods to existing auth service
**Must include**: 
- loginUser method with credential validation
- logoutUser method with token invalidation
- refreshUserToken method with token rotation
- Rate limiting logic for login attempts
**Test**: Call functions from Node.js console
**Git**: Add, commit with descriptive message, push

### Task B2: Extend Auth Controller with Login/Logout Endpoints
**Files to extend**:
- `backend/src/controllers/auth/user-auth.controller.ts` (max 400 lines)
**What it does**: Add HTTP request handling for login, logout, refreshToken endpoints
**Must match**: Exact format in API-CONTRACT.md
**Must include**:
- Login validation schema with Joi
- Logout validation schema
- RefreshToken validation schema
- Error handling for all scenarios
**Test**: Use curl or Postman
**Git**: Add, commit, push

### Task B3: Add Login/Logout Routes
**File to extend**: `backend/src/routes/auth.routes.ts` (max 200 lines)
**What it does**: Connect new URLs to controller methods
**Must include**:
- POST /api/v1/auth/login
- POST /api/v1/auth/logout  
- POST /api/v1/auth/refresh-token
**Test**: Routes appear in Express route list
**Git**: Add, commit, push

### Task B4: Create JWT Middleware for Protected Routes
**File to create**: `backend/src/middleware/auth.middleware.ts` (max 400 lines)
**What it does**: Verify JWT tokens for protected endpoints
**Must include**:
- verifyAccessToken middleware
- extractUserFromToken helper
- Error handling for expired/invalid tokens
**Test**: Protected routes require valid tokens
**Git**: Add, commit, push

### Task B5: Create Postman Collection for Login/Logout
**File to extend**: `postman/user-registration-email-verification.postman_collection.json`
**Must include**: Login, logout, refresh-token requests with example data
**Test**: All requests return expected responses
**Testing method**: Design tests for newman, test with newman in terminal
**Commands**:
```bash
# Install newman if not installed
npm install -g newman

# Run tests
newman run postman/user-registration-email-verification.postman_collection.json
```
**Git**: Add, commit, push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Extend TypeScript Types for Login/Logout
**File to extend**: `frontend/src/types/auth.types.ts` (max 200 lines)
**Must match**: Backend response structure EXACTLY
**Must include**:
- LoginRequest, LoginResponse interfaces
- LogoutRequest interface  
- RefreshTokenRequest, RefreshTokenResponse interfaces
- Updated User interface if needed
**Test**: No TypeScript errors
**Git**: Add, commit, push

### Task F2: Extend API Service with Login/Logout Methods
**File to extend**: `frontend/src/services/auth.service.ts` (max 400 lines)
**Must match**: API-CONTRACT.md exactly
**Must include**:
- login(data: LoginRequest): Promise<LoginResponse>
- logout(refreshToken: string): Promise<void>
- refreshToken(token: string): Promise<RefreshTokenResponse>
- Token storage and retrieval helpers
- HTTP interceptor for automatic token refresh
**Test**: Console log responses match expected structure
**Git**: Add, commit, push

### Task F3: Create Login UI Component
**File to create**: `frontend/src/components/auth/LoginForm.tsx` (max 400 lines)
**What it does**: User interface for login functionality
**Must include**:
- Email and password input fields
- Form validation and error display
- Loading states during API calls
- Success/error feedback
- Responsive design with Tailwind CSS
- Link to registration page
**Test**: Component renders with mock data
**Git**: Add, commit, push

### Task F4: Create Login Page and Logout Component
**Files to create**: 
- `frontend/src/app/auth/login/page.tsx` (max 200 lines)
- `frontend/src/components/layout/LogoutButton.tsx` (max 200 lines)
**What it does**: Next.js login page and logout functionality
**Must include**:
- Login page with proper SEO metadata
- Logout button component for navigation
- Authentication redirects
- Error boundary handling
**Test**: Can navigate to login page, logout works
**Git**: Add, commit, push

### Task F5: Connect Frontend to Backend APIs
**Files to modify**: LoginForm.tsx, LogoutButton.tsx, auth.service.ts
**What it does**: Replace mock data with real API calls
**Must include**:
- Token storage in secure httpOnly cookies or localStorage
- Automatic redirect on successful login
- Token refresh on API failures
- Global authentication state management
**Test**: Full feature works end-to-end
**Git**: Add, commit, push with "integration complete" message

## Integration Testing
**After F5 completion**:
1. Register new user → verify email → login → access protected routes → logout
2. Test invalid credentials → proper error messages
3. Test token expiry → automatic refresh works
4. Test logout → tokens cleared → protected routes inaccessible
5. Test rate limiting → account lockout after failed attempts

## Deployment Checklist
- [ ] Environment variables configured for JWT secrets
- [ ] CORS settings allow frontend domain
- [ ] HTTPS enabled for production token security
- [ ] Rate limiting configured in production
- [ ] Monitoring setup for authentication failures
