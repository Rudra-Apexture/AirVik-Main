# Role Assignment & Permission Check API Documentation

## CRITICAL: Prevents API mismatches between frontend and backend!

## Contract Agreement: Backend provides → Frontend expects → MUST MATCH EXACTLY

---

## Assign Role - POST /api/v1/roles/assign

### Contract Agreement:
Backend provides role assignment endpoint → Frontend expects exact response structure → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/roles/role.controller.ts`
- **Service:** `backend/src/services/roles/role.service.ts`
- **Validation:** `backend/src/validators/role.validator.ts`
- **Middleware:** `requireAuth()`, `requireRole("admin")`
- **Rate Limit:** 10 requests per 15 minutes

### Frontend Usage:
- **Service call:** `frontend/src/services/role.service.ts`
- **Component:** `frontend/src/components/admin/UserRoleAssignment.tsx`

### Request:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "staff",
  "reason": "Promoted to staff position"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "staff",
      "isEmailVerified": true,
      "createdAt": "2025-07-30T03:36:01.000Z",
      "updatedAt": "2025-07-30T03:36:01.000Z"
    },
    "previousRole": "user",
    "newRole": "staff",
    "assignedBy": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Admin",
      "lastName": "User",  
      "email": "admin@example.com"
    },
    "reason": "Promoted to staff position",
    "message": "Role assigned successfully"
  }
}
```

### Response Error (403):
```json
{
  "success": false,
  "error": "You do not have permission to assign this role",
  "code": "ROLE_ASSIGNMENT_DENIED"
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "User already has the specified role",
  "code": "ROLE_ALREADY_ASSIGNED"
}
```

---

## Get User Role - GET /api/v1/roles/user/:userId/role

### Contract Agreement:
Backend provides user role retrieval → Frontend expects user role data → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/roles/role.controller.ts`
- **Service:** `backend/src/services/roles/role.service.ts`
- **Validation:** URL parameter validation for MongoDB ObjectId
- **Middleware:** `requireAuth()`, `requireAnyRole(["admin", "staff"])`
- **Rate Limit:** 30 requests per minute

### Frontend Usage:
- **Service call:** `frontend/src/services/role.service.ts`
- **Component:** `frontend/src/components/admin/UserRoleList.tsx`

### Request:
- URL Parameter: `userId` (24-character MongoDB ObjectId)
- Example: `/api/v1/roles/user/507f1f77bcf86cd799439011/role`

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "staff",
      "isEmailVerified": true,
      "createdAt": "2025-07-30T03:36:01.000Z",
      "updatedAt": "2025-07-30T03:36:01.000Z"
    }
  }
}
```

### Response Error (404):
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

---

## Update Role - PUT /api/v1/roles/update

### Contract Agreement:
Backend provides role update endpoint → Frontend expects role update confirmation → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/roles/role.controller.ts`
- **Service:** `backend/src/services/roles/role.service.ts`
- **Validation:** `backend/src/validators/role.validator.ts`
- **Middleware:** `requireAuth()`, `requireRole("admin")`
- **Rate Limit:** 10 requests per 15 minutes

### Frontend Usage:
- **Service call:** `frontend/src/services/role.service.ts`
- **Component:** `frontend/src/components/admin/UserRoleAssignment.tsx`

### Request:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "newRole": "admin",
  "reason": "Promoted to administrator"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "admin",
      "isEmailVerified": true,
      "createdAt": "2025-07-30T03:36:01.000Z",
      "updatedAt": "2025-07-30T03:36:01.000Z"
    },
    "previousRole": "staff",
    "newRole": "admin",
    "updatedBy": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com"
    },
    "reason": "Promoted to administrator",
    "message": "Role updated successfully"
  }
}
```

### Response Error (403):
```json
{
  "success": false,
  "error": "You cannot modify your own role",
  "code": "SELF_ROLE_MODIFICATION"
}
```

---

## Get Users By Role - GET /api/v1/roles/users-by-role

### Contract Agreement:
Backend provides paginated user list → Frontend expects user list with pagination → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/roles/role.controller.ts`
- **Service:** `backend/src/services/roles/role.service.ts`
- **Validation:** Query parameter validation
- **Middleware:** `requireAuth()`, `requireAnyRole(["admin", "staff"])`
- **Rate Limit:** 60 requests per minute

### Frontend Usage:
- **Service call:** `frontend/src/services/role.service.ts`
- **Component:** `frontend/src/components/admin/UserRoleList.tsx`

### Request:
Query Parameters:
- `role` (optional): "user" | "staff" | "admin"
- `page` (optional): number (default: 1)
- `limit` (optional): number (default: 10, max: 100)
- `sortBy` (optional): "name" | "email" | "createdAt" (default: "createdAt")
- `sortOrder` (optional): "asc" | "desc" (default: "desc")

Example: `/api/v1/roles/users-by-role?role=staff&page=1&limit=10&sortBy=name&sortOrder=asc`

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "staff",
        "isEmailVerified": true,
        "createdAt": "2025-07-30T03:36:01.000Z",
        "updatedAt": "2025-07-30T03:36:01.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "role": "staff",
        "isEmailVerified": true,
        "createdAt": "2025-07-29T10:20:30.000Z",
        "updatedAt": "2025-07-29T10:20:30.000Z"
      }
    ],
    "pagination": {
      "totalCount": 25,
      "currentPage": 1,
      "totalPages": 3,
      "limit": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "filters": {
      "role": "staff",
      "sortBy": "name",
      "sortOrder": "asc"
    }
  }
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Invalid role specified",
  "code": "INVALID_ROLE"
}
```

---

## Validate Assignment - POST /api/v1/roles/validate-assignment

