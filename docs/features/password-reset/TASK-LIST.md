# Password Reset & JWT Token Refresh Task List

## Backend Tasks (Do First):
- [ ] B1: Extend MongoDB User Model with Password Reset Fields
- [ ] B2: Extend Service Layer with Password Reset Methods  
- [ ] B3: Extend Controller with Password Reset Endpoints
- [ ] B4: Update Routes with Password Reset URLs
- [ ] B5: Create/Update Postman Tests

## Frontend Tasks (Do After Backend):
- [ ] F1: Extend TypeScript Types for Password Reset
- [ ] F2: Extend API Service with Password Reset Methods
- [ ] F3: Create Password Reset UI Components
- [ ] F4: Create Password Reset Pages/Routes
- [ ] F5: Connect to Backend and Test Integration

## Current Task: B1

## CRITICAL NOTES:
- JWT Token Refresh (1.6) already exists and works - NO CHANGES NEEDED
- Focus ONLY on Password Reset (1.5) implementation
- Must extend existing files rather than create new ones
- Must use EXACT property names from contracts
- Must read all contracts before each task

## Files to Extend (Not Create):
**Backend Extensions:**
- Extend: backend/src/models/user.model.ts (add reset token fields)
- Extend: backend/src/services/auth/user-auth.service.ts (add reset methods)
- Extend: backend/src/controllers/auth/user-auth.controller.ts (add reset endpoints)
- Extend: backend/src/routes/auth.routes.ts (add reset routes)

**Frontend Extensions:**  
- Extend: frontend/src/types/auth.types.ts (add reset interfaces)
- Extend: frontend/src/services/auth.service.ts (add reset API calls)
- Create: frontend/src/components/auth/PasswordResetForm.tsx (new component)
- Create: frontend/src/app/auth/reset-password/page.tsx (new page)

## Dependencies:
- Email service infrastructure already exists
- User authentication system already complete
- JWT token system already working
- Rate limiting middleware already implemented
