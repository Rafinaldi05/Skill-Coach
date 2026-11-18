import { useQuery } from "@tanstack/react-query";
import { PortfolioSchema } from "@skill-coach/shared";
import { apiFetch, queryRetry } from "./client";
import { keys } from "./keys";
export function usePortfolio(username: string) {
  return useQuery({ queryKey: keys.portfolio(username), enabled: Boolean(username), retry: queryRetry, queryFn: ({ signal }) => apiFetch(`/public/p/${encodeURIComponent(username)}`, PortfolioSchema, { auth: false, signal }) });
}
