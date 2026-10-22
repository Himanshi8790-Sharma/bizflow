import { api } from "@/src/lib/api";

export interface AIQueryResponse {
  success: boolean;
  message: string;
  data: {
    answer: string;
    queryType: "SALES" | "EXPENSE" | "INVENTORY" | "CUSTOMER" | "GENERAL";
  };
}

export const aiService = {
  async askQuestion(question: string): Promise<AIQueryResponse> {
    const response = await api.post<AIQueryResponse>("/ai/query", {
      question,
    });

    return response.data;
  },
};