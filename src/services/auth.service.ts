import { api } from "../lib/api";
import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
  MeResponse,
} from "../types/auth";

export type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  SignupResponse,
  MeResponse,
};

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

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  },
};
