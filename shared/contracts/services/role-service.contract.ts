// AUTO-GENERATED FROM PLANNED CODE - DO NOT MODIFY
// This contract defines the EXACT service method signatures for role-service.ts
// ALL future development MUST use these exact method names and signatures

/**
 * CRITICAL METHOD NAMING RULES:
 * - MUST use "assignUserRole" (NOT assignRole, setUserRole, updateRole)
 * - MUST use "getUserRole" (NOT getRole, fetchUserRole, retrieveRole)  
 * - MUST use "updateUserRole" (NOT changeRole, modifyRole, setRole)
 * - MUST use "getUsersByRole" (NOT findByRole, getUsersWithRole)
 * - MUST use "validateRoleAssignment" (NOT checkRole, verifyRole)
 */

import { UserRole, USER_ROLES } from '../models/user.contract';

// ============================================================================
// SERVICE REQUEST INTERFACES (FOLLOWING AUTH SERVICE PATTERNS)
// ============================================================================

export interface AssignRoleData {
  userId: string;
  role: UserRole;
  assignedBy: string; // ID of admin assigning the role
}

export interface UpdateRoleData {
  userId: string;
  currentRole: UserRole;
  newRole: UserRole;
  updatedBy: string; // ID of admin updating the role
}

export interface RoleQueryData {
  role?: UserRole;
  limit?: number;
  page?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// SERVICE RESPONSE INTERFACES (FOLLOWING AUTH SERVICE PATTERNS)
// ============================================================================

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

export interface UserRoleInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignRoleResponse {
  user: UserRoleInfo;
  previousRole: UserRole;
  newRole: UserRole;
  assignedBy: string;
  message: string;
}

export interface UpdateRoleResponse {
  user: UserRoleInfo;
  previousRole: UserRole;
  newRole: UserRole;
  updatedBy: string;
  message: string;
}

export interface GetUserRoleResponse {
  user: UserRoleInfo;
}

export interface GetUsersByRoleResponse {
  users: UserRoleInfo[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RoleValidationResponse {
  isValid: boolean;
  canAssign: boolean;
  reason?: string;
}

// ============================================================================
// ROLE SERVICE METHOD SIGNATURES (FOLLOWING AUTH SERVICE PATTERNS)
// ============================================================================

export interface RoleServiceContract {
  // MUST use exact method name: assignUserRole
  assignUserRole(roleData: AssignRoleData): Promise<ServiceResponse<AssignRoleResponse>>;
  
  // MUST use exact method name: getUserRole
  getUserRole(userId: string): Promise<ServiceResponse<GetUserRoleResponse>>;
  
  // MUST use exact method name: updateUserRole
  updateUserRole(roleData: UpdateRoleData): Promise<ServiceResponse<UpdateRoleResponse>>;
  
  // MUST use exact method name: getUsersByRole
  getUsersByRole(queryData: RoleQueryData): Promise<ServiceResponse<GetUsersByRoleResponse>>;
  
  // MUST use exact method name: validateRoleAssignment
  validateRoleAssignment(assignerId: string, targetRole: UserRole): Promise<ServiceResponse<RoleValidationResponse>>;
}

// ============================================================================
// ROLE HIERARCHY DEFINITIONS (BUSINESS LOGIC)
// ============================================================================

export const ROLE_HIERARCHY = {
  ADMIN: {
    level: 3,
    permissions: ['all'],
    canManage: ['user', 'staff', 'admin']
  },
  STAFF: {
    level: 2,
    permissions: ['read_users', 'manage_bookings', 'manage_rooms'],
    canManage: ['user']
  },
  USER: {
    level: 1,
    permissions: ['read_own_profile', 'create_bookings', 'view_rooms'],
    canManage: []
  }
} as const;

export type RoleLevel = typeof ROLE_HIERARCHY[keyof typeof ROLE_HIERARCHY]['level'];

// ============================================================================
// ROLE VALIDATION RULES (BUSINESS LOGIC)
// ============================================================================

export const ROLE_VALIDATION_RULES = {
  // Only admins can assign admin role
  ADMIN_ASSIGNMENT: {
    requiredRole: USER_ROLES.ADMIN,
    targetRole: USER_ROLES.ADMIN,
    rule: 'Only admins can assign admin role'
  },
  
  // Only admins can assign staff role
  STAFF_ASSIGNMENT: {
    requiredRole: USER_ROLES.ADMIN,
    targetRole: USER_ROLES.STAFF,
    rule: 'Only admins can assign staff role'
  },
  
  // Admins and staff can assign user role
  USER_ASSIGNMENT: {
    requiredRoles: [USER_ROLES.ADMIN, USER_ROLES.STAFF],
    targetRole: USER_ROLES.USER,
    rule: 'Admins and staff can assign user role'
  },
  
  // Users cannot assign any roles
  USER_RESTRICTION: {
    restrictedRole: USER_ROLES.USER,
    rule: 'Users cannot assign any roles'
  }
} as const;

// ============================================================================
// ERROR CODES (FOLLOWING AUTH SERVICE PATTERNS)
// ============================================================================

export const ROLE_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ROLE_ASSIGNMENT_DENIED: 'ROLE_ASSIGNMENT_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_ROLE: 'INVALID_ROLE',
  SELF_ROLE_MODIFICATION: 'SELF_ROLE_MODIFICATION',
  ROLE_ALREADY_ASSIGNED: 'ROLE_ALREADY_ASSIGNED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED'
} as const;

export type RoleErrorCode = typeof ROLE_ERROR_CODES[keyof typeof ROLE_ERROR_CODES];

// ============================================================================
// SERVICE EXPORT PATTERN (FOLLOWING AUTH SERVICE PATTERNS)
// ============================================================================

/**
 * CRITICAL: Service must be exported as named object with all methods
 * MUST use exact export name: roleService
 */
export interface RoleServiceExport {
  assignUserRole: (roleData: AssignRoleData) => Promise<ServiceResponse<AssignRoleResponse>>;
  getUserRole: (userId: string) => Promise<ServiceResponse<GetUserRoleResponse>>;
  updateUserRole: (roleData: UpdateRoleData) => Promise<ServiceResponse<UpdateRoleResponse>>;
  getUsersByRole: (queryData: RoleQueryData) => Promise<ServiceResponse<GetUsersByRoleResponse>>;
  validateRoleAssignment: (assignerId: string, targetRole: UserRole) => Promise<ServiceResponse<RoleValidationResponse>>;
}

// ============================================================================
// ROLE AUDIT LOG INTERFACE (FOR TRACKING CHANGES)
// ============================================================================

export interface RoleAuditLog {
  id: string;
  userId: string;
  previousRole: UserRole;
  newRole: UserRole;
  changedBy: string;
  reason?: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface CreateAuditLogData {
  userId: string;
  previousRole: UserRole;
  newRole: UserRole;
  changedBy: string;
  reason?: string;
  ipAddress?: string;
}

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - assignRole() (use assignUserRole)
 * - setUserRole() (use assignUserRole)
 * - updateRole() (use updateUserRole)
 * - changeRole() (use updateUserRole)
 * - getRole() (use getUserRole)
 * - fetchUserRole() (use getUserRole)
 * - findByRole() (use getUsersByRole)
 * - getUsersWithRole() (use getUsersByRole)
 * - checkRole() (use validateRoleAssignment)
 * - verifyRole() (use validateRoleAssignment)
 * - Different response structure than ServiceResponse<T>
 * - Different error codes than specified
 * - Bypassing role hierarchy validation
 * - Not tracking role changes in audit log
 */
