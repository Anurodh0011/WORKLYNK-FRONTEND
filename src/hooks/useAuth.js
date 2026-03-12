// src/hooks/useAuth.js
import useSWRMutation from "swr/mutation";
import { mutationFetcher } from "../helpers/fetcher";
import { API_BASE_URL } from "../helpers/config";

/**
 * Hook for authentication actions
 */
export const useAuth = () => {
  const { trigger: login, isLeading: isLoggingIn } = useSWRMutation(
    `${API_BASE_URL}/auth/login`,
    mutationFetcher
  );

  const { trigger: register, isLeading: isRegistering } = useSWRMutation(
    `${API_BASE_URL}/auth/register`,
    mutationFetcher
  );

  const { trigger: logout } = useSWRMutation(
    `${API_BASE_URL}/auth/logout`,
    mutationFetcher
  );

  const { trigger: forgotPassword } = useSWRMutation(
    `${API_BASE_URL}/auth/forgot-password`,
    mutationFetcher
  );

  const { trigger: verifyCode } = useSWRMutation(
    `${API_BASE_URL}/auth/verify-code`,
    mutationFetcher
  );

  const { trigger: resetPassword } = useSWRMutation(
    `${API_BASE_URL}/auth/reset-password`,
    mutationFetcher
  );

  return {
    login,
    isLoggingIn,
    register,
    isRegistering,
    logout,
    forgotPassword,
    verifyCode,
    resetPassword,
  };
};
