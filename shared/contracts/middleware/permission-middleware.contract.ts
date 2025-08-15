// AUTO-GENERATED FROM PLANNED CODE - DO NOT MODIFY
// This contract defines the EXACT middleware patterns for permission-middleware.ts
// ALL future development MUST use these exact middleware signatures and patterns

/**
 * CRITICAL MIDDLEWARE NAMING RULES:
 * - MUST use "requireRole" (NOT checkRole, verifyRole, hasRole)
 * - MUST use "requirePermission" (NOT checkPermission, verifyPermission, hasPermission)  
 * - MUST use "requireAnyRole" (NOT checkAnyRole, hasAnyRole)
 * - MUST use "requireAllRoles" (NOT checkAllRoles, hasAllRoles)
 * - MUST use "req.user" to read user data (consistent with auth middleware)
 * - MUST use same error response format as auth middleware
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole, USER_ROLES } from '../models/user.contract';
import { AuthenticatedRequest } from './auth-middleware.contract';

// ============================================================================
// PERMISSION DEFINITIONS (BUSINESS LOGIC)
// ============================================================================

export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  ASSIGN_ROLES: 'assign_roles',
  
  // Room Management
  VIEW_ROOMS: 'view_rooms',
  CREATE_ROOMS: 'create_rooms',
  UPDATE_ROOMS: 'update_rooms',
  DELETE_ROOMS: 'delete_rooms',
  MANAGE_ROOM_AVAILABILITY: 'manage_room_availability',
  
  // Booking Management
  VIEW_ALL_BOOKINGS: 'view_all_bookings',
  VIEW_OWN_BOOKINGS: 'view_own_bookings',
  CREATE_BOOKINGS: 'create_bookings',
  UPDATE_BOOKINGS: 'update_bookings',
  DELETE_BOOKINGS: 'delete_bookings',
  CANCEL_BOOKINGS: 'cancel_bookings',
  
  // System Administration
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  MANAGE_SETTINGS: 'manage_settings',
  BACKUP_RESTORE: 'backup_restore',
  
  // Profile Management
  VIEW_OWN_PROFILE: 'view_own_profile',
  UPDATE_OWN_PROFILE: 'update_own_profile'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ============================================================================
// ROLE-PERMISSION MAPPING (BUSINESS LOGIC)
// ============================================================================

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Full access to everything
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.UPDATE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.CREATE_ROOMS,
    PERMISSIONS.UPDATE_ROOMS,
    PERMISSIONS.DELETE_ROOMS,
    PERMISSIONS.MANAGE_ROOM_AVAILABILITY,
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.UPDATE_BOOKINGS,
    PERMISSIONS.DELETE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS,
    PERMISSIONS.VIEW_SYSTEM_LOGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.BACKUP_RESTORE,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE
  ],
  
  [USER_ROLES.STAFF]: [
    // Limited user management
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.UPDATE_USERS, // Can update user profiles but not create/delete
    
    // Full room management
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.CREATE_ROOMS,
    PERMISSIONS.UPDATE_ROOMS,
    PERMISSIONS.MANAGE_ROOM_AVAILABILITY,
    
    // Full booking management
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.UPDATE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS,
    
    // Own profile
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE
  ],
  
  [USER_ROLES.USER]: [
    // Basic room viewing
    PERMISSIONS.VIEW_ROOMS,
    
    // Own bookings only
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS, // Can cancel own bookings
    
    // Own profile
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE
  ]
} as const;

// ============================================================================
// MIDDLEWARE FUNCTION SIGNATURES (FOLLOWING AUTH MIDDLEWARE PATTERNS)
// ============================================================================

export interface PermissionMiddlewareContract {
  // MUST use exact function name: requireRole
  requireRole(
    role: UserRole
  ): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
  
  // MUST use exact function name: requireAnyRole
  requireAnyRole(
    roles: UserRole[]
  ): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
  
  // MUST use exact function name: requireAllRoles
  requireAllRoles(
    roles: UserRole[]
  ): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
  
  // MUST use exact function name: requirePermission
  requirePermission(
    permission: Permission
  ): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
  
  // MUST use exact function name: requireAnyPermission
  requireAnyPermission(
    permissions: Permission[]
  ): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
  
  // MUST use exact function name: requireAllPermissions
  requireAllPermissions(
    permissions: Permission[]
  ): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void>;
}

// ============================================================================
// HELPER FUNCTION SIGNATURES (INTERNAL UTILITIES)
// ============================================================================

export interface PermissionHelperContract {
  // Check if user has specific role
  hasRole(user: AuthenticatedRequest['user'], role: UserRole): boolean;
  
  // Check if user has any of the specified roles
  hasAnyRole(user: AuthenticatedRequest['user'], roles: UserRole[]): boolean;
  
  // Check if user has all of the specified roles
  hasAllRoles(user: AuthenticatedRequest['user'], roles: UserRole[]): boolean;
  
  // Check if user has specific permission
  hasPermission(user: AuthenticatedRequest['user'], permission: Permission): boolean;
  
  // Check if user has any of the specified permissions
  hasAnyPermission(user: AuthenticatedRequest['user'], permissions: Permission[]): boolean;
  
  // Check if user has all of the specified permissions
  hasAllPermissions(user: AuthenticatedRequest['user'], permissions: Permission[]): boolean;
  
  // Get all permissions for a role
  getRolePermissions(role: UserRole): Permission[];
  
  // Get user's current role
  getUserRole(user: AuthenticatedRequest['user']): UserRole | null;
}

// ============================================================================
// AUTHENTICATED REQUEST EXTENSION (FOLLOWING AUTH MIDDLEWARE)
// ============================================================================

export interface AuthenticatedRequestWithRole extends AuthenticatedRequest {
  user: AuthenticatedRequest['user'] & {
    role?: UserRole; // Extended to include role information
  };
}

// ============================================================================
// ERROR RESPONSES (FOLLOWING AUTH MIDDLEWARE PATTERNS)
// ============================================================================

export const PERMISSION_MIDDLEWARE_ERRORS = {
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
  },
  MULTIPLE_ROLES_REQUIRED: {
    error: 'Access denied. Multiple roles are required.',
    code: 'MULTIPLE_ROLES_REQUIRED',
    status: 403
  },
  MULTIPLE_PERMISSIONS_REQUIRED: {
    error: 'Access denied. Multiple permissions are required.',
    code: 'MULTIPLE_PERMISSIONS_REQUIRED',
    status: 403
  },
  USER_ROLE_NOT_FOUND: {
    error: 'User role information not available.',
    code: 'USER_ROLE_NOT_FOUND',
    status: 403
  },
  INTERNAL_ERROR: {
    error: 'Internal server error during permission check.',
    code: 'INTERNAL_ERROR',
    status: 500
  }
} as const;

// ============================================================================
// MIDDLEWARE EXPORT PATTERN (FOLLOWING AUTH MIDDLEWARE PATTERNS)
// ============================================================================

/**
 * CRITICAL: Middleware must be exported in exact pattern
 * Individual exports AND named object export
 */
