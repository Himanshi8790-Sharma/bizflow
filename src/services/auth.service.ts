import { api } from "../lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

export interface SignupPayload {
  organizationName: string;
  name: string;
  email: string;
  password: string;
}
export interface SignupResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string;
  };
}


export interface MeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  organization: {
    id: string;
    name: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },
  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>("/auth/register", payload);

    return response.data;
  },

    me: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>("/auth/me");
    return response.data;
  },
};
