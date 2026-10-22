import { useMutation } from "@tanstack/react-query";

import { aiService } from "@/src/services/ai.service";

export function useAskAI() {
  return useMutation({
    mutationFn: (question: string) => aiService.askQuestion(question),
  });
}