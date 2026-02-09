import { CSVRow } from '@/types/product';

export type RecommendResponse = {
  query: string;
  results: CSVRow[];
};

export type RecommendError = {
  message: string;
};
