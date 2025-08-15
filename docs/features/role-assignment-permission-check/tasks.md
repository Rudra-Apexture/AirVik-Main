# Role Assignment & Permission Check Tasks

## Developer: [Name] - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Create MongoDB Schema Extensions
**File to create**: `backend/src/models/role-audit.model.ts` (max 400 lines)
**What it does**: Creates audit log model for tracking role changes
**Must include**: All fields from spec.md, indexes, timestamps, validation
**Dependencies**: Existing user model (already has role field)
**Test**: Create test audit log document in MongoDB directly
**Git**: Add, commit with descriptive message, push

### Task B2: Create Role Service Layer  
**Files to create**: 
- `backend/src/services/roles/role.service.ts` (max 400 lines)
**What it does**: All business logic for role management
**Must include**: assignUserRole, getUserRole, updateUserRole, getUsersByRole, validateRoleAssignment methods
**Dependencies**: User model, role-audit model from B1
**Must follow**: shared/contracts/services/role-service.contract.ts EXACTLY
**Test**: Call functions from Node.js console with test data
**Git**: Add, commit, push

### Task B3: Create Permission Middleware
**Files to create**:
- `backend/src/middleware/permission.middleware.ts` (max 400 lines)
**What it does**: Permission checking middleware for route protection
**Must include**: requireRole, requireAnyRole, requirePermission, hasPermission helper functions
**Dependencies**: Auth middleware, role service from B2
**Must follow**: shared/contracts/middleware/permission-middleware.contract.ts EXACTLY
**Test**: Use middleware in simple test route
**Git**: Add, commit, push

### Task B4: Create Role Controller
**Files to create**:
- `backend/src/controllers/roles/role.controller.ts` (max 400 lines)
**What it does**: HTTP request handling for all role management endpoints
**Must include**: assignRole, getUserRole, updateRole, getUsersByRole, validateAssignment methods
**Dependencies**: Role service from B2
**Must match**: Exact format in API-CONTRACT.md
**Test**: Use curl or Postman for each endpoint
**Git**: Add, commit, push

### Task B5: Create Role Routes
**File to create**: `backend/src/routes/role.routes.ts` (max 200 lines)
**What it does**: Connect URLs to controllers with proper middleware
**Must include**: All 5 endpoints with correct middleware (auth + permission)
**Dependencies**: Role controller from B4, permission middleware from B3
**Must follow**: shared/contracts/api/role-api.contract.ts EXACTLY
**Test**: Routes appear in Express route list
**Git**: Add, commit, push

### Task B6: Create Postman Collection
**File to create**: `postman/role-assignment-permission-check.postman_collection.json`
**Must include**: Every endpoint with example data, environment variables, tests
**Test method**: Design for newman testing, include response validation
**Dependencies**: All backend tasks B1-B5 complete
**Testing method**: Run `newman run postman/role-assignment-permission-check.postman_collection.json --environment postman/environment.json`
**Git**: Add, commit, push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Create TypeScript Types
**File to create**: `frontend/src/types/role.types.ts` (max 200 lines)
**What it does**: TypeScript interfaces for role management
**Must match**: Backend response structure from API-CONTRACT.md EXACTLY
**Must include**: All request/response interfaces, role enums, permission types
**Dependencies**: None (but must match backend contracts)
**Test**: No TypeScript errors in project
**Git**: Add, commit, push

### Task F2: Create API Service
**File to create**: `frontend/src/services/role.service.ts` (max 400 lines)
**What it does**: Frontend API calls to backend role endpoints
**Must include**: assignRole, getUserRole, updateRole, getUsersByRole, validateAssignment methods
**Dependencies**: Role types from F1
**Must match**: API-CONTRACT.md exactly
**Test**: Console log responses match expected structure
**Git**: Add, commit, push

### Task F3: Create Role Management Components
**Files to create**: 
- `frontend/src/components/admin/UserRoleAssignment.tsx` (max 400 lines)
- `frontend/src/components/admin/UserRoleList.tsx` (max 400 lines)
- `frontend/src/components/admin/RoleValidation.tsx` (max 200 lines)
**What it does**: UI components for role management
**Must include**: Forms, lists, validation, loading states, error handling
**Dependencies**: API service from F2, role types from F1
**Test**: Components render with mock data
**Git**: Add, commit, push

### Task F4: Create Admin Pages/Routes
**Files to create**: 
- `frontend/src/app/admin/roles/page.tsx` (max 200 lines)
- `frontend/src/app/admin/roles/assign/page.tsx` (max 200 lines)
**What it does**: Next.js pages for role management
**Must include**: Proper layout, navigation, admin-only access
**Dependencies**: Components from F3
**Test**: Can navigate to pages (with admin user)
**Git**: Add, commit, push

### Task F5: Connect to Backend & Integration
**Files to modify**: All component and service files
**What it does**: Replace mock data with real API calls
**Must include**: Error handling, loading states, success feedback
**Dependencies**: All previous tasks complete
**Test**: Full feature works end-to-end
**Git**: Add, commit, push with "integration complete" message

## Testing Strategy

