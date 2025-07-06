export const SITE_MAP = {
  // Main Routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  
  // Authentication Routes
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CHANGE_PASSWORD: '/auth/change-password',
  
  // Dashboard Analytics
  ANALYTICS: '/dashboard/analytics',
  
  // Employee Management
  EMPLOYEES: '/employees',
  EMPLOYEE_CREATE: '/employees/create',
  EMPLOYEE_DETAILS: (id: string) => `/employees/${id}`,
  
  // Department Management
  DEPARTMENTS: '/departments',
  DEPARTMENT_CREATE: '/departments/create',
  
  // Attendance Management
  ATTENDANCE: '/attendance',
  ATTENDANCE_CHECK_IN: '/attendance/check-in',
  ATTENDANCE_CHECK_OUT: '/attendance/check-out',
  
  // Project Management
  PROJECTS: '/projects',
  PROJECT_CREATE: '/projects/create',
  PROJECT_DETAILS: (id: string) => `/projects/${id}`,
  
  // Task Management
  TASKS: '/tasks',
  TASK_DETAILS: (id: string) => `/tasks/${id}`,
  KANBAN_BOARD: '/kanban-board',
  
  // Tenant Management
  TENANTS: '/tenants',
  TENANT_CREATE: '/tenants/create',
  TENANT_DETAILS: (id: string) => `/tenants/${id}`,
  
  // User Management
  USERS: '/users',
  USER_CREATE: '/users/create',
  
  // Role Management
  ROLES: '/roles',
  ROLE_CREATE: '/roles/create',
  
  // Permissions
  PERMISSIONS: '/permissions',
  
  // Salary Management
  SALARY: '/salary',
  SALARY_DETAILS: (id: string) => `/salary/${id}`,
  
  // Reports
  REPORTS_ATTENDANCE: '/reports/attendance',
  REPORTS_SALARY: '/reports/salary',
  REPORTS_PROFIT: '/reports/profit',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  
  // Logs
  LOGS: '/logs',
  
  // Settings
  SETTINGS_SYSTEM: '/settings/system',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  SETTINGS_API: '/settings/api',
  SETTINGS_CACHE: '/settings/cache',
  SETTINGS_DB: '/settings/db',
  
  // Management
  MANAGE_BRANCH: '/manage/branch',
  MANAGE_BRAND: '/manage/brand',
  MANAGE_PROJECT: '/manage/project',
  MANAGE_USER: '/manage/user',
}