# Role Assignment & Permission Check Feature Specification

## Feature Overview
Complete role-based access control system for the Airvik Hotel System, enabling administrators to assign user roles (user/staff/admin) and implementing permission-based middleware to control access to system features. This feature extends the existing authentication system with granular role management and permission checking capabilities.

## VikBooking Analysis
**Reference Files Found:** None - VikBooking system has no existing role/permission management patterns.
**Implementation Approach:** Build from scratch using established authentication patterns and newly created contracts.

## User Flow

### 1. Admin Role Assignment Flow
1. **Authentication Required:** Admin user must be logged in with valid JWT token
2. **Access Role Management:** Navigate to admin panel → User Management → Role Assignment
3. **Select Target User:** Choose user from searchable list with pagination
4. **Assign Role:** Select new role (user/staff/admin) from dropdown
5. **Provide Reason:** Optional reason for role change (audit trail)
6. **Validate Assignment:** System checks if current user can assign target role
7. **Confirm Assignment:** Submit role change with confirmation dialog
8. **Audit Logging:** System logs role change with timestamp and admin details
9. **Success Feedback:** Display success message and updated user information

### 2. Role-Based Access Control Flow
1. **User Authentication:** User logs in with existing auth system
2. **Token Enhancement:** JWT token includes role information
3. **Protected Route Access:** User attempts to access protected endpoint
4. **Permission Check:** Middleware validates user role against required permissions
5. **Access Grant/Deny:** Allow access or return 403 Forbidden with specific error
6. **Audit Trail:** Log access attempts for security monitoring

### 3. Role Validation Flow
1. **Pre-Assignment Check:** Before role assignment, validate if operation is allowed
2. **Role Hierarchy Check:** Verify current user can assign target role
3. **Self-Modification Prevention:** Prevent users from modifying their own roles
4. **Business Logic Validation:** Apply role-specific business rules
5. **Validation Response:** Return detailed validation result with reasons

## API Endpoints

### Role Management Endpoints
1. **POST /api/v1/roles/assign** - Assign role to user (Admin only)
2. **GET /api/v1/roles/user/:userId/role** - Get user's role (Admin/Staff)
3. **PUT /api/v1/roles/update** - Update user's role (Admin only)
4. **GET /api/v1/roles/users-by-role** - List users by role with pagination (Admin/Staff)
5. **POST /api/v1/roles/validate-assignment** - Validate role assignment (Admin/Staff)

### Permission Middleware Functions
1. **requireRole(role)** - Require specific role
2. **requireAnyRole(roles[])** - Require any of specified roles
3. **requireAllRoles(roles[])** - Require all specified roles
4. **requirePermission(permission)** - Require specific permission
5. **requireAnyPermission(permissions[])** - Require any permission
6. **requireAllPermissions(permissions[])** - Require all permissions

## Database Schema

### User Model Extensions (Existing)
```typescript
// Existing user model already has:
role: {
  type: String,
  enum: ['user', 'admin', 'staff'],
  default: 'user'
}
```

### New Role Audit Log Model
```typescript
// New model: backend/src/models/role-audit.model.ts
{
  userId: ObjectId,          // User whose role was changed
  previousRole: String,      // Role before change
  newRole: String,          // Role after change  
  changedBy: ObjectId,      // Admin who made the change
  reason: String,           // Optional reason for change
  timestamp: Date,          // When change occurred
  ipAddress: String,        // IP address of admin making change
  userAgent: String        // Browser/client info
}
```

## Validation Rules

### Role Assignment Validation
- **Admin Assignment:** Only admins can assign admin role
- **Staff Assignment:** Only admins can assign staff role  
- **User Assignment:** Admins and staff can assign user role
- **Self-Modification:** Users cannot modify their own roles
- **Role Downgrade:** Admins can downgrade any role
- **User ID Format:** Must be valid 24-character MongoDB ObjectId
- **Role Values:** Must be one of: 'user', 'staff', 'admin'
- **Reason Length:** Optional, maximum 500 characters

### Permission Validation
- **Authentication First:** All permission checks require valid authentication
- **Role Hierarchy:** Admin > Staff > User in permission levels
- **Permission Mapping:** Each role has specific permissions defined in contract
- **Multiple Permissions:** AND/OR logic for multiple permission requirements