export interface PermissionMiddlewareExport {
  requireRole: (role: UserRole) => (req: AuthenticatedRequestWithRole, res: Response, next: NextFunction) => Promise<Response | void>;
  requireAnyRole: (roles: UserRole[]) => (req: AuthenticatedRequestWithRole, res: Response, next: NextFunction) => Promise<Response | void>;
  requireAllRoles: (roles: UserRole[]) => (req: AuthenticatedRequestWithRole, res: Response, next: NextFunction) => Promise<Response | void>;
  requirePermission: (permission: Permission) => (req: AuthenticatedRequestWithRole, res: Response, next: NextFunction) => Promise<Response | void>;
  requireAnyPermission: (permissions: Permission[]) => (req: AuthenticatedRequestWithRole, res: Response, next: NextFunction) => Promise<Response | void>;
  requireAllPermissions: (permissions: Permission[]) => (req: AuthenticatedRequestWithRole, res: Response, next: NextFunction) => Promise<Response | void>;
}

// Default export pattern
export interface PermissionMiddlewareDefault {
  requireRole: PermissionMiddlewareContract['requireRole'];
  requireAnyRole: PermissionMiddlewareContract['requireAnyRole'];
  requireAllRoles: PermissionMiddlewareContract['requireAllRoles'];
  requirePermission: PermissionMiddlewareContract['requirePermission'];
  requireAnyPermission: PermissionMiddlewareContract['requireAnyPermission'];
  requireAllPermissions: PermissionMiddlewareContract['requireAllPermissions'];
}

// ============================================================================
// MIDDLEWARE USAGE PATTERNS
// ============================================================================

/**
 * ROUTE PROTECTION PATTERNS:
 * 
 * 1. Single role requirement:
 *    router.get('/admin-only', requireAuth(), requireRole('admin'), handler);
 * 
 * 2. Multiple role options:
 *    router.get('/admin-or-staff', requireAuth(), requireAnyRole(['admin', 'staff']), handler);
 * 
 * 3. Single permission:
 *    router.post('/create-room', requireAuth(), requirePermission('create_rooms'), handler);
 * 
 * 4. Multiple permissions:
 *    router.delete('/delete-user', requireAuth(), requireAllPermissions(['delete_users', 'view_users']), handler);
 * 
 * 5. Combined with auth middleware:
 *    router.use(requireAuth()); // First authenticate
 *    router.get('/protected', requireRole('admin'), handler); // Then authorize
 */
export const MIDDLEWARE_USAGE_PATTERNS = {
  SINGLE_ROLE: 'requireRole(role)',
  MULTIPLE_ROLES: 'requireAnyRole(roles)',
  ALL_ROLES: 'requireAllRoles(roles)',
  SINGLE_PERMISSION: 'requirePermission(permission)',
  MULTIPLE_PERMISSIONS: 'requireAnyPermission(permissions)',
  ALL_PERMISSIONS: 'requireAllPermissions(permissions)',
  COMBINED_AUTH: 'requireAuth() + requireRole(role)'
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - checkRole() (use requireRole)
 * - verifyRole() (use requireRole)
 * - hasRole() (use requireRole for middleware)
 * - checkPermission() (use requirePermission)
 * - verifyPermission() (use requirePermission)
 * - hasPermission() (use requirePermission for middleware)
 * - req.currentUser (use req.user)
 * - Different error messages than specified
 * - Different error codes than specified
 * - Different HTTP status codes than specified
 * - Not checking if req.user exists before checking role
 * - Not using AuthenticatedRequestWithRole interface
 * - Hardcoding role/permission checks instead of using mapping
 * - Not following the established auth middleware patterns
 * - Using different export patterns than auth middleware
 */