### Backend Testing (After each task):
```bash
# B1: MongoDB Schema
# Test creating audit log documents directly in MongoDB

# B2: Service Layer
# Test service methods from Node console:
node -e "
const service = require('./backend/src/services/roles/role.service');
// Test service methods
"

# B3: Permission Middleware
# Create test route with middleware:
app.get('/test-admin', requireAuth(), requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

# B4: Controller
# Test with curl:
curl -X POST http://localhost:5000/api/v1/roles/assign \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "role": "staff"}'

# B5: Routes
# Test all routes are registered:
node -e "console.log(app._router.stack.map(r => r.route?.path).filter(Boolean))"

# B6: Postman Collection
newman run postman/role-assignment-permission-check.postman_collection.json \
  --environment postman/environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

### Frontend Testing (After each task):
```bash
# F1: Types
npm run type-check

# F2: API Service
# Test API calls with mock backend responses

# F3: Components
npm run test -- --testPathPattern=role

# F4: Pages
# Navigate to /admin/roles and verify rendering

# F5: Integration
# Complete end-to-end testing with real backend
```

## File Size Monitoring

Each file MUST stay under 400 lines for optimal AI processing:

### Backend Files:
- `role-audit.model.ts`: ~50-100 lines (simple model)
- `role.service.ts`: ~350-400 lines (5 methods with business logic)
- `permission.middleware.ts`: ~300-350 lines (6 middleware functions)
- `role.controller.ts`: ~350-400 lines (5 controllers with validation)
- `role.routes.ts`: ~100-150 lines (5 routes with middleware)

### Frontend Files:
- `role.types.ts`: ~150-200 lines (interfaces and enums)
- `role.service.ts`: ~200-300 lines (5 API methods)
- `UserRoleAssignment.tsx`: ~350-400 lines (complex form component)
- `UserRoleList.tsx`: ~300-350 lines (list with pagination)
- `RoleValidation.tsx`: ~150-200 lines (validation display)
- Role pages: ~100-150 lines each (simple page components)

## Dependencies & Order

### Critical Dependencies:
1. **B1 → B2**: Service needs audit model
2. **B2 → B3**: Middleware needs service for validation
3. **B2 → B4**: Controller needs service
4. **B3, B4 → B5**: Routes need both controller and middleware
5. **B1-B5 → B6**: Postman tests need complete backend
6. **B6 → F1**: Types should match tested API responses
7. **F1 → F2**: API service needs types
8. **F2 → F3**: Components need API service
9. **F3 → F4**: Pages need components
10. **F4 → F5**: Integration needs pages

### Shared Code Usage:
- **User Model**: Already exists, no changes needed
- **Auth Middleware**: Exists, will be used by permission middleware
- **Response Utils**: Exists, will be used by controllers
- **Database Config**: Exists, will be used by models

## Git Workflow

### Branch Strategy:
```bash
# Create feature branch
git checkout -b feature/role-assignment-permission-check

# After each task:
git add .
git commit -m "feat(roles): [task description]"
git push origin feature/role-assignment-permission-check

# Example commits:
git commit -m "feat(roles): add audit log model for role change tracking"
git commit -m "feat(roles): add role service with assignment and validation logic"
git commit -m "feat(roles): add permission middleware for role-based access control"
git commit -m "feat(roles): add role controller with all management endpoints"
git commit -m "feat(roles): add role routes with authentication and authorization"
git commit -m "feat(roles): add postman collection for API testing"
git commit -m "feat(roles): add frontend TypeScript types for role management"
git commit -m "feat(roles): add frontend API service for role operations"
git commit -m "feat(roles): add admin components for role management UI"
git commit -m "feat(roles): add admin pages for role assignment interface"
git commit -m "feat(roles): integrate frontend with backend API - feature complete"
```

### Final Merge:
```bash
# After all tasks complete and tested:
git checkout main
git merge feature/role-assignment-permission-check
git push origin main
```

## Quality Checklist

### Before Moving to Next Task:
- [ ] File created in correct location
- [ ] File size under 400 lines
- [ ] Code follows established patterns
- [ ] Contracts followed exactly
- [ ] Basic functionality tested
- [ ] Git commit with descriptive message
- [ ] Git push to remote branch
- [ ] CURRENT-STATE.md updated
- [ ] No breaking changes to existing code

### Backend Phase Complete Checklist:
- [ ] All 5 API endpoints working
- [ ] Permission middleware protecting routes correctly
- [ ] Role assignment business logic implemented
- [ ] Audit logging working
- [ ] Postman collection tests passing
- [ ] No TypeScript errors
- [ ] Database connections working
- [ ] Error handling implemented

### Frontend Phase Complete Checklist:
- [ ] Admin can assign roles through UI
- [ ] User list shows current roles
- [ ] Role validation working
- [ ] Error messages displayed properly
- [ ] Loading states implemented
- [ ] Responsive design working
- [ ] Navigation between pages working
- [ ] Integration with backend complete

### Feature Complete Checklist:
- [ ] End-to-end role assignment flow working
- [ ] Permission-based access control working
- [ ] Audit trail being created
- [ ] All error scenarios handled
- [ ] Performance acceptable
- [ ] Security requirements met
- [ ] Documentation complete
- [ ] Tests passing
- [ ] Code review ready
