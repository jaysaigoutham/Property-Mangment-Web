import { env } from "../config/env";
import { authConfig } from "../config/auth";
import { getStoredToken, clearStoredSession } from "../features/auth/auth-storage";
import { ApiError, extractBackendMessage } from "./errors";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  params?: object;
}

const buildUrl = (endpoint: string, params?: object) => {
  const url = new URL(`${env.apiBaseUrl}${endpoint}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    ) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const redirectToLogin = () => {
  if (window.location.pathname === authConfig.loginRedirectPath) {
    return;
  }

  const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
  window.location.assign(`${authConfig.loginRedirectPath}?redirect=${redirect}`);
};

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, params, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (!(body instanceof FormData) && body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(endpoint, params), {
    ...requestOptions,
    headers: requestHeaders,
    body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("Content-Type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json().catch(() => null) : await response.text();

  if (response.status === 401) {
    clearStoredSession();
    redirectToLogin();
  }

  if (!response.ok) {
    throw new ApiError(extractBackendMessage(payload, `Request failed with status ${response.status}`), response.status, payload);
  }

  return payload as T;
}