### Contract Agreement:
Backend provides assignment validation → Frontend expects validation result → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/roles/role.controller.ts`
- **Service:** `backend/src/services/roles/role.service.ts`
- **Validation:** `backend/src/validators/role.validator.ts`
- **Middleware:** `requireAuth()`, `requireAnyRole(["admin", "staff"])`
- **Rate Limit:** 30 requests per minute

### Frontend Usage:
- **Service call:** `frontend/src/services/role.service.ts`
- **Component:** `frontend/src/components/admin/RoleValidation.tsx`

### Request:
```json
{
  "targetUserId": "507f1f77bcf86cd799439011",
  "targetRole": "admin"
}
```

### Response Success - Can Assign (200):
```json
{
  "success": true,
  "data": {
    "canAssign": true,
    "validation": {
      "isValid": true,
      "requiredRole": "admin",
      "currentUserRole": "admin",
      "targetRole": "admin",
      "reason": "Admin can assign admin role"
    },
    "message": "Role assignment is allowed"
  }
}
```

### Response Success - Cannot Assign (200):
```json
{
  "success": true,
  "data": {
    "canAssign": false,
    "validation": {
      "isValid": false,
      "requiredRole": "admin",
      "currentUserRole": "staff",
      "targetRole": "admin",
      "reason": "Only admins can assign admin role"
    },
    "message": "Role assignment is not allowed"
  }
}
```

### Response Error (404):
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

---

## Permission Middleware Usage

### Individual Permission Check:
```typescript
// Single role requirement
router.get('/admin-only', requireAuth(), requireRole('admin'), handler);

// Multiple role options (OR logic)
router.get('/admin-or-staff', requireAuth(), requireAnyRole(['admin', 'staff']), handler);

// All roles required (AND logic - rare use case)
router.get('/super-secure', requireAuth(), requireAllRoles(['admin', 'staff']), handler);

// Single permission
router.post('/create-room', requireAuth(), requirePermission('create_rooms'), handler);

// Multiple permissions (OR logic)
router.get('/view-data', requireAuth(), requireAnyPermission(['view_users', 'view_rooms']), handler);

// All permissions required (AND logic)
router.delete('/delete-user', requireAuth(), requireAllPermissions(['delete_users', 'view_users']), handler);
```

### Middleware Error Responses:

#### Role Required (403):
```json
{
  "success": false,
  "error": "Access denied. Required role not found.",
  "code": "ROLE_REQUIRED"
}
```

#### Insufficient Role (403):
```json
{
  "success": false,
  "error": "Access denied. Insufficient role permissions.",
  "code": "INSUFFICIENT_ROLE"
}
```

#### Permission Denied (403):
```json
{
  "success": false,
  "error": "Access denied. Required permission not found.",
  "code": "PERMISSION_DENIED"
}
```

---

## Validation Rules

### User ID Validation:
- **Required:** true
- **Format:** 24-character hexadecimal string (MongoDB ObjectId)
- **Pattern:** `/^[0-9a-fA-F]{24}$/`
- **Error:** "User ID must be a valid MongoDB ObjectId"

### Role Validation:
- **Required:** true
- **Enum:** ["user", "staff", "admin"]
- **Error:** "Role must be one of: user, staff, admin"

### Reason Validation:
- **Required:** false
- **Type:** string
- **Max Length:** 500 characters
- **Trim:** true
- **Error:** "Reason must not exceed 500 characters"

### Pagination Validation:
- **page:** number, min: 1, default: 1
- **limit:** number, min: 1, max: 100, default: 10
- **sortBy:** enum ["name", "email", "createdAt"], default: "createdAt"
- **sortOrder:** enum ["asc", "desc"], default: "desc"

---

## Error Code Reference

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| USER_NOT_FOUND | 404 | User not found |
| ROLE_ASSIGNMENT_DENIED | 403 | No permission to assign role |
| INSUFFICIENT_PERMISSIONS | 403 | Insufficient permissions |
| INVALID_ROLE | 400 | Invalid role specified |
| SELF_ROLE_MODIFICATION | 403 | Cannot modify own role |
| ROLE_ALREADY_ASSIGNED | 400 | User already has specified role |
| UNAUTHORIZED | 401 | Authentication required |
| INTERNAL_ERROR | 500 | Internal server error |
| ROLE_REQUIRED | 403 | Required role not found |
| PERMISSION_DENIED | 403 | Required permission not found |

---

## Rate Limiting Configuration

| Endpoint | Window | Max Requests | Error Message |
|----------|--------|--------------|---------------|
| assign, update | 15 minutes | 10 | "Too many role assignment attempts, please try again later" |
| users-by-role | 1 minute | 60 | "Too many requests, please try again later" |
| get-role, validate | 1 minute | 30 | "Too many validation requests, please try again later" |

---

## Testing Examples

### Postman Collection Structure:
```json
{
  "info": {
    "name": "Role Assignment & Permission Check API Tests",
    "description": "Complete test suite for role management"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "adminToken",
      "value": "{{admin_jwt_token}}"
    }
  ],
  "item": [
    {
      "name": "Assign Role",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/v1/roles/assign",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{adminToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": \"507f1f77bcf86cd799439011\",\n  \"role\": \"staff\",\n  \"reason\": \"Promoted to staff position\"\n}"
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test(\"Status code is 200\", function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test(\"Response has success true\", function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.success).to.eql(true);",
              "});",
              "",
              "pm.test(\"Response has correct structure\", function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.data).to.have.property('user');",
              "    pm.expect(jsonData.data).to.have.property('previousRole');",
              "    pm.expect(jsonData.data).to.have.property('newRole');",
              "    pm.expect(jsonData.data).to.have.property('assignedBy');",
              "});"
            ]
          }
        }
      ]
    }
  ]
}
```
