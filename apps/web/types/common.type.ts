import { ReactNode } from "react";

// Generic pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
}

// Generic sort interface
export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Generic filter interface
export interface FilterParams {
  [key: string]: any;
}

// Generic query params interface
export interface QueryParams extends PaginationParams, Partial<SortParams> {
  filters?: FilterParams;
  search?: string;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Option interface for select components
export interface Option {
  label: string;
  value: string;
}

// Custom label props for charts
export interface CustomLabelProps {
  x: number;
  y: number;
  value: number;
  cx?: number;
  cy?: number;
  percent?: number;
  name?: string;
}

// Dashboard chart data interfaces
export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
}

export interface EventData {
  id?: string;
  title: string;
  date: string;
  time?: string;
  type: string;
  description?: string;
}

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Base audit fields
export interface AuditFields {
  createdBy?: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}
