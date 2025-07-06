export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  employeeCount: number;
  managerName: string;
  managerId: string;
  createdAt: string;
  updatedAt?: string;
  status?: 'active' | 'inactive';
  budget?: number;
  location?: string;
}

export interface DepartmentCreateInput {
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  status?: 'active' | 'inactive';
  budget?: number;
  location?: string;
}

export interface DepartmentUpdateInput {
  name?: string;
  code?: string;
  description?: string;
  managerId?: string;
  status?: 'active' | 'inactive';
  budget?: number;
  location?: string;
}

export interface DepartmentData {
  name: string;
  employeeCount: number;
  value: number;
}
