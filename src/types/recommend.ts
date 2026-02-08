export type RecommendResult = {
  sku: string;
  name: string;
};

export type RecommendResponse = {
  query: string;
  results: RecommendResult[];
  recommendationText: string;
};

export type RecommendError = {
  message: string;
};
