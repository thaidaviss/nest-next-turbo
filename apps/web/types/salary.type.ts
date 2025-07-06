export type SalaryStatus = 'pending' | 'processed' | 'paid' | 'cancelled' | 'on-hold';

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  month: string;
  year: string;
  baseSalary: number;
  overtime: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: SalaryStatus;
  paymentDate: string | null;
  paymentMethod?: string;
  taxAmount?: number;
  insuranceAmount?: number;
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
  currency?: string;
  approvedBy?: string;
  approvedById?: string;
}

export interface SalaryCreateInput {
  employeeId: string;
  month: string;
  year: string;
  baseSalary: number;
  overtime?: number;
  bonus?: number;
  deductions?: number;
  status?: SalaryStatus;
  comments?: string;
}

export interface SalaryUpdateInput {
  baseSalary?: number;
  overtime?: number;
  bonus?: number;
  deductions?: number;
  status?: SalaryStatus;
  paymentDate?: string | null;
  paymentMethod?: string;
  comments?: string;
}

export interface DepartmentSalary {
  department: string;
  totalSalary: number;
  employeeCount: number;
  averageSalary: number;
}

export interface MonthlySalary {
  month: string;
  totalSalary: number;
  employeeCount: number;
  averageSalary: number;
}
