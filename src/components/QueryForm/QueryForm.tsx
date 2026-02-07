"use client";

import { useState } from "react";
import QueryFormComponent from "@/components/QueryForm/QueryFormComponent";
import mockResponse from "@/mocks/openAIResponse.json";

function QueryForm() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);

  async function onSubmit(parameters: { query: string }) {
    setLoading(true);
    const { query } = parameters;

    try {
      setData(mockResponse);
    } finally {
      setLoading(false);
    }

    // try {
    //   const res = await fetch("/api/recommend", {
    //     method: "POST",
    //     headers: { "content-type": "application/json" },
    //     body: JSON.stringify({ query }),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data?.error ?? "Request failed");

    //   setData(data);
    //   console.log(data);
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <div>
      <QueryFormComponent onSubmit={onSubmit} />
      {loading ? (
        <p>Loading...</p>
      ) : data?.results?.length > 0 ? (
        <>
          <p>
            {data?.results.length} results for {data?.query}
          </p>
          <ul>
            {data?.results.map((result) => (
              <li key={result.sku}>{result.name}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export default QueryForm;
