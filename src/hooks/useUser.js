// src/hooks/useUser.js
import useSWR from "swr";
import { baseFetcher } from "../helpers/fetcher";
import { API_BASE_URL } from "../helpers/config";

/**
 * Hook to get current authenticated user
 */
export const useUser = () => {
  const { data, error, mutate, isLoading } = useSWR(
    `${API_BASE_URL}/auth/me`,
    baseFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false
    }
  );

  return {
    user: data?.data?.user,
    isLoading,
    isError: error,
    mutate,
  };
};
