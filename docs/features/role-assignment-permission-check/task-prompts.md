# Task Prompts for Role Assignment & Permission Check

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

## Backend Task B1: Create MongoDB Schema Extensions

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Read and analyze: shared/contracts/models/user.contract.ts

List what you found to prove you read them

**CONTEXT:**
You are implementing role-assignment-permission-check feature. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create MongoDB audit log model for tracking role changes

**FILE TO CREATE:**
`backend/src/models/role-audit.model.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM SPEC:**
- Track all role changes with timestamp, admin details, and reason
- Include userId, previousRole, newRole, changedBy, reason, timestamp, ipAddress, userAgent
- Follow existing user model patterns for consistency
- Add proper indexes for efficient querying
- Include timestamps: true for createdAt/updatedAt
- Export both schema and TypeScript interface

**CODE STRUCTURE:**
- Use Mongoose with TypeScript
- Include all fields from spec.md
- Add proper indexes on userId, changedBy, timestamp
- Add timestamps: true
- Export both schema and TypeScript interface
- Follow exact patterns from shared/contracts/models/user.contract.ts

**MODEL FIELDS:**
```typescript
{
  userId: { type: ObjectId, required: true, ref: 'User' },
  previousRole: { type: String, enum: ['user', 'staff', 'admin'], required: true },
  newRole: { type: String, enum: ['user', 'staff', 'admin'], required: true },
  changedBy: { type: ObjectId, required: true, ref: 'User' },
  reason: { type: String, maxLength: 500 },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
}
```

**INDEXES TO ADD:**
```typescript
roleAuditSchema.index({ userId: 1, timestamp: -1 });
roleAuditSchema.index({ changedBy: 1, timestamp: -1 });
roleAuditSchema.index({ timestamp: -1 });
```

**DO NOT:**
- Create any other files
- Exceed 400 lines
- Add fields not in spec
- Modify existing user model

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/models/role-audit.model.ts
git commit -m "feat(roles): add audit log model for role change tracking"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/models/role-audit.model.ts - Audit log model created
- Update "Next Task": B2

Update docs/features/role-assignment-permission-check/progress.md:
- Mark B1 as complete
- Update "Current State"
- Add to "Git Status": Last commit hash and message

**TEST YOUR WORK:**
The developer will test by creating an audit log document in MongoDB directly

---

## Backend Task B2: Create Role Service Layer

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Confirm what files exist from previous tasks
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Read and analyze: shared/contracts/services/role-service.contract.ts
Read and analyze: shared/contracts/models/user.contract.ts

**CONTEXT:**
You are implementing the service layer for role management. This contains all business logic.

**YOUR TASK:**
Create service layer with all business logic for role management

**FILE TO CREATE:**
`backend/src/services/roles/role.service.ts` (MAXIMUM 400 lines)

**USE THE MODELS:**
- Import from: ../../models/user.model.ts (existing)
- Import from: ../../models/role-audit.model.ts (created in B1)

**IMPLEMENT THESE METHODS (EXACT NAMES):**
- assignUserRole: Assign role to user with validation and audit logging
- getUserRole: Get single user's role information
- updateUserRole: Update existing user's role with validation and audit logging
- getUsersByRole: Get paginated list of users by role with filtering
- validateRoleAssignment: Validate if current user can assign target role

**METHOD SIGNATURES (EXACT FROM CONTRACT):**
```typescript
async assignUserRole(roleData: AssignRoleData): Promise<ServiceResponse<AssignRoleResponse>>
async getUserRole(userId: string): Promise<ServiceResponse<GetUserRoleResponse>>
async updateUserRole(roleData: UpdateRoleData): Promise<ServiceResponse<UpdateRoleResponse>>
async getUsersByRole(queryData: RoleQueryData): Promise<ServiceResponse<GetUsersByRoleResponse>>
async validateRoleAssignment(assignerId: string, targetRole: UserRole): Promise<ServiceResponse<RoleValidationResponse>>
```

**BUSINESS LOGIC REQUIREMENTS:**
- Implement role hierarchy validation (Admin > Staff > User)
- Prevent self-role modification (check if userId === assignerId)
- Create audit log entries for all role changes
- Handle pagination with proper limits (max 100, default 10)
- Validate MongoDB ObjectIds using mongoose.Types.ObjectId.isValid()
- Check user existence before operations
- Use role hierarchy from shared/contracts/services/role-service.contract.ts

**ROLE VALIDATION LOGIC:**
```typescript
// Only admins can assign admin role
if (targetRole === 'admin' && assignerRole !== 'admin') {
  return { success: false, error: 'Only admins can assign admin role', code: 'ROLE_ASSIGNMENT_DENIED' };
}

