import type { UserRole } from '../types/index';

/**
 * Normalize role from database format to frontend format
 * Handles backward compatibility with old role names
 */
export function normalizeUserRole(role: string | undefined, isAdmin?: boolean): UserRole {
  if (!role) {
    return isAdmin ? 'admin' : 'student';
  }
  
  // Handle old format mappings
  const roleMapping: Record<string, UserRole> = {
    'user': 'student',
    'superadmin': 'super_admin',
    'student': 'student',
    'student_admin': 'student_admin', 
    'admin': 'admin',
    'super_admin': 'super_admin'
  };
  
  return roleMapping[role] || (isAdmin ? 'admin' : 'student');
}

/**
 * Check if user has admin-level access
 */
export function hasAdminAccess(role: UserRole): boolean {
  return ['student_admin', 'admin', 'super_admin'].includes(role);
}

/**
 * Check if user can manage other users (super admin only)
 */
export function canManageUsers(role: UserRole): boolean {
  return role === 'super_admin';
}

/**
 * Get role display name
 */
export function getRoleDisplay(role: UserRole): string {
  const displays: Record<UserRole, string> = {
    student: 'Student',
    student_admin: 'Student Admin',
    admin: 'Admin',
    super_admin: 'Super Admin'
  };
  return displays[role] || 'Student';
}
