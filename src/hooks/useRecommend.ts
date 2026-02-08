import { useCallback, useState } from "react";
import mockResponse from "@/mocks/openAIResponse.json";
import type { RecommendResponse } from "@/types/recommend";
import { USE_MOCK_RECOMMEND } from "@/utils/flags";

type Status = "idle" | "loading" | "success" | "error";

async function postRecommend(query: string): Promise<RecommendResponse> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error ?? "Request failed");
  }

  return json as RecommendResponse;
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
        : await postRecommend(query);

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