// Only admins can assign staff role
if (targetRole === 'staff' && assignerRole !== 'admin') {
  return { success: false, error: 'Only admins can assign staff role', code: 'ROLE_ASSIGNMENT_DENIED' };
}

// Prevent self-modification
if (userId === assignerId) {
  return { success: false, error: 'You cannot modify your own role', code: 'SELF_ROLE_MODIFICATION' };
}
```

**ERROR HANDLING:**
Throw errors with: { success: false, error: 'message', code: 'ERROR_CODE' }
Use error codes from shared/contracts/services/role-service.contract.ts:
- VALIDATION_ERROR
- USER_NOT_FOUND
- ROLE_ASSIGNMENT_DENIED
- INSUFFICIENT_PERMISSIONS  
- INVALID_ROLE
- SELF_ROLE_MODIFICATION
- ROLE_ALREADY_ASSIGNED
- INTERNAL_ERROR

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/services/roles/
git commit -m "feat(roles): add role service with assignment and validation logic"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/services/roles/role.service.ts - Role service layer created
- Update "Next Task": B3

Update docs/features/role-assignment-permission-check/progress.md:
- Mark B2 as complete
- Update "Current State"
- Add to "Git Status": Last commit hash and message

---

## Backend Task B3: Create Permission Middleware

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify service layer exists from B2
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Read and analyze: shared/contracts/middleware/permission-middleware.contract.ts
Read and analyze: shared/contracts/middleware/auth-middleware.contract.ts

**CONTEXT:**
You are creating middleware to protect API routes with role and permission checks.

**YOUR TASK:**
Create permission checking middleware for route protection

**FILE TO CREATE:**
`backend/src/middleware/permission.middleware.ts` (MAXIMUM 400 lines)

**USE EXISTING MIDDLEWARE:**
Import from: ./auth.middleware.ts (for AuthenticatedRequest interface)

**IMPLEMENT THESE FUNCTIONS (EXACT NAMES):**
- requireRole(role): Middleware to require specific role
- requireAnyRole(roles[]): Middleware to require any of specified roles
- requireAllRoles(roles[]): Middleware to require all specified roles
- requirePermission(permission): Middleware to require specific permission
- requireAnyPermission(permissions[]): Middleware to require any permission
- requireAllPermissions(permissions[]): Middleware to require all permissions

**PERMISSION MAPPING (EXACT FROM CONTRACT):**
```typescript
const ROLE_PERMISSIONS = {
  'admin': [
    'view_users', 'create_users', 'update_users', 'delete_users', 'assign_roles',
    'view_rooms', 'create_rooms', 'update_rooms', 'delete_rooms', 'manage_room_availability',
    'view_all_bookings', 'view_own_bookings', 'create_bookings', 'update_bookings', 'delete_bookings', 'cancel_bookings',
    'view_system_logs', 'manage_settings', 'backup_restore',
    'view_own_profile', 'update_own_profile'
  ],
  'staff': [
    'view_users', 'update_users',
    'view_rooms', 'create_rooms', 'update_rooms', 'manage_room_availability',
    'view_all_bookings', 'view_own_bookings', 'create_bookings', 'update_bookings', 'cancel_bookings',
    'view_own_profile', 'update_own_profile'
  ],
  'user': [
    'view_rooms',
    'view_own_bookings', 'create_bookings', 'cancel_bookings',
    'view_own_profile', 'update_own_profile'
  ]
};
```

**ERROR RESPONSES (EXACT FROM CONTRACT):**
```typescript
ROLE_REQUIRED: {
  error: 'Access denied. Required role not found.',
  code: 'ROLE_REQUIRED',
  status: 403
},
INSUFFICIENT_ROLE: {
  error: 'Access denied. Insufficient role permissions.',
  code: 'INSUFFICIENT_ROLE', 
  status: 403
},
PERMISSION_DENIED: {
  error: 'Access denied. Required permission not found.',
  code: 'PERMISSION_DENIED',
  status: 403
}
```

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/middleware/permission.middleware.ts
git commit -m "feat(roles): add permission middleware for role-based access control"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and progress.md as in previous tasks

---

## Backend Task B4: Create Role Controller

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify service layer exists from B2
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Read and analyze: shared/contracts/api/role-api.contract.ts

**CONTEXT:**
You are creating HTTP controllers to handle role management API requests.

**YOUR TASK:**
Create controller to handle HTTP requests for role management

**FILE TO CREATE:**
`backend/src/controllers/roles/role.controller.ts` (MAXIMUM 400 lines)

**USE THE SERVICE:**
Import from: ../../services/roles/role.service.ts

**IMPLEMENT ENDPOINTS (EXACT NAMES):**
- assignRole: POST /api/v1/roles/assign
- getUserRole: GET /api/v1/roles/user/:userId/role
- updateRole: PUT /api/v1/roles/update
- getUsersByRole: GET /api/v1/roles/users-by-role
- validateAssignment: POST /api/v1/roles/validate-assignment

**RESPONSE FORMAT:**
MUST match exactly what's in API-CONTRACT.md:
- Success: { success: true, data: {...} }
- Error: { success: false, error: "message", code: "ERROR_CODE" }

**REQUEST VALIDATION:**
- Validate MongoDB ObjectId format for userId parameters using mongoose.Types.ObjectId.isValid()
- Validate role enum values (user, staff, admin)
- Validate pagination parameters (page, limit, sortBy, sortOrder)
- Validate request body structure
- Use validation rules from shared/contracts/api/role-api.contract.ts

**ERROR HANDLING:**
- Use exact error codes from shared/contracts/api/role-api.contract.ts
- Return proper HTTP status codes (400, 401, 403, 404, 500)
- Include detailed error messages
- Handle service layer errors properly

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/controllers/roles/
git commit -m "feat(roles): add role controller endpoints"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and progress.md as in previous tasks

---

## Backend Task B5: Create Role Routes Configuration

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify controller exists from B4
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Read and analyze: shared/contracts/api/role-api.contract.ts

**CONTEXT:**
You are configuring Express routes with proper middleware for role management endpoints.

**YOUR TASK:**
Create routes with proper middleware authentication and authorization

**FILE TO CREATE:**
`backend/src/routes/role.routes.ts` (MAXIMUM 200 lines)

**ROUTES TO IMPLEMENT:**
- POST /api/v1/roles/assign (requireAuth + requireRole("admin"))
- GET /api/v1/roles/user/:userId/role (requireAuth + requireAnyRole(["admin","staff"]))
- PUT /api/v1/roles/update (requireAuth + requireRole("admin"))
- GET /api/v1/roles/users-by-role (requireAuth + requireAnyRole(["admin","staff"]))
- POST /api/v1/roles/validate-assignment (requireAuth + requireAnyRole(["admin","staff"]))

**MIDDLEWARE STACK:**
```typescript
// Import required middleware
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole, requireAnyRole } from '../middleware/permission.middleware';

