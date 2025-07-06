export type TenantStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'archived';
export type TenantPlanType = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: TenantStatus;
  industry: string;
  createdAt: string;
  updatedAt?: string;
  address: string;
  phone: string;
  email: string;
  planType: TenantPlanType;
  logo?: string;
  website?: string;
  employeeCount?: number;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  billingInfo?: TenantBillingInfo;
  settings?: TenantSettings;
}

export interface TenantBillingInfo {
  billingName?: string;
  billingAddress?: string;
  billingEmail?: string;
  vatId?: string;
  paymentMethod?: string;
  cardLastFour?: string;
  cardExpiry?: string;
}

export interface TenantSettings {
  timezone?: string;
  dateFormat?: string;
  language?: string;
  currency?: string;
  workingDays?: string[];
  workHours?: {
    start: string;
    end: string;
  };
  enableNotifications?: boolean;
  ssoEnabled?: boolean;
  twoFactorEnabled?: boolean;
}

export interface TenantCreateInput {
  name: string;
  domain: string;
  industry: string;
  address?: string;
  phone?: string;
  email: string;
  planType?: TenantPlanType;
  logo?: string;
  website?: string;
}

export interface TenantUpdateInput {
  name?: string;
  domain?: string;
  status?: TenantStatus;
  industry?: string;
  address?: string;
  phone?: string;
  email?: string;
  planType?: TenantPlanType;
  logo?: string;
  website?: string;
  settings?: Partial<TenantSettings>;
}
