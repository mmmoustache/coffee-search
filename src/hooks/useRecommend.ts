"use client";

import { apiJson } from "@/lib/apiClient";
import { useCallback, useState } from "react";
import type { RecommendResponse } from "@/types/recommend";
import mockResponse from "@/mocks/openAIResponse.json";
import { USE_MOCK_RECOMMEND } from "@/utils/flags";

type Status = "idle" | "loading" | "success" | "error";

function recommend(query: string) {
  return apiJson<RecommendResponse, { query: string }>("/api/recommend", {
    method: "POST",
    body: { query },
  });
}

export function useRecommend() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async ({ query }: { query: string }) => {
    setStatus("loading");
    setError(null);

    try {
      const result = USE_MOCK_RECOMMEND
        ? (mockResponse as RecommendResponse)
        : await recommend(query);

      setData(result);
      setStatus("success");
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
      throw e;
    }
  }, []);

  return {
    submit,
    data,
    error,
    status,
    isLoading: status === "loading",
  };
}
