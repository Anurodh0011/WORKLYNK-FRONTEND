// src/hooks/useUser.js
import useSWR from "swr";
import { baseFetcher } from "../helpers/fetcher";
import { API_BASE_URL } from "../helpers/config";

/**
 * Hook to get current authenticated user
 */
export const useUser = () => {
  // Try to get token from localStorage (client-side only)
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const { data, error, mutate, isLoading } = useSWR(
    token ? [`${API_BASE_URL}/auth/me`, token] : null,
    baseFetcher
  );

  return {
    user: data?.data?.user,
    isLoading,
    isError: error,
    mutate,
  };
};