// Route configuration example
router.post('/assign', requireAuth, requireRole('admin'), roleController.assignRole);
router.get('/user/:userId/role', requireAuth, requireAnyRole(['admin', 'staff']), roleController.getUserRole);
```

**FOLLOW PATTERNS:**
Use same patterns as existing auth routes
Export router as default
Include proper imports and middleware chaining

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/routes/role.routes.ts
git commit -m "feat(roles): add role routes with proper auth middleware"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and progress.md as in previous tasks

---

## Backend Task B6: Create Postman Collection for API Testing

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify all backend tasks B1-B5 are complete
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CONTEXT:**
You are creating comprehensive API test collection for automated testing with newman.

**YOUR TASK:**
Create complete Postman collection for testing all role management endpoints

**FILE TO CREATE:**
`postman/role-assignment-permission-check.postman_collection.json`

**INCLUDE ALL 5 ENDPOINTS:**
1. **Assign Role** - POST {{baseUrl}}/api/v1/roles/assign
2. **Get User Role** - GET {{baseUrl}}/api/v1/roles/user/{{userId}}/role
3. **Update Role** - PUT {{baseUrl}}/api/v1/roles/update
4. **Get Users by Role** - GET {{baseUrl}}/api/v1/roles/users-by-role
5. **Validate Assignment** - POST {{baseUrl}}/api/v1/roles/validate-assignment

**FOR EACH REQUEST INCLUDE:**
- Request name and description
- Method and URL with variables
- Headers (Content-Type: application/json, Authorization: Bearer {{accessToken}})
- Body with example data from API-CONTRACT.md
- Tests to verify response structure and status codes
- Environment variable capture for chaining requests

**ENVIRONMENT VARIABLES:**
- {{baseUrl}} = http://localhost:5000
- {{accessToken}} = captured from auth login
- {{userId}} = test user ID for role operations
- {{adminToken}} = admin user token
- {{staffToken}} = staff user token

**TEST SCRIPTS:**
For each request, add tests that verify:
- Status code is correct (200, 400, 401, 403, 404)
- Response has success field
- Response data matches expected structure from API-CONTRACT.md
- Error responses include proper code and message

**NEWMAN TESTING:**
Ensure collection can run with:
```bash
newman run postman/role-assignment-permission-check.postman_collection.json --environment postman/environment.json
```

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add postman/role-assignment-permission-check.postman_collection.json
git commit -m "feat(roles): add comprehensive Postman collection for API testing"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ postman/role-assignment-permission-check.postman_collection.json - API test collection created
- Update "Next Task": F1 (Frontend Phase Start)
- Mark "Backend Phase": COMPLETE

Update docs/features/role-assignment-permission-check/progress.md:
- Mark B6 as complete
- Update "Current State": Backend Complete, Frontend Starting
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F1: Create TypeScript Types

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify backend phase is complete
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CONTEXT:**
You are creating TypeScript types for the frontend that match the backend API exactly.

**YOUR TASK:**
Create frontend TypeScript types matching backend API responses

**FILE TO CREATE:**
`frontend/src/types/role.types.ts` (MAXIMUM 200 lines)

**TYPES TO CREATE (MATCH API-CONTRACT.md EXACTLY):**
- AssignRoleRequest: Request body for assigning roles
- AssignRoleResponse: Response from assign role endpoint
- UpdateRoleRequest: Request body for updating roles
- UpdateRoleResponse: Response from update role endpoint
- GetUserRoleResponse: Response from get user role endpoint
- GetUsersByRoleResponse: Response from get users by role endpoint (with pagination)
- RoleValidationResponse: Response from validate assignment endpoint
- UserRole: Enum for user roles ('user' | 'staff' | 'admin')
- UserWithRole: User object with role information
- RoleAuditLog: Audit log entry structure
- PaginationMeta: Pagination metadata

**EXAMPLE TYPE STRUCTURES:**
```typescript
export type UserRole = 'user' | 'staff' | 'admin';

