"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { baseFetcher, mutationFetcher } from "../../helpers/fetcher";
import { API_BASE_URL } from "../../helpers/config";
import { toast } from "sonner";

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: async (formData) => ({ success: false, message: "" }),
  register: async (formData) => ({ success: false, message: "" }),
  logout: async () => {},
  fetchUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const {
    data: userData,
    error,
    mutate,
    isLoading,
  } = useSWR(`${API_BASE_URL}/auth/me`, baseFetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const router = useRouter();
  const pathname = usePathname();

  // Fetch meta settings (e.g. MAINTENANCE_MODE)
  const { data: settingsData } = useSWR(`${API_BASE_URL}/auth/settings`, baseFetcher, {
    refreshInterval: 60000, // Check every minute
  });

  // Maintenance mode redirect logic
  useEffect(() => {
    if (settingsData?.data?.MAINTENANCE_MODE === "true") {
      const userRole = userData?.data?.user?.role;
      if (userRole !== "ADMIN" && pathname !== "/maintenance") {
        router.push("/maintenance");
      }
    } else if (pathname === "/maintenance" && settingsData?.data?.MAINTENANCE_MODE === "false") {
      // Auto-recover if maintenance ends
      router.push("/");
    }
  }, [settingsData, userData, pathname, router]);

  // Redirect to login if user is not authenticated on protected routes
  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/projects/new", "/contracts", "/profile", "/admin"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!isLoading && !userData?.data?.user && isProtectedRoute) {
      router.push("/auth/login");
    }
  }, [userData, isLoading, pathname, router]);


  const fetchUser = useCallback(async () => {
    return await mutate();
  }, [mutate]);

  const { trigger: loginTrigger } = useSWRMutation(
    `${API_BASE_URL}/auth/login`,
    mutationFetcher,
  );

  const { trigger: registerTrigger } = useSWRMutation(
    `${API_BASE_URL}/auth/register`,
    mutationFetcher,
  );

  const { trigger: logoutTrigger } = useSWRMutation(
    `${API_BASE_URL}/auth/logout`,
    mutationFetcher,
  );

  /**
   * Login handler
   */
  const login = async (formData) => {
    try {
      const result = await loginTrigger(formData);
      if (result.success) {
        await mutate(); // Refresh user state
        return { success: true, user: result.data.user };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: err.message || "Login failed" };
    }
  };

  /**
   * Register handler
   */
  const register = async (formData) => {
    try {
      const result = await registerTrigger(formData);
      return result; // Backend returns { success, message, data }
    } catch (err) {
      return { success: false, message: err.message || "Registration failed" };
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    try {
      await logoutTrigger();
      // Clear the local cache for /me and update state
      await mutate(`${API_BASE_URL}/auth/me`, null, false);
      toast.success("Logged out successfully");
      router.refresh(); // Force Next.js to refresh server components/state
    } catch (err) {
      toast.error("Logout failed");
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user: userData?.data?.user || null,
        isLoading,
        login,
        register,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
