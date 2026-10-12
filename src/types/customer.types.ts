export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateCustomerInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface CustomerPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomersResponse {
  success: boolean;
  customers: Customer[];
  pagination: CustomerPagination;
}

export interface CustomerResponse {
  success: boolean;
  message?: string;
  data: Customer;
}

export interface DeleteCustomerResponse {
  success: boolean;
  message: string;
}