export interface AssignRoleRequest {
  userId: string;
  role: UserRole;
  reason?: string;
}

export interface AssignRoleResponse {
  user: UserWithRole;
  auditLog: RoleAuditLog;
  message: string;
}

export interface UserWithRole {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**MUST MATCH:**
Types must match backend API responses EXACTLY as shown in API-CONTRACT.md
Use exact property names and data types
Include all optional fields marked with ?

**EXPORT ALL TYPES:**
Make sure all interfaces and types are exported for use in components

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/types/role.types.ts
git commit -m "feat(roles): add frontend TypeScript types for role management"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/types/role.types.ts - Frontend types created
- Update "Next Task": F2

Update docs/features/role-assignment-permission-check/progress.md:
- Mark F1 as complete
- Update "Current State"
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F2: Create API Service

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify types exist from F1
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CONTEXT:**
You are creating the frontend API service to communicate with the backend role management endpoints.

**YOUR TASK:**
Create frontend API service with HTTP methods for role management

**FILE TO CREATE:**
`frontend/src/services/role.service.ts` (MAXIMUM 400 lines)

**IMPORT TYPES:**
From: ../types/role.types.ts (created in F1)

**IMPLEMENT METHODS (EXACT NAMES):**
- assignRole(data: AssignRoleRequest): Promise<AssignRoleResponse>
- getUserRole(userId: string): Promise<GetUserRoleResponse>
- updateRole(data: UpdateRoleRequest): Promise<UpdateRoleResponse>
- getUsersByRole(queryParams: RoleQueryParams): Promise<GetUsersByRoleResponse>
- validateAssignment(data: RoleValidationRequest): Promise<RoleValidationResponse>

**API ENDPOINTS (MATCH API-CONTRACT.md):**
- POST /api/v1/roles/assign
- GET /api/v1/roles/user/:userId/role
- PUT /api/v1/roles/update
- GET /api/v1/roles/users-by-role
- POST /api/v1/roles/validate-assignment

**HTTP CLIENT SETUP:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class RoleService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }
}
```

**ERROR HANDLING:**
- Handle HTTP errors (400, 401, 403, 404, 500)
- Parse backend error responses
- Throw meaningful error messages
- Handle token refresh on 401 errors

**TOKEN MANAGEMENT:**
- Add Authorization headers automatically
- Handle token expiration
- Integrate with existing auth system

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/services/role.service.ts
git commit -m "feat(roles): add frontend API service for role management"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and progress.md as in previous tasks

---

## Frontend Task F3: Create Role Management Components

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify API service exists from F2
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CONTEXT:**
You are creating React components for role management UI with modern design and UX.

**YOUR TASK:**
Create comprehensive UI components for role management

**FILES TO CREATE:**
- `frontend/src/components/admin/UserRoleAssignment.tsx` (MAXIMUM 400 lines)
- `frontend/src/components/admin/UserRoleList.tsx` (MAXIMUM 400 lines)
- `frontend/src/components/admin/RoleValidation.tsx` (MAXIMUM 200 lines)

**UserRoleAssignment.tsx FEATURES:**
- Form to assign/update user roles
- User search/selection dropdown
- Role selection (user, staff, admin)
- Optional reason field
- Form validation with Formik/React Hook Form
- Loading states and success/error feedback
- Beautiful UI with Tailwind CSS
- Responsive design for mobile/desktop

**UserRoleList.tsx FEATURES:**
- Paginated table of users with roles
- Search and filter functionality
- Sort by name, email, role, created date
- Role badges with colors (green=admin, blue=staff, gray=user)
- Quick action buttons (Edit Role, View Audit)
- Loading skeleton states
- Empty state when no users
- Responsive table design

**RoleValidation.tsx FEATURES:**
- Component to validate role assignments
- Show role hierarchy and permissions
- Display validation results
- Permission matrix display
- Role conflict warnings

**DESIGN REQUIREMENTS:**
- Use Tailwind CSS for styling
- Modern card-based layout
- Proper loading states with spinners
- Error handling with toast notifications
- Form validation with helpful error messages
- Accessibility (ARIA labels, keyboard navigation)
- Mobile-responsive design

**USE MOCK DATA INITIALLY:**
```typescript
const mockUsers = [
  { _id: '1', name: 'John Admin', email: 'john@admin.com', role: 'admin' as UserRole, isActive: true },
  { _id: '2', name: 'Jane Staff', email: 'jane@staff.com', role: 'staff' as UserRole, isActive: true },
  { _id: '3', name: 'Bob User', email: 'bob@user.com', role: 'user' as UserRole, isActive: true },
];
```

**COMPONENT STRUCTURE:**
```typescript
import React, { useState, useEffect } from 'react';
import { UserRole, AssignRoleRequest } from '../../types/role.types';

