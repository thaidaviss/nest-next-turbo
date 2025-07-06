import { Role } from '../constants/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | string;
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  username?: string;
  phoneNumber?: string;
  position?: string;
  bio?: string;
  lastLogin?: string;
}

export interface TenantUser extends User {
  tenantId: string;
  tenantRole?: string;
  joinedAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  role: Role | string;
  department?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  role?: Role | string;
  department?: string;
  status?: 'active' | 'inactive' | 'pending';
  avatar?: string;
  phoneNumber?: string;
  position?: string;
  bio?: string;
}
