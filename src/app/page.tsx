"use client";

import QueryForm from "@/components/QueryForm/QueryForm";

export default function Home() {
  return (
    <QueryForm
      onSubmit={() => {
        console.log("submit");
      }}
    />
  );
}
