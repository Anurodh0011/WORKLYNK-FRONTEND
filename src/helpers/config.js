// src/helpers/config.js
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
// export const API_BASE_URL = "https://worklynk-backend.onrender.com/api";
export const BACKEND_URL = API_BASE_URL.replace("/api", "");