interface UserRoleAssignmentProps {
  onRoleAssigned?: () => void;
}

export const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({ onRoleAssigned }) => {
  // Component implementation
};
```

**GIT OPERATIONS:**
After creating all files successfully:
```bash
git add frontend/src/components/admin/
git commit -m "feat(roles): add role management UI components with Tailwind CSS"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and progress.md as in previous tasks

---

## Frontend Task F4: Create Admin Pages and Routes

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify components exist from F3
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CONTEXT:**
You are creating Next.js pages for role management that only admins can access.

**YOUR TASK:**
Create Next.js pages and routes for role management

**FILES TO CREATE:**
- `frontend/src/app/admin/roles/page.tsx` (MAXIMUM 200 lines)
- `frontend/src/app/admin/roles/assign/page.tsx` (MAXIMUM 200 lines)

**admin/roles/page.tsx FEATURES:**
- Main role management dashboard
- Overview cards (total users by role)
- Recent role changes list
- Quick action buttons
- Navigation to assign roles page
- Admin-only access check
- Page metadata and SEO

**admin/roles/assign/page.tsx FEATURES:**
- Role assignment page
- Uses UserRoleAssignment component
- Breadcrumb navigation
- Success/error handling
- Redirect after successful assignment
- Admin-only access check

**PAGE STRUCTURE:**
```typescript
import { Metadata } from 'next';
import { UserRoleList } from '../../../components/admin/UserRoleList';

export const metadata: Metadata = {
  title: 'Role Management - Airvik Admin',
  description: 'Manage user roles and permissions',
};

export default function RolesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
        <p className="text-gray-600 mt-2">Assign and manage user roles and permissions</p>
      </div>
      
      {/* Page content */}
    </div>
  );
}
```

**ADMIN ACCESS PROTECTION:**
- Check user role on page load
- Redirect non-admin users to dashboard
- Show loading state during auth check
- Display proper error messages

**NAVIGATION:**
- Breadcrumb navigation
- Back buttons where appropriate
- Active page highlighting
- Mobile-friendly navigation

