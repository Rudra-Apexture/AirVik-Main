// AUTO-GENERATED FROM PLANNED CODE - DO NOT MODIFY
// This contract defines the EXACT API endpoints and formats for role-controller.ts
// ALL future development MUST use these exact endpoints and response formats

/**
 * CRITICAL API NAMING RULES:
 * - MUST use "/api/v1/roles/" prefix for ALL role endpoints
 * - MUST use "assign" (NOT set, update, change)
 * - MUST use "user/:userId/role" (NOT user-role, role-assignment)
 * - MUST use "users-by-role" (NOT users/role, role-users)
 * - MUST follow exact same patterns as auth API contract
 */

import { UserRole, USER_ROLES } from '../models/user.contract';
import { ServiceResponse } from '../services/role-service.contract';

// ============================================================================
// API ENDPOINTS (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_API_ENDPOINTS = {
  ASSIGN_ROLE: '/api/v1/roles/assign',
  GET_USER_ROLE: '/api/v1/roles/user/:userId/role',
  UPDATE_ROLE: '/api/v1/roles/update',
  GET_USERS_BY_ROLE: '/api/v1/roles/users-by-role',
  VALIDATE_ASSIGNMENT: '/api/v1/roles/validate-assignment'
} as const;

// ============================================================================
// HTTP METHODS (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_API_METHODS = {
  ASSIGN_ROLE: 'POST',
  GET_USER_ROLE: 'GET',
  UPDATE_ROLE: 'PUT',
  GET_USERS_BY_ROLE: 'GET',
  VALIDATE_ASSIGNMENT: 'POST'
} as const;

// ============================================================================
// REQUEST BODY SCHEMAS (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export interface AssignRoleRequest {
  userId: string;
  role: UserRole;
  reason?: string; // Optional reason for assignment
}

export interface UpdateRoleRequest {
  userId: string;
  newRole: UserRole;
  reason?: string; // Optional reason for update
}

export interface GetUsersByRoleRequest {
  role?: UserRole;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ValidateAssignmentRequest {
  targetUserId: string;
  targetRole: UserRole;
}

// ============================================================================
// VALIDATION RULES (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_VALIDATION_RULES = {
  userId: {
    required: true,
    type: 'string',
    minLength: 24,
    maxLength: 24,
    pattern: /^[0-9a-fA-F]{24}$/,
    description: 'Must be a valid MongoDB ObjectId'
  },
  role: {
    required: true,
    enum: Object.values(USER_ROLES),
    description: 'Must be one of: user, staff, admin'
  },
  reason: {
    required: false,
    type: 'string',
    maxLength: 500,
    trim: true,
    description: 'Optional reason for role change (max 500 characters)'
  },
  page: {
    required: false,
    type: 'number',
    min: 1,
    default: 1,
    description: 'Page number for pagination'
  },
  limit: {
    required: false,
    type: 'number',
    min: 1,
    max: 100,
    default: 10,
    description: 'Number of items per page (max 100)'
  },
  sortBy: {
    required: false,
    enum: ['name', 'email', 'createdAt'],
    default: 'createdAt',
    description: 'Field to sort by'
  },
  sortOrder: {
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
    description: 'Sort order'
  },
  targetUserId: {
    required: true,
    type: 'string',
    minLength: 24,
    maxLength: 24,
    pattern: /^[0-9a-fA-F]{24}$/,
    description: 'Must be a valid MongoDB ObjectId'
  },
  targetRole: {
    required: true,
    enum: Object.values(USER_ROLES),
    description: 'Must be one of: user, staff, admin'
  }
} as const;

// ============================================================================
// VALIDATION ERROR MESSAGES (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_VALIDATION_MESSAGES = {
  userId: {
    empty: 'User ID is required',
    invalid: 'User ID must be a valid MongoDB ObjectId',
    length: 'User ID must be exactly 24 characters'
  },
  role: {
    empty: 'Role is required',
    invalid: 'Role must be one of: user, staff, admin'
  },
  reason: {
    length: 'Reason must not exceed 500 characters'
  },
  page: {
    invalid: 'Page must be a positive number',
    min: 'Page must be at least 1'
  },
  limit: {
    invalid: 'Limit must be a positive number',
    min: 'Limit must be at least 1',
    max: 'Limit must not exceed 100'
  },
  sortBy: {
    invalid: 'Sort field must be one of: name, email, createdAt'
  },
  sortOrder: {
    invalid: 'Sort order must be either asc or desc'
  },
  targetUserId: {
    empty: 'Target User ID is required',
    invalid: 'Target User ID must be a valid MongoDB ObjectId'
  },
  targetRole: {
    empty: 'Target role is required',
    invalid: 'Target role must be one of: user, staff, admin'
  }
} as const;

// ============================================================================
// SUCCESS RESPONSE DATA (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export interface AssignRoleSuccessData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  previousRole: UserRole;
  newRole: UserRole;
  assignedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reason?: string;
  message: string;
}

export interface GetUserRoleSuccessData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateRoleSuccessData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  previousRole: UserRole;
  newRole: UserRole;
  updatedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reason?: string;
  message: string;
}

export interface GetUsersByRoleSuccessData {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    role?: UserRole;
    sortBy: string;
    sortOrder: string;
  };
}

export interface ValidateAssignmentSuccessData {
  canAssign: boolean;
  validation: {
    isValid: boolean;
    requiredRole?: UserRole;
    currentUserRole: UserRole;
    targetRole: UserRole;
    reason?: string;
  };
  message: string;
}

