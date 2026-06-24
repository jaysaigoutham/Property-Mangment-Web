const fallbackApiBaseUrl = "http://localhost:8080";

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl),
};
