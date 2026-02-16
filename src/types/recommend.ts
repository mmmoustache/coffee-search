import { Product } from '@/types/product';

export type RecommendResponse = {
  query: string;
  results: Product[];
};

export type RecommendError = {
  message: string;
};
