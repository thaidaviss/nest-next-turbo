/**
 * Application role definitions and permissions
 */

// Role enum
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  EMPLOYEE = 'EMPLOYEE',
  CONTRACTOR = 'CONTRACTOR',
  GUEST = 'GUEST'
}

// Role types
export type RoleType = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'HR_MANAGER' 
  | 'PROJECT_MANAGER' 
  | 'FINANCE_MANAGER'
  | 'TEAM_LEADER'
  | 'EMPLOYEE'
  | 'CONTRACTOR'
  | 'GUEST';

// Role definitions with display names and descriptions
export interface RoleInfo {
  id: RoleType;
  name: string;
  description: string;
  level: number; // Higher number means higher privileges
}

export const ROLES: Record<RoleType, RoleInfo> = {
  [Role.SUPER_ADMIN]: {
    id: Role.SUPER_ADMIN,
    name: 'Super Administrator',
    description: 'Full system access with all privileges',
    level: 100
  },
  [Role.ADMIN]: {
    id: Role.ADMIN,
    name: 'Administrator',
    description: 'Administrative access to manage system settings and users',
    level: 90
  },
  [Role.HR_MANAGER]: {
    id: Role.HR_MANAGER,
    name: 'HR Manager',
    description: 'Manages employees, departments, attendance and payroll',
    level: 80
  },
  [Role.PROJECT_MANAGER]: {
    id: Role.PROJECT_MANAGER,
    name: 'Project Manager',
    description: 'Manages projects, tasks, and team assignments',
    level: 70
  },
  [Role.FINANCE_MANAGER]: {
    id: Role.FINANCE_MANAGER,
    name: 'Finance Manager',
    description: 'Manages company finances, salary processing, and reports',
    level: 70
  },
  [Role.TEAM_LEADER]: {
    id: Role.TEAM_LEADER,
    name: 'Team Leader',
    description: 'Leads team members and manages tasks within a project',
    level: 60
  },
  [Role.EMPLOYEE]: {
    id: Role.EMPLOYEE,
    name: 'Employee',
    description: 'Regular employee with access to personal data and assigned tasks',
    level: 40
  },
  [Role.CONTRACTOR]: {
    id: Role.CONTRACTOR,
    name: 'Contractor',
    description: 'External contractor with limited system access',
    level: 30
  },
  [Role.GUEST]: {
    id: Role.GUEST,
    name: 'Guest',
    description: 'Limited view-only access to specific areas',
    level: 10
  }
};

// Legacy role mapping for compatibility with existing code
export const LEGACY_ROLE_MAP: Record<string, RoleType> = {
  'admin': Role.ADMIN,
  'user': Role.EMPLOYEE,
  'editor': Role.TEAM_LEADER
};

// Role hierarchy checking function
export const hasRolePermission = (userRole: RoleType, requiredRole: RoleType): boolean => {
  return ROLES[userRole].level >= ROLES[requiredRole].level;
};

// Get available roles for assignment based on the user's own role
export const getAssignableRoles = (userRole: RoleType): RoleInfo[] => {
  const userLevel = ROLES[userRole].level;
  
  // Users can only assign roles with a lower level than their own
  return Object.values(ROLES).filter(role => role.level < userLevel);
};

// Default role for new users
export const DEFAULT_ROLE: RoleType = Role.EMPLOYEE;

export default ROLES;