**RESPONSIVE LAYOUT:**
- Mobile-first design
- Proper spacing and typography
- Card-based layout
- Grid system for different screen sizes

**GIT OPERATIONS:**
After creating both files successfully:
```bash
git add frontend/src/app/admin/roles/
git commit -m "feat(roles): add admin pages for role management with Next.js routing"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update CURRENT-STATE.md and progress.md as in previous tasks

---

## Frontend Task F5: Complete Backend Integration

**MANDATORY FIRST STEPS:**

use planning mode.

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify all previous frontend tasks are complete
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CONTEXT:**
You are completing the feature by connecting all frontend components to the real backend API.

**YOUR TASK:**
Replace mock data with real API calls and complete end-to-end integration

**FILES TO MODIFY:**
- All components from F3 (UserRoleAssignment.tsx, UserRoleList.tsx, RoleValidation.tsx)
- All pages from F4 (admin/roles/page.tsx, admin/roles/assign/page.tsx)

**INTEGRATION CHANGES:**
- Replace mock data with API service calls
- Add proper loading states during API requests
- Handle API errors with user-friendly messages
- Add success feedback (toast notifications)
- Implement data refresh after actions
- Add optimistic updates where appropriate

**ERROR HANDLING:**
- Network errors (connection issues)
- Authentication errors (expired tokens)
- Authorization errors (insufficient permissions)
- Validation errors (invalid input)
- Server errors (500, 503)

**LOADING STATES:**
- Skeleton loading for data fetching
- Button loading states during actions
- Page loading states
- Infinite scroll loading (if implemented)

**SUCCESS FEEDBACK:**
- Toast notifications for successful actions
- Success messages in forms
- Visual confirmation (green checkmarks)
- Auto-refresh data after changes

**EXAMPLE INTEGRATION:**
```typescript
const [users, setUsers] = useState<UserWithRole[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await roleService.getUsersByRole({ role: 'all', page: 1, limit: 10 });
      setUsers(response.data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
  fetchUsers();
}, []);
```

**TESTING REQUIREMENTS:**
Test complete end-to-end workflows:
- Admin login → Navigate to roles page → View user list
- Admin assign role → Success notification → Data refresh
- Staff login → Limited access to view-only features
- User login → No access to role management
- Error scenarios (network issues, permission denied)

**GIT OPERATIONS:**
After completing all integration changes:
```bash
git add frontend/src/components/admin/ frontend/src/app/admin/roles/
git commit -m "feat(roles): complete backend integration - role assignment feature complete"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ Complete frontend integration with backend API
- Update "Next Task": FEATURE COMPLETE
- Mark "Frontend Phase": COMPLETE
- Mark "Overall Status": FEATURE COMPLETE

Update docs/features/role-assignment-permission-check/progress.md:
- Mark F5 as complete
- Update "Current State": Feature Complete
- Add to "Git Status": Last commit hash and message
- Mark all tasks as ✅ Complete

---

## Error Handling Prompts

### If MongoDB Connection Fails:
"Check database connection in backend/src/config/database.ts. Verify MongoDB is running and connection string is correct. Test with existing auth endpoints first."

### If JWT Authentication Fails:
"Verify JWT_SECRET matches between auth and permission middleware. Check that requireAuth middleware is working with existing endpoints. Test auth token manually in Postman."

### If API Contract Mismatch:
"Check API-CONTRACT.md and ensure response format matches exactly. Copy-paste response structure from contract. Verify TypeScript types match backend responses."

### If Permission Logic Fails:
"Start with simple role checks first. Test requireRole('admin') before complex permission logic. Verify user role is correctly attached to request object. Check middleware order."

### If Frontend API Calls Fail:
"Check browser network tab for actual HTTP requests. Verify API endpoints match backend routes. Check CORS settings. Verify JWT token is included in Authorization header."

### If React Components Don't Render:
"Check browser console for JavaScript errors. Verify TypeScript compilation. Check import paths. Verify component props and state management."

### If File Size Exceeds 400 Lines:
"Split large files into smaller focused modules. Extract helper functions to separate utility files. Split complex components into sub-components."

### If Tailwind CSS Styles Don't Apply:
"Check tailwind.config.js configuration. Verify CSS imports in layout files. Check for CSS specificity conflicts. Verify className syntax."

### If Git Operations Fail:
"Check current branch name matches 'feature/role-assignment-permission-check'. Verify files are staged with 'git add'. Check for merge conflicts. Verify remote repository access."