## File Structure

### Backend Files (Maximum 400 lines each)
```
backend/src/
├── models/
│   └── role-audit.model.ts              # New audit log model
├── services/
│   └── roles/
│       └── role.service.ts               # Role management service
├── middleware/
│   └── permission.middleware.ts          # Permission checking middleware
├── controllers/
│   └── roles/
│       └── role.controller.ts            # Role API controller
├── routes/
│   └── role.routes.ts                    # Role API routes
└── validators/
    └── role.validator.ts                 # Role validation schemas
```

### Frontend Files (Maximum 400 lines each)
```
frontend/src/
├── types/
│   └── role.types.ts                     # Role TypeScript interfaces
├── services/
│   └── role.service.ts                   # Role API service
├── components/
│   └── admin/
│       ├── UserRoleAssignment.tsx        # Role assignment component
│       ├── UserRoleList.tsx              # User list with roles
│       └── RoleValidation.tsx            # Role validation component
├── app/
│   └── admin/
│       └── roles/
│           ├── page.tsx                  # Main role management page
│           └── assign/
│               └── page.tsx              # Role assignment page
└── hooks/
    └── useRoleManagement.ts              # Custom hooks for role operations
```

## Permission System

### Role Hierarchy
```typescript
ADMIN (Level 3):
- All permissions
- Can manage all roles
- Full system access

STAFF (Level 2):  
- User management (limited)
- Room management
- Booking management
- Cannot assign admin/staff roles

USER (Level 1):
- View own profile
- Create bookings
- View available rooms
- Cannot assign any roles
```

### Permission Categories
```typescript
User Management: view_users, create_users, update_users, delete_users, assign_roles
Room Management: view_rooms, create_rooms, update_rooms, delete_rooms, manage_availability
Booking Management: view_all_bookings, view_own_bookings, create_bookings, update_bookings, delete_bookings, cancel_bookings
System Administration: view_system_logs, manage_settings, backup_restore
Profile Management: view_own_profile, update_own_profile
```

## Security Considerations

### Authentication Requirements
- All role management endpoints require valid JWT authentication
- Permission middleware always runs after authentication middleware
- Token validation includes role information verification

### Authorization Levels
- **Role Assignment:** Admin only (highest security)
- **Role Viewing:** Admin and Staff (moderate security)
- **Permission Checks:** All authenticated users (standard security)

### Audit Trail
- All role changes logged with timestamp, admin details, and reason
- IP address and user agent tracking for security monitoring
- Immutable audit log (no deletions allowed)

### Rate Limiting
- Role assignment: 10 requests per 15 minutes per IP
- Role updates: 10 requests per 15 minutes per IP
- User listing: 60 requests per minute per IP
- Role validation: 30 requests per minute per IP

## Integration Points

### Existing Authentication System
- Extends current user model without modifications
- Uses existing JWT middleware patterns
- Follows established auth service patterns
- Maintains backward compatibility

### Database Integration
- Uses existing MongoDB connection
- Follows existing model patterns
- Uses existing error handling utilities
- Maintains consistent response formats

### Frontend Integration
- Uses existing API service patterns
- Follows established TypeScript type patterns
- Uses existing form validation patterns
- Maintains consistent UI/UX patterns

## Testing Strategy

### Backend Testing
- Unit tests for service layer methods
- Integration tests for API endpoints
- Middleware testing for permission checks
- Database testing for audit log creation

### Frontend Testing
- Component testing for role management UI
- API service testing with mock responses
- Permission-based rendering testing
- Form validation testing

### End-to-End Testing
- Complete role assignment flow
- Permission-based access control
- Audit trail verification
- Error handling scenarios

## Performance Considerations

### Database Optimization
- Index on user.role for fast role-based queries
- Index on audit log timestamp for efficient log retrieval
- Pagination for large user lists
- Query optimization for role filtering

### Caching Strategy
- Cache user role information in JWT token
- Cache permission mappings in memory
- Minimize database queries for permission checks

### Scalability
- Support for role-based user segmentation
- Efficient permission checking algorithms
- Audit log archiving strategy for long-term storage
