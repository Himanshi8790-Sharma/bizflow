import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export function useLogin(){
    return useMutation({
        mutationFn:authService.login,
    });
}
export function useSignup() {
  return useMutation({
    mutationFn: authService.signup,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    retry: false,
  });
}