// ============================================================================
// ERROR CODES WITH HTTP STATUS (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_API_ERROR_CODES = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Request validation failed',
    status: 400
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    status: 404
  },
  ROLE_ASSIGNMENT_DENIED: {
    code: 'ROLE_ASSIGNMENT_DENIED',
    message: 'You do not have permission to assign this role',
    status: 403
  },
  INSUFFICIENT_PERMISSIONS: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'You do not have sufficient permissions',
    status: 403
  },
  INVALID_ROLE: {
    code: 'INVALID_ROLE',
    message: 'Invalid role specified',
    status: 400
  },
  SELF_ROLE_MODIFICATION: {
    code: 'SELF_ROLE_MODIFICATION',
    message: 'You cannot modify your own role',
    status: 403
  },
  ROLE_ALREADY_ASSIGNED: {
    code: 'ROLE_ALREADY_ASSIGNED',
    message: 'User already has the specified role',
    status: 400
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    status: 401
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
    status: 500
  }
} as const;

// ============================================================================
// CONTROLLER METHOD SIGNATURES (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export interface RoleControllerContract {
  // MUST use exact method name: assignRole
  assignRole(req: Request, res: Response): Promise<Response>;
  
  // MUST use exact method name: getUserRole
  getUserRole(req: Request, res: Response): Promise<Response>;
  
  // MUST use exact method name: updateRole
  updateRole(req: Request, res: Response): Promise<Response>;
  
  // MUST use exact method name: getUsersByRole
  getUsersByRole(req: Request, res: Response): Promise<Response>;
  
  // MUST use exact method name: validateAssignment
  validateAssignment(req: Request, res: Response): Promise<Response>;
}

// ============================================================================
// CONTROLLER EXPORT PATTERN (FOLLOWING AUTH API PATTERNS)
// ============================================================================

/**
 * CRITICAL: Controller must be exported as named object with all methods
 * MUST use exact export name: roleController
 */
export interface RoleControllerExport {
  assignRole: (req: Request, res: Response) => Promise<Response>;
  getUserRole: (req: Request, res: Response) => Promise<Response>;
  updateRole: (req: Request, res: Response) => Promise<Response>;
  getUsersByRole: (req: Request, res: Response) => Promise<Response>;
  validateAssignment: (req: Request, res: Response) => Promise<Response>;
}

// ============================================================================
// ROUTE REGISTRATION PATTERN (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_ROUTE_PATTERNS = {
  // POST /api/v1/roles/assign - Assign role to user
  ASSIGN_ROLE: {
    method: 'POST',
    path: '/api/v1/roles/assign',
    middleware: ['requireAuth()', 'requireRole("admin")'], // Only admins can assign roles
    controller: 'roleController.assignRole',
    description: 'Assign a role to a user'
  },
  
  // GET /api/v1/roles/user/:userId/role - Get user's role
  GET_USER_ROLE: {
    method: 'GET',
    path: '/api/v1/roles/user/:userId/role',
    middleware: ['requireAuth()', 'requireAnyRole(["admin", "staff"])'], // Admins and staff can view roles
    controller: 'roleController.getUserRole',
    description: 'Get a specific user\'s role'
  },
  
  // PUT /api/v1/roles/update - Update user's role
  UPDATE_ROLE: {
    method: 'PUT',
    path: '/api/v1/roles/update',
    middleware: ['requireAuth()', 'requireRole("admin")'], // Only admins can update roles
    controller: 'roleController.updateRole',
    description: 'Update a user\'s role'
  },
  
  // GET /api/v1/roles/users-by-role - Get users by role with pagination
  GET_USERS_BY_ROLE: {
    method: 'GET',
    path: '/api/v1/roles/users-by-role',
    middleware: ['requireAuth()', 'requireAnyRole(["admin", "staff"])'], // Admins and staff can list users
    controller: 'roleController.getUsersByRole',
    description: 'Get paginated list of users by role'
  },
  
  // POST /api/v1/roles/validate-assignment - Validate if assignment is allowed
  VALIDATE_ASSIGNMENT: {
    method: 'POST',
    path: '/api/v1/roles/validate-assignment',
    middleware: ['requireAuth()', 'requireAnyRole(["admin", "staff"])'], // Admins and staff can validate
    controller: 'roleController.validateAssignment',
    description: 'Validate if role assignment is allowed'
  }
} as const;

// ============================================================================
// RATE LIMITING CONFIGURATION (FOLLOWING AUTH API PATTERNS)
// ============================================================================

export const ROLE_API_RATE_LIMITS = {
  ASSIGN_ROLE: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 role assignments per 15 minutes
    message: 'Too many role assignment attempts, please try again later'
  },
  UPDATE_ROLE: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 role updates per 15 minutes
    message: 'Too many role update attempts, please try again later'
  },
  GET_USERS_BY_ROLE: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'Too many requests, please try again later'
  },
  VALIDATE_ASSIGNMENT: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 validations per minute
    message: 'Too many validation requests, please try again later'
  }
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - "/api/v1/role/" (use "/api/v1/roles/")
 * - "set-role" (use "assign")
 * - "change-role" (use "update")
 * - "role-assignment" (use "assign")
 * - "users/by-role" (use "users-by-role")
 * - "role/:role/users" (use "users-by-role" with query params)
 * - Different validation rules than specified
 * - Different error codes than specified
 * - Different HTTP status codes than specified
 * - Different response structure than established pattern
 * - Not following the established middleware patterns
 * - Not implementing rate limiting
 * - Not validating MongoDB ObjectIds properly
 * - Different controller method names than specified
 * - Different export patterns than auth controller
 */
