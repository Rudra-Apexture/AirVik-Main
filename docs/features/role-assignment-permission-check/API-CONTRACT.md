# Role Assignment & Permission Check API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### 1. Assign Role - POST /api/v1/roles/assign
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/roles/assign
- Middleware: requireAuth(), requireRole("admin")
- Request Body:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "staff",
  "reason": "Promoted to staff position"
}
```

**Success Response (200):**
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

**Error Response (403):**
```json
{
  "success": false,
  "error": "You do not have permission to assign this role",
  "code": "ROLE_ASSIGNMENT_DENIED"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### 2. Get User Role - GET /api/v1/roles/user/:userId/role
**Backend MUST provide:**
- Method: GET
- URL: /api/v1/roles/user/:userId/role
- Middleware: requireAuth(), requireAnyRole(["admin", "staff"])
- URL Parameters: userId (MongoDB ObjectId)

**Success Response (200):**
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

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### 3. Update Role - PUT /api/v1/roles/update
**Backend MUST provide:**
- Method: PUT
- URL: /api/v1/roles/update
- Middleware: requireAuth(), requireRole("admin")
- Request Body:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "newRole": "admin",
  "reason": "Promoted to administrator"
}
```

**Success Response (200):**
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

**Error Response (403):**
```json
{
  "success": false,
  "error": "You cannot modify your own role",
  "code": "SELF_ROLE_MODIFICATION"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### 4. Get Users By Role - GET /api/v1/roles/users-by-role
**Backend MUST provide:**
- Method: GET
- URL: /api/v1/roles/users-by-role
- Middleware: requireAuth(), requireAnyRole(["admin", "staff"])
- Query Parameters:
  - role (optional): user | staff | admin
  - page (optional): number (default: 1)
  - limit (optional): number (default: 10, max: 100)
  - sortBy (optional): name | email | createdAt (default: createdAt)
  - sortOrder (optional): asc | desc (default: desc)

**Success Response (200):**
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
      "sortBy": "createdAt",
      "sortOrder": "desc"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid role specified",
  "code": "INVALID_ROLE"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### 5. Validate Assignment - POST /api/v1/roles/validate-assignment
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/roles/validate-assignment
- Middleware: requireAuth(), requireAnyRole(["admin", "staff"])
- Request Body:
```json
{
  "targetUserId": "507f1f77bcf86cd799439011",
  "targetRole": "admin"
}
```

**Success Response (200):**
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

**Success Response - Not Allowed (200):**
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

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

## CRITICAL VALIDATION RULES:
1. **userId/targetUserId:** Must be valid 24-character MongoDB ObjectId
2. **role/newRole/targetRole:** Must be one of: "user", "staff", "admin"
3. **reason:** Optional string, max 500 characters
4. **page:** Positive integer, minimum 1
5. **limit:** Positive integer, minimum 1, maximum 100
6. **sortBy:** Must be one of: "name", "email", "createdAt"
7. **sortOrder:** Must be one of: "asc", "desc"

## AUTHENTICATION & AUTHORIZATION:
- **All endpoints:** Require authentication (requireAuth())
- **Assign/Update Role:** Only admins (requireRole("admin"))
- **Get Role/Users/Validate:** Admins and staff (requireAnyRole(["admin", "staff"]))

## RATE LIMITING:
- **Assign/Update Role:** 10 requests per 15 minutes
- **Get Users:** 60 requests per minute
- **Get Role/Validate:** 30 requests per minute
