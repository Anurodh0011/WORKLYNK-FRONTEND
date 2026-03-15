"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { baseFetcher, mutationFetcher } from "../helpers/fetcher";
import { API_BASE_URL } from "../helpers/config";
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
  const { data: userData, error, mutate, isLoading } = useSWR(
    `${API_BASE_URL}/auth/me`,
    baseFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  );

  const fetchUser = useCallback(async () => {
    return await mutate();
  }, [mutate]);

  const { trigger: loginTrigger } = useSWRMutation(
    `${API_BASE_URL}/auth/login`,
    mutationFetcher
  );

  const { trigger: registerTrigger } = useSWRMutation(
    `${API_BASE_URL}/auth/register`,
    mutationFetcher
  );

  const { trigger: logoutTrigger } = useSWRMutation(
    `${API_BASE_URL}/auth/logout`,
    mutationFetcher
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
      await mutate(null, false);
      toast.success("Logged out successfully");
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
