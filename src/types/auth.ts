export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
}

export interface AuthOrganization {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  organization: AuthOrganization;
}

export interface SignupPayload {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: AuthUser;
  organization: AuthOrganization;
}

export interface MeResponse {
  user: AuthUser;
  organization: AuthOrganization;
}
