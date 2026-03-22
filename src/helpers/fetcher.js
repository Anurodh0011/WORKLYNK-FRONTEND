// src/helpers/fetcher.js

/**
 * Base fetcher for useSWR GET requests
 * @param {string} url
 */
export const baseFetcher = async (url) => {
  const response = await fetch(url, {
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
export const mutationFetcher = async (url, { arg, method = "POST" }) => {
  const headers = {};
  let body = arg;

  // If body is NOT FormData, stringify it
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method: method,
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
