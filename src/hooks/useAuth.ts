import { useMutation } from "@tanstack/react-query";
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