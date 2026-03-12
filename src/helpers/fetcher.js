// src/helpers/fetcher.js

/**
 * Base fetcher for useSWR GET requests
 * @param {[string, string|null]} param0 [url, token]
 */
export const baseFetcher = async ([url, token]) => {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || "An error occurred while fetching data.");
    error.info = errorData;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

/**
 * Mutation fetcher for useSWRMutation or manual calls
 * Handles FormData and JSON automatically
 * @param {string} url 
 * @param {{ arg: any }} options
 */
export const mutationFetcher = async (url, { arg }) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = arg;

  // If body is NOT FormData, stringify it
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  // Note: For FormData, we let the browser set the Content-Type with boundary

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "An error occurred during mutation.");
    error.info = data;
    error.status = response.status;
    throw error;
  }

  return data;
};
