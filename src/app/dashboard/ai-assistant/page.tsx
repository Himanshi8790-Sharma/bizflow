"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  TrendingUp,
  Boxes,
  Receipt,
  Users,
  Bot,
  User as UserIcon,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { useAskAI } from "@/src/hooks/useAI";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import { useAnalyticsSummary, useExpensesByCategory, useTopProducts } from "@/src/hooks/useAnalytics";
import { useProducts } from "@/src/hooks/useProducts";
import { useOrders } from "@/src/hooks/useOrders";
import { formatCurrency } from "@/src/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  category?: "SALES" | "EXPENSE" | "INVENTORY" | "CUSTOMER" | "GENERAL";
  timestamp: Date;
}

const suggestedPrompts = [
  {
    icon: TrendingUp,
    category: "SALES" as const,
    label: "Sales Performance",
    question: "Analyze our revenue performance and best selling products.",
  },
  {
    icon: Boxes,
    category: "INVENTORY" as const,
    label: "Inventory Alerts",
    question: "Which items are running low on stock and need replenishment?",
  },
  {
    icon: Receipt,
    category: "EXPENSE" as const,
    label: "Cost Optimization",
    question: "Where are we spending the most operational budget?",
  },
  {
    icon: Users,
    category: "CUSTOMER" as const,
    label: "Customer Health",
    question: "What is our customer base status and pending order load?",
  },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "assistant",
      text: "Hello! I am your BizFlow AI Business Advisor. I have real-time access to your sales, inventory levels, customer activity, and expense breakdowns. Ask me anything about your business performance or select a prompt below.",
      category: "GENERAL",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const { data: summary } = useAnalyticsSummary();
  const { data: topProducts } = useTopProducts();
  const { data: expenses } = useExpensesByCategory();
  const { data: productsData } = useProducts(1, 100);
  const { data: orders } = useOrders();
  const askAIMutation = useAskAI();

 const handleAsk = async (
  queryText: string,
  forcedCategory?: ChatMessage["category"]
) => {
  const question = queryText.trim();

  if (!question || isThinking) return;

  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: "user",
    text: question,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInputValue("");
  setIsThinking(true);

  try {
    const result = await askAIMutation.mutateAsync(question);

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "assistant",
      text: result.data.answer,
      category: result.data.queryType || forcedCategory || "GENERAL",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
  } catch (error: unknown) {
    let errorMessage = "Sorry, I couldn't process your question. Please try again.";

    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response;

      errorMessage = response?.data?.message || errorMessage;
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "assistant",
      text: errorMessage,
      category: forcedCategory || "GENERAL",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
  } finally {
    setIsThinking(false);
  }
};

  return (
    <DashboardLayout>
      <div className="mx-auto flex h-[calc(100vh-140px)] w-full max-w-5xl flex-col">
        {/* Header */}
        <div className="mb-4 flex shrink-0 items-center justify-between border-b border-gray-200/80 pb-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                  BizFlow AI Advisor
                </h1>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  Real-time
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Context-aware business intelligence engine connected to your workspace
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Prompt Chips */}
        <div className="mb-4 flex shrink-0 gap-2 overflow-x-auto pb-1">
          {suggestedPrompts.map((prompt) => {
            const Icon = prompt.icon;
            return (
              <button
                key={prompt.label}
                type="button"
                onClick={() => handleAsk(prompt.question, prompt.category)}
                disabled={isThinking}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
              >
                <Icon size={14} className="text-indigo-500" />
                <span>{prompt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Thread */}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-gray-200/80 bg-white/70 p-4 shadow-xs backdrop-blur-xs dark:border-gray-800 dark:bg-gray-900/60">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed sm:text-sm ${
                    isUser
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-850 dark:text-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span
                    className={`mt-2 block text-[10px] ${
                      isUser ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <UserIcon size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-850">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputValue);
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isThinking}
            placeholder="Ask about your sales, pending orders, lowest inventory, or costs..."
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs sm:text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={isThinking || !inputValue.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
